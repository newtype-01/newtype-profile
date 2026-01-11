import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentPromptMetadata } from "./types";
export declare const RESEARCHER_PROMPT_METADATA: AgentPromptMetadata;
export declare function createResearcherAgent(model?: string): AgentConfig;
export declare const researcherAgent: AgentConfig;
