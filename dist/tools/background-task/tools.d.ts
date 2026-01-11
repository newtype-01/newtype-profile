import { type PluginInput, type ToolDefinition } from "@opencode-ai/plugin";
import type { BackgroundManager } from "../../features/background-agent";
type OpencodeClient = PluginInput["client"];
export declare function createBackgroundTask(manager: BackgroundManager): ToolDefinition;
export declare function createBackgroundOutput(manager: BackgroundManager, client: OpencodeClient): ToolDefinition;
export declare function createBackgroundCancel(manager: BackgroundManager, client: OpencodeClient): ToolDefinition;
export {};
