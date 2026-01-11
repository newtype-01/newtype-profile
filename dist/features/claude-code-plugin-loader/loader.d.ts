import type { AgentConfig } from "@opencode-ai/sdk";
import type { CommandDefinition } from "../claude-code-command-loader/types";
import type { McpServerConfig } from "../claude-code-mcp-loader/types";
import type { LoadedPlugin, PluginLoadResult, PluginLoadError, HooksConfig, PluginLoaderOptions } from "./types";
export declare function discoverInstalledPlugins(options?: PluginLoaderOptions): PluginLoadResult;
export declare function loadPluginCommands(plugins: LoadedPlugin[]): Record<string, CommandDefinition>;
export declare function loadPluginSkillsAsCommands(plugins: LoadedPlugin[]): Record<string, CommandDefinition>;
export declare function loadPluginAgents(plugins: LoadedPlugin[]): Record<string, AgentConfig>;
export declare function loadPluginMcpServers(plugins: LoadedPlugin[]): Promise<Record<string, McpServerConfig>>;
export declare function loadPluginHooksConfigs(plugins: LoadedPlugin[]): HooksConfig[];
export interface PluginComponentsResult {
    commands: Record<string, CommandDefinition>;
    skills: Record<string, CommandDefinition>;
    agents: Record<string, AgentConfig>;
    mcpServers: Record<string, McpServerConfig>;
    hooksConfigs: HooksConfig[];
    plugins: LoadedPlugin[];
    errors: PluginLoadError[];
}
export declare function loadAllPluginComponents(options?: PluginLoaderOptions): Promise<PluginComponentsResult>;
