/**
 * Standalone JSON-RPC client for the proving service (starknet_proveTransaction, etc.).
 * Structured similarly to starknet's RpcProvider.
 */
import type { BlockIdentifier } from "starknet";
import type { ProofInvocation } from "../interfaces.js";
import type { OhttpClient } from "./ohttp-client.js";
/** Default request timeout: 30s (proofs typically take a few seconds). */
export declare const DEFAULT_REQUEST_TIMEOUT_MS = 30000;
/**
 * Structured error from the proving service JSON-RPC endpoint.
 *
 * The `code` field is a numeric JSON-RPC error code that callers can switch on:
 *
 * **Prover codes (Starknet RPC v0.10):**
 * - `24`    — Block not found
 * - `55`    — Account validation failed
 * - `61`    — Unsupported transaction version
 * - `1000`  — Invalid transaction input
 * - `-32005` — Service busy (retry later)
 * - `-32603` — Internal prover error
 *
 * **Proxy interceptor codes (1xxxx range):**
 * - `10000` — Transaction rejected (e.g. screening/compliance)
 */
export declare class ProvingServiceError extends Error {
    readonly code: number;
    readonly data?: string | undefined;
    readonly name = "ProvingServiceError";
    constructor(code: number, message: string, data?: string | undefined);
}
export interface ProvingServiceConfig {
    baseUrl: string;
    /** Request timeout in ms. Default 30_000 (30 seconds). */
    requestTimeoutMs?: number;
    /** When set, requests are encrypted via OHTTP instead of plain fetch. */
    ohttpClient?: OhttpClient;
}
/** Result of starknet_proveTransaction. */
export interface ProveTransactionResult {
    /** Proof data: base64-encoded binary from the proving service. */
    proof: string;
    proof_facts: string[];
    l2_to_l1_messages: MessageToL1[];
    /**
     * Optional typed side-channel the prover attaches alongside the proof.
     * For screened deposits it carries the screening signature; absent for
     * transactions that need no attestation. Forward-compatible: new capabilities
     * add sibling keys without breaking existing consumers.
     */
    additional_data?: AdditionalData;
}
export interface MessageToL1 {
    from_address: string;
    to_address: string;
    payload: string[];
}
/**
 * Screening attestation produced by the FPI cloud function and relayed by the
 * proof interceptor / prover. The contract verifies it against the proven
 * deposit's `from_addr`.
 *
 * Felts are 0x-hex strings on the wire; `issued_at` is unix seconds.
 */
export interface ScreeningSignature {
    issued_at: number;
    sig_r: string;
    sig_s: string;
}
/** Typed `additional_data` side-channel on a prove response. */
export interface AdditionalData {
    signature?: ScreeningSignature;
}
export declare class ProvingService {
    private baseUrl;
    private requestTimeoutMs;
    private ohttpClient?;
    constructor(config: ProvingServiceConfig);
    private call;
    getSpecVersion(): Promise<string>;
    proveTransaction(blockId: BlockIdentifier, transaction: ProofInvocation): Promise<ProveTransactionResult>;
    isHealthy(): Promise<boolean>;
}
//# sourceMappingURL=proving-service.d.ts.map