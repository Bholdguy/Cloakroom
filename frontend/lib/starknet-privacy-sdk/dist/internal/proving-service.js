/**
 * Standalone JSON-RPC client for the proving service (starknet_proveTransaction, etc.).
 * Structured similarly to starknet's RpcProvider.
 */
import { z } from "zod";
/** Default request timeout: 30s (proofs typically take a few seconds). */
export const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
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
export class ProvingServiceError extends Error {
    code;
    data;
    name = "ProvingServiceError";
    constructor(code, message, data) {
        super(data ? `${message}: ${data}` : message);
        this.code = code;
        this.data = data;
    }
}
const MessageToL1Schema = z
    .object({
    from_address: z.string(),
    to_address: z.string(),
    payload: z.array(z.string()),
})
    .strict();
const ScreeningSignatureSchema = z
    .object({
    issued_at: z.number(),
    sig_r: z.string(),
    sig_s: z.string(),
})
    .strict();
const AdditionalDataSchema = z
    .object({
    signature: ScreeningSignatureSchema.optional(),
})
    .strict();
const ProveTransactionResultSchema = z
    .object({
    proof: z.string().min(1),
    proof_facts: z.array(z.string()),
    l2_to_l1_messages: z.array(MessageToL1Schema),
    additional_data: AdditionalDataSchema.optional(),
})
    .strict();
export class ProvingService {
    baseUrl;
    requestTimeoutMs;
    ohttpClient;
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.requestTimeoutMs = config.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
        this.ohttpClient = config.ohttpClient;
    }
    async call(method, params) {
        const body = {
            jsonrpc: "2.0",
            id: Date.now(),
            method,
            params,
        };
        let json;
        if (this.ohttpClient) {
            json = await this.ohttpClient.post("", body);
        }
        else {
            const res = await fetch(this.baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(this.requestTimeoutMs),
            });
            const text = await res.text();
            if (!res.ok) {
                throw new Error(`Proving service HTTP ${res.status}: ${text}`);
            }
            json = JSON.parse(text);
        }
        if (json.error) {
            const { code, message, data } = json.error;
            throw new ProvingServiceError(code, message, typeof data === "string" ? data : undefined);
        }
        const result = json.result;
        if (result === undefined) {
            throw new Error("Proving service returned no result");
        }
        return result;
    }
    async getSpecVersion() {
        return this.call("starknet_specVersion", []);
    }
    async proveTransaction(blockId, transaction) {
        const blockIdParam = typeof blockId === "number" || typeof blockId === "bigint"
            ? { block_number: Number(blockId) }
            : blockId;
        const result = await this.call("starknet_proveTransaction", {
            block_id: blockIdParam,
            transaction,
        });
        const parsed = ProveTransactionResultSchema.safeParse(result);
        if (!parsed.success) {
            const snippet = typeof result === "object" && result !== null
                ? JSON.stringify(result).slice(0, 500)
                : String(result);
            throw new Error(`Proving service returned invalid result: expected { proof, proof_facts, l2_to_l1_messages }. ${parsed.error.message} Response: ${snippet}`);
        }
        return parsed.data;
    }
    async isHealthy() {
        try {
            await this.getSpecVersion();
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=proving-service.js.map