import type { Diagnostic, ResolvedServer } from "./types";
declare class LSPServerManager {
    private static instance;
    private clients;
    private cleanupInterval;
    private readonly IDLE_TIMEOUT;
    private constructor();
    private registerProcessCleanup;
    static getInstance(): LSPServerManager;
    private getKey;
    private startCleanupTimer;
    private cleanupIdleClients;
    getClient(root: string, server: ResolvedServer): Promise<LSPClient>;
    warmupClient(root: string, server: ResolvedServer): void;
    releaseClient(root: string, serverId: string): void;
    isServerInitializing(root: string, serverId: string): boolean;
    stopAll(): Promise<void>;
}
export declare const lspManager: LSPServerManager;
export declare class LSPClient {
    private root;
    private server;
    private proc;
    private buffer;
    private pending;
    private requestIdCounter;
    private openedFiles;
    private stderrBuffer;
    private processExited;
    private diagnosticsStore;
    constructor(root: string, server: ResolvedServer);
    start(): Promise<void>;
    private startReading;
    private startStderrReading;
    private rejectAllPending;
    private findSequence;
    private processBuffer;
    private send;
    private notify;
    private respond;
    private handleServerRequest;
    initialize(): Promise<void>;
    openFile(filePath: string): Promise<void>;
    hover(filePath: string, line: number, character: number): Promise<unknown>;
    definition(filePath: string, line: number, character: number): Promise<unknown>;
    references(filePath: string, line: number, character: number, includeDeclaration?: boolean): Promise<unknown>;
    documentSymbols(filePath: string): Promise<unknown>;
    workspaceSymbols(query: string): Promise<unknown>;
    diagnostics(filePath: string): Promise<{
        items: Diagnostic[];
    }>;
    prepareRename(filePath: string, line: number, character: number): Promise<unknown>;
    rename(filePath: string, line: number, character: number, newName: string): Promise<unknown>;
    codeAction(filePath: string, startLine: number, startChar: number, endLine: number, endChar: number, only?: string[]): Promise<unknown>;
    codeActionResolve(codeAction: unknown): Promise<unknown>;
    isAlive(): boolean;
    stop(): Promise<void>;
}
export {};
