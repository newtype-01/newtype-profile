import type { AutoCompactState } from "./types";
import type { ExperimentalConfig } from "../../config";
export declare function getLastAssistant(sessionID: string, client: any, directory: string): Promise<Record<string, unknown> | null>;
export declare function executeCompact(sessionID: string, msg: Record<string, unknown>, autoCompactState: AutoCompactState, client: any, directory: string, experimental?: ExperimentalConfig, dcpForCompaction?: boolean): Promise<void>;
