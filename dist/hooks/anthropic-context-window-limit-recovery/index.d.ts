import type { PluginInput } from "@opencode-ai/plugin";
import type { ExperimentalConfig } from "../../config";
export interface AnthropicContextWindowLimitRecoveryOptions {
    experimental?: ExperimentalConfig;
    dcpForCompaction?: boolean;
}
export declare function createAnthropicContextWindowLimitRecoveryHook(ctx: PluginInput, options?: AnthropicContextWindowLimitRecoveryOptions): {
    event: ({ event }: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
};
export type { AutoCompactState, DcpState, ParsedTokenLimitError, TruncateState } from "./types";
export { parseAnthropicTokenLimitError } from "./parser";
export { executeCompact, getLastAssistant } from "./executor";
