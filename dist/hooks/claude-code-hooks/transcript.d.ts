import type { TranscriptEntry } from "./types";
export declare function getTranscriptPath(sessionId: string): string;
export declare function appendTranscriptEntry(sessionId: string, entry: TranscriptEntry): void;
export declare function recordToolUse(sessionId: string, toolName: string, toolInput: Record<string, unknown>): void;
export declare function recordToolResult(sessionId: string, toolName: string, toolInput: Record<string, unknown>, toolOutput: Record<string, unknown>): void;
export declare function recordUserMessage(sessionId: string, content: string): void;
export declare function recordAssistantMessage(sessionId: string, content: string): void;
/**
 * Build Claude Code compatible transcript from session messages
 *
 * PORT FROM DISABLED: This calls client.session.messages() API to fetch
 * the full session history and builds a JSONL file in Claude Code format.
 *
 * @param client OpenCode client instance
 * @param sessionId Session ID
 * @param directory Working directory
 * @param currentToolName Current tool being executed (added as last entry)
 * @param currentToolInput Current tool input
 * @returns Temp file path (caller must call deleteTempTranscript!)
 */
export declare function buildTranscriptFromSession(client: {
    session: {
        messages: (opts: {
            path: {
                id: string;
            };
            query?: {
                directory: string;
            };
        }) => Promise<unknown>;
    };
}, sessionId: string, directory: string, currentToolName: string, currentToolInput: Record<string, unknown>): Promise<string | null>;
/**
 * Delete temp transcript file (call in finally block)
 *
 * PORT FROM DISABLED: Cleanup mechanism to avoid disk accumulation
 */
export declare function deleteTempTranscript(path: string | null): void;
