// PayrollAnonymizer — Cloakroom invoke-anonymizer.
//
// Called by the live STRK20 pool via InvokeExternal (phase 7, at most once per
// tx). Verified against packages/privacy at tag PRIVACY-0.14.3-RC.0:
//
//   - `_apply_invoke` always calls `INVOKE_SELECTOR`, which is
//     `selector!("privacy_invoke")` in privacy::utils::constants. This
//     contract therefore exposes exactly one pool-callable entry point,
//     `privacy_invoke`, and routes on `VestingOperation` (Serde variant
//     0/1/2). That is the same encoding as Vesu's
//     `calldata: [0n /* Deposit */, ...]`. A raw `Span<felt252>` first
//     argument would make felt[0] a length prefix, so Vesu-style calldata
//     would not decode.
//   - This contract never calls `deposit_to_open_note`. That is internal
//     on the pool (`_deposit_to_open_note`). We return
//     `Span<privacy::objects::OpenNoteDeposit>` and APPROVE the pool to
//     pull; the pool then `checked_transfer_from(token, sender: this,
//     recipient: pool, amount)` for each entry.
//   - Field order of OpenNoteDeposit (objects.cairo, and the pool's
//     destructure): `note_id`, `token`, `amount: u128` — not u256.
//   - Withdraw (`TransferTo`) only requires a non-zero `to_addr`; a
//     contract is a valid recipient. Withdraw is phase 6, InvokeExternal
//     is phase 7, so tokens are in this contract's ERC-20 balance before
//     `privacy_invoke` runs.
//   - IERC20 dispatcher used by this repo's anonymizers:
//     `openzeppelin::interfaces::token::erc20`. The pool itself transfers
//     via `starkware_utils::erc20::erc20_utils`; helpers approve through OZ.
//   - Returned span length must equal the number of CreateOpenNote actions
//     in the same tx (`undeposited_open_notes`). Lock returns empty;
//     Claim returns 1; ClaimBatch returns N, in input order.

use privacy::objects::OpenNoteDeposit;
use starknet::ContractAddress;

/// Domain-separation tag for vesting commitment hashes (Escrow pattern).
pub const VESTING_COMMITMENT_TAG: felt252 = 'VESTING_COMMITMENT_TAG:V1';

/// `poseidon(VESTING_COMMITMENT_TAG, secret)`. Lock stores this hash; Claim
/// recomputes it from the secret and never trusts a caller-supplied vesting_id.
pub fn compute_vesting_id(secret: felt252) -> felt252 {
    core::poseidon::poseidon_hash_span([VESTING_COMMITMENT_TAG, secret].span())
}

#[derive(Drop, Serde, Copy, PartialEq, Debug, starknet::Store)]
pub struct VestingCommitment {
    pub token: ContractAddress,
    pub total_amount: u128,
    pub claimed_amount: u128,
    pub cliff_timestamp: u64,
    pub end_timestamp: u64,
    pub is_active: bool,
}

/// Serde variant index is the operation code the SDK puts in calldata[0].
#[derive(Drop, Serde, Copy, PartialEq, Debug)]
pub enum VestingOperation {
    Lock,
    Claim,
    ClaimBatch,
}

#[starknet::interface]
pub trait IPayrollAnonymizer<T> {
    fn get_vesting(self: @T, vesting_id: felt252) -> VestingCommitment;
    fn get_session_budget(self: @T, session_key_id: felt252) -> u128;
    fn get_session_expiry(self: @T, session_key_id: felt252) -> u64;
    fn get_owner(self: @T) -> ContractAddress;
    fn get_pool_address(self: @T) -> ContractAddress;

    /// Owner-only. Registers (or overwrites) a payroll-cycle session budget + expiry.
    fn register_session_key(
        ref self: T, session_key_id: felt252, budget: u128, expires_at: u64,
    );

    /// Owner-only. Zeroes the remaining budget so further Locks cannot debit it.
    fn revoke_session_key(ref self: T, session_key_id: felt252);

    /// Pool-only. Called at `selector!("privacy_invoke")`.
    ///
    /// **Lock (0)** — records a schedule keyed by `vesting_id` =
    /// `poseidon(VESTING_COMMITMENT_TAG, secret)` computed off-chain.
    /// Tokens already arrived via Withdraw. Empty span.
    /// Uses `vesting_id`, `token`, `amount`, timestamps, `session_key_id`.
    /// `secret`, `note_id`, `batch` ignored.
    ///
    /// **Claim (1)** — recomputes `vesting_id` from `secret` (Escrow Claim).
    /// Ignores the passed-in `vesting_id`. Funds one open note.
    ///
    /// **ClaimBatch (2)** — `batch` is `(secret, note_id)` pairs in CreateOpenNote
    /// order. Each secret is hashed; caller-supplied ids are not trusted.
    fn privacy_invoke(
        ref self: T,
        operation: VestingOperation,
        vesting_id: felt252,
        token: ContractAddress,
        amount: u128,
        cliff_timestamp: u64,
        end_timestamp: u64,
        session_key_id: felt252,
        secret: felt252,
        note_id: felt252,
        batch: Span<(felt252, felt252)>,
    ) -> Span<OpenNoteDeposit>;
}

pub mod errors {
    pub const CALLER_NOT_POOL: felt252 = 'CALLER_NOT_POOL';
    pub const CALLER_NOT_OWNER: felt252 = 'CALLER_NOT_OWNER';
    pub const ZERO_VESTING_ID: felt252 = 'ZERO_VESTING_ID';
    pub const ZERO_TOKEN: felt252 = 'ZERO_TOKEN';
    pub const ZERO_AMOUNT: felt252 = 'ZERO_AMOUNT';
    pub const ZERO_SESSION_KEY: felt252 = 'ZERO_SESSION_KEY';
    pub const ZERO_BUDGET: felt252 = 'ZERO_BUDGET';
    pub const BAD_TIMESTAMPS: felt252 = 'BAD_TIMESTAMPS';
    pub const VESTING_ID_USED: felt252 = 'VESTING_ID_USED';
    pub const VESTING_NOT_ACTIVE: felt252 = 'VESTING_NOT_ACTIVE';
    pub const NOTHING_VESTED: felt252 = 'NOTHING_VESTED';
    pub const SESSION_EXPIRED: felt252 = 'SESSION_EXPIRED';
    pub const SESSION_BUDGET: felt252 = 'SESSION_BUDGET';
    pub const EMPTY_BATCH: felt252 = 'EMPTY_BATCH';
    pub const BATCH_TOKEN_MISMATCH: felt252 = 'BATCH_TOKEN_MISMATCH';
    pub const ZERO_SECRET: felt252 = 'ZERO_SECRET';
}

#[starknet::contract]
pub mod PayrollAnonymizer {
    use core::num::traits::Zero;
    use openzeppelin::interfaces::token::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use privacy::objects::OpenNoteDeposit;
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    use super::{
        IPayrollAnonymizer, VestingCommitment, VestingOperation, compute_vesting_id, errors,
    };

    #[storage]
    struct Storage {
        pool_address: ContractAddress,
        owner: ContractAddress,
        vesting_channels: Map<felt252, VestingCommitment>,
        hr_session_budgets: Map<felt252, u128>,
        hr_session_expiries: Map<felt252, u64>,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, pool_address: ContractAddress, owner: ContractAddress,
    ) {
        self.pool_address.write(pool_address);
        self.owner.write(owner);
    }

    #[abi(embed_v0)]
    impl PayrollAnonymizerImpl of IPayrollAnonymizer<ContractState> {
        fn get_vesting(self: @ContractState, vesting_id: felt252) -> VestingCommitment {
            self.vesting_channels.read(vesting_id)
        }

        fn get_session_budget(self: @ContractState, session_key_id: felt252) -> u128 {
            self.hr_session_budgets.read(session_key_id)
        }

        fn get_session_expiry(self: @ContractState, session_key_id: felt252) -> u64 {
            self.hr_session_expiries.read(session_key_id)
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }

        fn get_pool_address(self: @ContractState) -> ContractAddress {
            self.pool_address.read()
        }

        fn register_session_key(
            ref self: ContractState, session_key_id: felt252, budget: u128, expires_at: u64,
        ) {
            assert(get_caller_address() == self.owner.read(), errors::CALLER_NOT_OWNER);
            assert(session_key_id.is_non_zero(), errors::ZERO_SESSION_KEY);
            assert(budget.is_non_zero(), errors::ZERO_BUDGET);
            assert(expires_at > get_block_timestamp(), errors::SESSION_EXPIRED);
            self.hr_session_budgets.write(session_key_id, budget);
            self.hr_session_expiries.write(session_key_id, expires_at);
        }

        fn revoke_session_key(ref self: ContractState, session_key_id: felt252) {
            assert(get_caller_address() == self.owner.read(), errors::CALLER_NOT_OWNER);
            self.hr_session_budgets.write(session_key_id, 0);
            self.hr_session_expiries.write(session_key_id, 0);
        }

        fn privacy_invoke(
            ref self: ContractState,
            operation: VestingOperation,
            vesting_id: felt252,
            token: ContractAddress,
            amount: u128,
            cliff_timestamp: u64,
            end_timestamp: u64,
            session_key_id: felt252,
            secret: felt252,
            note_id: felt252,
            batch: Span<(felt252, felt252)>,
        ) -> Span<OpenNoteDeposit> {
            let pool = self.pool_address.read();
            assert(get_caller_address() == pool, errors::CALLER_NOT_POOL);

            match operation {
                VestingOperation::Lock => {
                    self
                        ._lock_vesting(
                            vesting_id,
                            token,
                            amount,
                            cliff_timestamp,
                            end_timestamp,
                            session_key_id,
                        );
                    array![].span()
                },
                VestingOperation::Claim => {
                    let deposit = self._claim_vesting(secret, note_id);
                    self._approve_pool(pool, deposit.token, deposit.amount);
                    array![deposit].span()
                },
                VestingOperation::ClaimBatch => {
                    assert(batch.len().is_non_zero(), errors::EMPTY_BATCH);
                    let mut deposits: Array<OpenNoteDeposit> = array![];
                    let mut i: usize = 0;
                    let mut total: u128 = 0;
                    let mut batch_token: ContractAddress = Zero::zero();
                    while i < batch.len() {
                        let (row_secret, open_note_id) = *batch.at(i);
                        let deposit = self._claim_vesting(row_secret, open_note_id);
                        if batch_token.is_zero() {
                            batch_token = deposit.token;
                        } else {
                            assert(deposit.token == batch_token, errors::BATCH_TOKEN_MISMATCH);
                        }
                        total += deposit.amount;
                        deposits.append(deposit);
                        i += 1;
                    }
                    self._approve_pool(pool, batch_token, total);
                    deposits.span()
                },
            }
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _lock_vesting(
            ref self: ContractState,
            vesting_id: felt252,
            token: ContractAddress,
            amount: u128,
            cliff_timestamp: u64,
            end_timestamp: u64,
            session_key_id: felt252,
        ) {
            assert(vesting_id.is_non_zero(), errors::ZERO_VESTING_ID);
            assert(token.is_non_zero(), errors::ZERO_TOKEN);
            assert(amount.is_non_zero(), errors::ZERO_AMOUNT);
            assert(end_timestamp > cliff_timestamp, errors::BAD_TIMESTAMPS);

            self._consume_session_budget(session_key_id, amount);

            let existing = self.vesting_channels.read(vesting_id);
            assert(!existing.is_active, errors::VESTING_ID_USED);

            // Tokens already sit in this contract's balance from Withdraw (phase 6).
            self
                .vesting_channels
                .write(
                    vesting_id,
                    VestingCommitment {
                        token,
                        total_amount: amount,
                        claimed_amount: 0,
                        cliff_timestamp,
                        end_timestamp,
                        is_active: true,
                    },
                );
        }

        fn _claim_vesting(
            ref self: ContractState, secret: felt252, open_note_id: felt252,
        ) -> OpenNoteDeposit {
            assert(secret.is_non_zero(), errors::ZERO_SECRET);
            let vesting_id = compute_vesting_id(secret);
            let mut channel = self.vesting_channels.read(vesting_id);
            assert(channel.is_active, errors::VESTING_NOT_ACTIVE);

            let claimable = unlocked_amount(@channel, get_block_timestamp())
                - channel.claimed_amount;
            assert(claimable.is_non_zero(), errors::NOTHING_VESTED);

            channel.claimed_amount += claimable;
            if channel.claimed_amount == channel.total_amount {
                channel.is_active = false;
            }
            self.vesting_channels.write(vesting_id, channel);

            OpenNoteDeposit { note_id: open_note_id, token: channel.token, amount: claimable }
        }

        fn _consume_session_budget(
            ref self: ContractState, session_key_id: felt252, amount: u128,
        ) {
            assert(session_key_id.is_non_zero(), errors::ZERO_SESSION_KEY);
            let expiry = self.hr_session_expiries.read(session_key_id);
            assert(expiry > get_block_timestamp(), errors::SESSION_EXPIRED);
            let budget = self.hr_session_budgets.read(session_key_id);
            assert(budget >= amount, errors::SESSION_BUDGET);
            self.hr_session_budgets.write(session_key_id, budget - amount);
        }

        fn _approve_pool(
            ref self: ContractState, pool: ContractAddress, token: ContractAddress, amount: u128,
        ) {
            IERC20Dispatcher { contract_address: token }
                .approve(spender: pool, amount: amount.into());
        }
    }

    fn unlocked_amount(channel: @VestingCommitment, now: u64) -> u128 {
        if now < *channel.cliff_timestamp {
            return 0;
        }
        if now >= *channel.end_timestamp {
            return *channel.total_amount;
        }
        let elapsed: u256 = (now - *channel.cliff_timestamp).into();
        let duration: u256 = (*channel.end_timestamp - *channel.cliff_timestamp).into();
        let total: u256 = (*channel.total_amount).into();
        (total * elapsed / duration).try_into().unwrap()
    }
}
