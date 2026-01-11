import type { AgentConfig } from "@opencode-ai/sdk";
import type { BuiltinAgentName, AgentOverrides, AgentFactory } from "./types";
type AgentSource = AgentFactory | AgentConfig;
export declare function buildAgent(source: AgentSource, model?: string): AgentConfig;
/**
 * Creates OmO-specific environment context (time, timezone, locale).
 * Note: Working directory, platform, and date are already provided by OpenCode's system.ts,
 * so we only include fields that OpenCode doesn't provide to avoid duplication.
 * See: https://github.com/code-yeongyu/oh-my-opencode/issues/379
 */
export declare function createEnvContext(): string;
export declare function createBuiltinAgents(disabledAgents?: BuiltinAgentName[], agentOverrides?: AgentOverrides, directory?: string, systemDefaultModel?: string): Record<string, AgentConfig>;
export {};
