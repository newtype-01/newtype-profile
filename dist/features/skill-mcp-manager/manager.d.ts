import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import type { Tool, Resource, Prompt } from "@modelcontextprotocol/sdk/types.js";
import type { ClaudeCodeMcpServer } from "../claude-code-mcp-loader/types";
import type { SkillMcpClientInfo, SkillMcpServerContext } from "./types";
export declare class SkillMcpManager {
    private clients;
    private pendingConnections;
    private cleanupRegistered;
    private cleanupInterval;
    private readonly IDLE_TIMEOUT;
    private getClientKey;
    private registerProcessCleanup;
    getOrCreateClient(info: SkillMcpClientInfo, config: ClaudeCodeMcpServer): Promise<Client>;
    private createClient;
    disconnectSession(sessionID: string): Promise<void>;
    disconnectAll(): Promise<void>;
    private startCleanupTimer;
    private stopCleanupTimer;
    private cleanupIdleClients;
    listTools(info: SkillMcpClientInfo, context: SkillMcpServerContext): Promise<Tool[]>;
    listResources(info: SkillMcpClientInfo, context: SkillMcpServerContext): Promise<Resource[]>;
    listPrompts(info: SkillMcpClientInfo, context: SkillMcpServerContext): Promise<Prompt[]>;
    callTool(info: SkillMcpClientInfo, context: SkillMcpServerContext, name: string, args: Record<string, unknown>): Promise<unknown>;
    readResource(info: SkillMcpClientInfo, context: SkillMcpServerContext, uri: string): Promise<unknown>;
    getPrompt(info: SkillMcpClientInfo, context: SkillMcpServerContext, name: string, args: Record<string, string>): Promise<unknown>;
    private getOrCreateClientWithRetry;
    getConnectedServers(): string[];
    isConnected(info: SkillMcpClientInfo): boolean;
}
