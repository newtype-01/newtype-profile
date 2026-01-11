import type { PruningState } from "./pruning-types";
export interface DeduplicationConfig {
    enabled: boolean;
    protectedTools?: string[];
}
export declare function createToolSignature(toolName: string, input: unknown): string;
export declare function executeDeduplication(sessionID: string, state: PruningState, config: DeduplicationConfig, protectedTools: Set<string>): number;
