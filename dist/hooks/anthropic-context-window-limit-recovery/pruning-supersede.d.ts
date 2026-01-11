import type { PruningState } from "./pruning-types";
export interface SupersedeWritesConfig {
    enabled: boolean;
    aggressive: boolean;
}
export declare function executeSupersedeWrites(sessionID: string, state: PruningState, config: SupersedeWritesConfig, protectedTools: Set<string>): number;
