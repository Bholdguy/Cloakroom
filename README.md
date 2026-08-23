# Cloakroom

Corporate private payroll and treasury management as an **application layer** on the live [STRK20 Privacy Pool](https://github.com/starkware-libs/starknet-privacy). Built for the Starknet STRK20 Private Sprint (target: 31 August 2026 mainnet).

Cloakroom does **not** implement a privacy pool, Poseidon note hashing, ZK verifiers, or custom notes. Private transfers, notes, and proofs are handled by the official pool + SDK. The only Cairo surface here is a stateful vesting anonymizer called by the pool via Phase 7 `InvokeExternal` (`privacy_invoke`).

## What lives where

| Path | Role |
| --- | --- |
| `contracts/` | `PayrollAnonymizer` — Lock / Claim vesting helper |
| `backend/` | Employer CLI: CSV payroll via the raw Privacy SDK; vesting `privacy_invoke` |
| `config/deployments.json` | Live pool class hash + deployed addresses |

Plain batched disbursements with **no vesting** are **SDK-side**: chained `.transfer()` calls against the pool. There is no `payroll_batcher` contract.

Vesting (lock principal, later claim vested amount into an open note) **is** on-chain, because it is stateful. That is the only extra module.

## Toolchain

Pins below are taken from the [compatibility matrix](https://github.com/starkware-libs/starknet-privacy/blob/main/README.md) and the Privacy Pool tag's own workspace, not guessed.

| Tool | Version | Source |
| --- | --- | --- |
| Starknet Foundry (`snforge` / `sncast`) | **0.59.0** | `packages/privacy/README.md` at tag `PRIVACY-0.14.3-RC.0` (`snforge version: 0.59.0`); that tag's root `Scarb.toml` pins `snforge_std = "0.59.0"` |
| Scarb / Cairo | **2.17.x** (`edition = "2024_07"`, `starknet = "2.17.0"`) | Same tag's workspace `Scarb.toml` |
| Privacy Pool Cairo package | git tag **`PRIVACY-0.14.3-RC.0`** | Compatibility matrix, *Privacy Pool* row |
| Privacy SDK | npm **`0.14.3-rc.2`** (git tag **`PRIVACY-0.14.3-RC.2`**) | Compatibility matrix, *SDK* row; `sdk/package.json` at that tag |
| `starknet` (JS) | **10.4.0** | [STRK20 starter kit](https://github.com/Akashneelesh/strk20-starter-kit) `package.json` |
| Node.js | **>= 24** | SDK README at `PRIVACY-0.14.3-RC.2` (`ohttp-ts` needs WebCrypto) |
| Rust | stable | Privacy repo README, Prerequisites |
| `starknet-devnet` | **v0.8.0-rc.3** | SDK README at `PRIVACY-0.14.3-RC.2` |

Install Cairo tooling with [starkup](https://github.com/software-mansion/starkup):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.starkup.dev | sh
```

Then pin Foundry to 0.59.0 (whatever installer you use — asdf, starkup, or the Foundry install script). Confirm:

```bash
scarb --version    # Cairo 2.17.x
snforge --version  # 0.59.0
node --version     # v24+
rustc --version    # stable
```

## Contracts

```bash
cd contracts
scarb build
scarb test          # wraps snforge test
```

`PayrollAnonymizer` follows the [escrow helper](https://strk20-by-example.org/helpers/escrow) pattern:

1. First line of `privacy_invoke`: `assert(get_caller_address() == privacy_contract, ...)`.
2. Typed Serde parameter list — no manual `felt252` calldata parsing.
3. **Lock** stores the schedule and returns an empty `Span<OpenNoteDeposit>` (tokens already arrived via a prior Withdraw in the same tx).
4. **Claim** computes vested-but-unclaimed `u128`, **approves** the pool (does not transfer), returns a one-entry span of `OpenNoteDeposit`.
5. Session-key budget + expiry is checked on Lock. `register_session_key` / `revoke_session_key` are **owner-only**.

Constructor arguments: `privacy_contract`, `owner`.

Declare / deploy with sncast from `contracts/` (see `snfoundry.toml`):

```bash
scarb --profile release build
sncast --profile sepolia declare --contract-name PayrollAnonymizer
sncast --profile sepolia deploy --class-hash <CLASS_HASH> \
  --constructor-calldata <POOL_ADDRESS> <OWNER_ADDRESS>
```

Pool addresses: `config/deployments.json`. Mainnet pool address is confirmed in [Day 0](https://github.com/starkience/strk20-hackathon/blob/main/docs/MAINNET-DAY-0.md). **Sepolia pool address is not published** in the compatibility matrix or those deploy docs — the field is left empty rather than guessed.

## Backend (employer SDK)

This is the **employer treasury path**: the process holds the account private key and viewing key and talks to the pool through `@starkware-libs/starknet-privacy-sdk@0.14.3-rc.2`. It is **not** the employee-facing UI. Recipients claim/view through a privacy-enabled wallet (STRK20 starter kit / Wallet API). Do not copy that wallet-delegated flow into `backend/`.

The SDK is the official tree at git tag **`PRIVACY-0.14.3-RC.2`**. npm cannot install `github:starkware-libs/starknet-privacy#PRIVACY-0.14.3-RC.2` as a package: that repo has **no root `package.json`** (the npm package lives in `sdk/`). `npm install` therefore clones that exact tag into `backend/vendor/starknet-privacy` and depends on `file:vendor/starknet-privacy/sdk` — still the authentic SDK, compiled with its own `tsc`.

```bash
cd backend
cp .env.example .env   # fill keys, RPC, proving URL
npm install            # clones tag PRIVACY-0.14.3-RC.2, builds sdk/, installs Cloakroom
npm run build
```

Do not use `@starknet-privacy/sdk`.

`dotenv` and `csv-parse` are **not** in the STRK20 compatibility matrix, so they stay unpinned (`*`) until you lock a working set.

### Commands

| Command | What it does |
| --- | --- |
| `npm run payroll -- --csv examples/payroll.csv` | One private tx: chained `.transfer()` per CSV row (no anonymizer) |
| `npm run lock -- --csv examples/vesting.csv` | Per row, one tx: Withdraw to `PayrollAnonymizer` + `privacy_invoke(Lock)` |
| `npm run claim -- --csv examples/vesting.csv` | One tx: open notes for each employee + `privacy_invoke(ClaimBatch)` |
| `npm run session -- --id 42 --budget ... --expires ...` | Owner-only public `register_session_key` on the anonymizer |
| `npm run register` | Pool `SetViewingKey` for the employer account |
| `npm run balance` | Discover unspent notes (read-only) |

Add `--simulate` to prove nothing and skip submit (`simulate()` uses the SDK mock prover for calldata/fee shape).

CSV amounts are **integer base units** (`u128`, the pool note width). Lock/claim rows also need `vesting_id`, `cliff_ts`, `end_ts`, `session_key_id`.

The CLI waits the SDK's ~10-block proving window between private txs (`CLOAKROOM_PROVING_DEPTH`). `execute()` returns `apply_actions` + proof; this process submits that call with `proofFacts` / `proof`.

Vesting: at most one `InvokeExternal` per pool tx. Lock is one schedule per tx. ClaimBatch funds N open notes in one tx; returned `OpenNoteDeposit` count must match `CreateOpenNote` count.

## Execution shape (Phase 7)

```
Withdraw from pool → PayrollAnonymizer.privacy_invoke → (Lock: park) | (Claim: approve + OpenNoteDeposit)
```

The pool, not Cloakroom, pulls tokens after a Claim. Never `transfer` output to the pool from the helper.

## Out of scope on purpose

- No custom pool, no duplicated cryptography, no custom note types.
- This workspace does **not** include hackathon submission-manifest scaffolding (for example a `strk20.json` file). That requirement has not been confirmed against the actual hackathon rules or the starter kit in this init. Add it separately only after checking the private builders group or official docs for whether it is real.

## References

- [Compatibility matrix](https://github.com/starkware-libs/starknet-privacy/blob/main/README.md)
- [Privacy SDK](https://github.com/starkware-libs/starknet-privacy/blob/PRIVACY-0.14.3-RC.2/sdk/README.md)
- [Anonymizer anatomy](https://strk20-by-example.org/helpers/privacy-invoke)
- [Escrow helper (pattern source)](https://strk20-by-example.org/helpers/escrow)
- [RFP-11 Private payroll](https://strk20.starknet.io/rfp/private-payroll)
- [STRK20 starter kit](https://github.com/Akashneelesh/strk20-starter-kit)
