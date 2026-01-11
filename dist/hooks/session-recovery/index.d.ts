import type { PluginInput } from "@opencode-ai/plugin";
import type { ExperimentalConfig } from "../../config";
export interface SessionRecoveryOptions {
    experimental?: ExperimentalConfig;
}
type RecoveryErrorType = "tool_result_missing" | "thinking_block_order" | "thinking_disabled_violation" | null;
interface MessageInfo {
    id?: string;
    role?: string;
    sessionID?: string;
    parentID?: string;
    error?: unknown;
}
export declare function detectErrorType(error: unknown): RecoveryErrorType;
export interface SessionRecoveryHook {
    handleSessionRecovery: (info: MessageInfo) => Promise<boolean>;
    isRecoverableError: (error: unknown) => boolean;
    setOnAbortCallback: (callback: (sessionID: string) => void) => void;
    setOnRecoveryCompleteCallback: (callback: (sessionID: string) => void) => void;
}
export declare function createSessionRecoveryHook(ctx: PluginInput, options?: SessionRecoveryOptions): SessionRecoveryHook;
export {};
