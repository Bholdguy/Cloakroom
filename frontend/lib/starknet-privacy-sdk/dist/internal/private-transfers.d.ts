/**
 * Real PrivateTransfers implementation using Starknet contracts.
 */
import type { Actions, ExecuteOptions, ExecuteResult, ProofProviderInterface, DiscoveryProviderInterface, ViewingKeyProvider, StarknetAddress, ProofInvocationResult, ProvingBlockId, PrivateTransfersUser } from "../interfaces.js";
import type { TypedContractV2 } from "starknet";
import { PrivacyPoolABI } from "./abi.js";
import { AbstractPrivateTransfers } from "./abstract-private-transfers.js";
import type { ProofInvocationFactoryInterface } from "./proof-invocation-factory.js";
import { type PoolCapabilityMode } from "./pool-mode.js";
export type PrivacyPoolContract = TypedContractV2<typeof PrivacyPoolABI>;
export declare class PrivateTransfers extends AbstractPrivateTransfers {
    private readonly params;
    constructor(params: {
        account: PrivateTransfersUser;
        viewingKeyProvider: ViewingKeyProvider;
        provingProvider: ProofProviderInterface;
        discoveryProvider: DiscoveryProviderInterface;
        proofInvocationFactory: ProofInvocationFactoryInterface;
        poolContractAddress: StarknetAddress;
        poolMode?: PoolCapabilityMode;
    });
    private getCompiler;
    createProofInvocation(actions: Actions, options?: Omit<ExecuteOptions, "provingBlockId">): Promise<ProofInvocationResult>;
    invalidateProofNonceCache(): void;
    executeWithInvocation({ invocation, registry, warnings }: ProofInvocationResult, provingBlockId?: ProvingBlockId): Promise<ExecuteResult>;
}
//# sourceMappingURL=private-transfers.d.ts.map