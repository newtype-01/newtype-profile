import type { SessionMessage, SessionInfo, TodoItem, SessionMetadata } from "./types";
export interface GetMainSessionsOptions {
    directory?: string;
}
export declare function getMainSessions(options: GetMainSessionsOptions): Promise<SessionMetadata[]>;
export declare function getAllSessions(): Promise<string[]>;
export declare function getMessageDir(sessionID: string): string;
export declare function sessionExists(sessionID: string): boolean;
export declare function readSessionMessages(sessionID: string): Promise<SessionMessage[]>;
export declare function readSessionTodos(sessionID: string): Promise<TodoItem[]>;
export declare function readSessionTranscript(sessionID: string): Promise<number>;
export declare function getSessionInfo(sessionID: string): Promise<SessionInfo | null>;
