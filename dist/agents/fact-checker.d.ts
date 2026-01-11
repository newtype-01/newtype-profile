import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentPromptMetadata } from "./types";
export declare const FACT_CHECKER_PROMPT_METADATA: AgentPromptMetadata;
export declare function createFactCheckerAgent(model?: string): AgentConfig;
export declare const factCheckerAgent: AgentConfig;
