import type { PruningState } from "./pruning-types";
export interface PurgeErrorsConfig {
    enabled: boolean;
    turns: number;
    protectedTools?: string[];
}
export declare function executePurgeErrors(sessionID: string, state: PruningState, config: PurgeErrorsConfig, protectedTools: Set<string>): number;
