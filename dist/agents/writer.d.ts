import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentPromptMetadata } from "./types";
export declare const WRITER_PROMPT_METADATA: AgentPromptMetadata;
export declare function createWriterAgent(model?: string): AgentConfig;
export declare const writerAgent: AgentConfig;
