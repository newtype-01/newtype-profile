import { type PluginInput, type ToolDefinition } from "@opencode-ai/plugin";
import type { BackgroundManager } from "../../features/background-agent";
import type { CategoriesConfig } from "../../config/schema";
type OpencodeClient = PluginInput["client"];
export interface ChiefTaskToolOptions {
    manager: BackgroundManager;
    client: OpencodeClient;
    userCategories?: CategoriesConfig;
}
export interface BuildSystemContentInput {
    skillContent?: string;
    categoryPromptAppend?: string;
}
export declare function buildSystemContent(input: BuildSystemContentInput): string | undefined;
export declare function createChiefTask(options: ChiefTaskToolOptions): ToolDefinition;
export {};
