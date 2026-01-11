import type { PluginInput } from "@opencode-ai/plugin";
export * from "./detector";
export * from "./constants";
export * from "./types";
export declare function createKeywordDetectorHook(ctx: PluginInput): {
    "chat.message": (input: {
        sessionID: string;
        agent?: string;
        model?: {
            providerID: string;
            modelID: string;
        };
        messageID?: string;
    }, output: {
        message: Record<string, unknown>;
        parts: Array<{
            type: string;
            text?: string;
            [key: string]: unknown;
        }>;
    }) => Promise<void>;
};
