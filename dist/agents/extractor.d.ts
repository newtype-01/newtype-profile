import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentPromptMetadata } from "./types";
export declare const EXTRACTOR_PROMPT_METADATA: AgentPromptMetadata;
export declare function createExtractorAgent(model?: string): AgentConfig;
export declare const extractorAgent: AgentConfig;
