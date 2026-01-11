import type { DynamicContextPruningConfig } from "../../config";
import type { PruningResult } from "./pruning-types";
export declare function executeDynamicContextPruning(sessionID: string, config: DynamicContextPruningConfig, client: any): Promise<PruningResult>;
