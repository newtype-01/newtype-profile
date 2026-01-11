import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentPromptMetadata } from "./types";
export declare const ARCHIVIST_PROMPT_METADATA: AgentPromptMetadata;
export declare function createArchivistAgent(model?: string): AgentConfig;
export declare const archivistAgent: AgentConfig;
