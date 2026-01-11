import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentPromptMetadata } from "./types";
export declare const DOCUMENT_WRITER_PROMPT_METADATA: AgentPromptMetadata;
export declare function createDocumentWriterAgent(model?: string): AgentConfig;
export declare const documentWriterAgent: AgentConfig;
