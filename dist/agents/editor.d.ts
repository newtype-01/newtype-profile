import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentPromptMetadata } from "./types";
export declare const EDITOR_PROMPT_METADATA: AgentPromptMetadata;
export declare function createEditorAgent(model?: string): AgentConfig;
export declare const editorAgent: AgentConfig;
