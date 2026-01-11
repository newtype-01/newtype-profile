import { type ToolDefinition } from "@opencode-ai/plugin";
import type { CommandInfo, SlashcommandToolOptions } from "./types";
export declare function discoverCommandsSync(): CommandInfo[];
export declare function createSlashcommandTool(options?: SlashcommandToolOptions): ToolDefinition;
export declare const slashcommand: {
    description: string;
    args: Readonly<{
        [k: string]: import("zod/v4/core").$ZodType<unknown, unknown, import("zod/v4/core").$ZodTypeInternals<unknown, unknown>>;
    }>;
    execute(args: Record<string, unknown>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
