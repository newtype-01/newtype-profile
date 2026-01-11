import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentPromptMetadata } from "./types";
export declare const CHIEF_PROMPT_METADATA: AgentPromptMetadata;
export declare function createChiefAgent(model?: string): AgentConfig;
export declare const chiefAgent: AgentConfig;
