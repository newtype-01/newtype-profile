import type { OriginalMessageContext, ToolPermission } from "./types";
export interface StoredMessage {
    agent?: string;
    model?: {
        providerID?: string;
        modelID?: string;
    };
    tools?: Record<string, ToolPermission>;
}
export declare function findNearestMessageWithFields(messageDir: string): StoredMessage | null;
export declare function injectHookMessage(sessionID: string, hookContent: string, originalMessage: OriginalMessageContext): boolean;
