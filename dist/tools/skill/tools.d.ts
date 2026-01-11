import { type ToolDefinition } from "@opencode-ai/plugin";
import type { SkillLoadOptions } from "./types";
export declare function createSkillTool(options?: SkillLoadOptions): ToolDefinition;
export declare const skill: {
    description: string;
    args: Readonly<{
        [k: string]: import("zod/v4/core").$ZodType<unknown, unknown, import("zod/v4/core").$ZodTypeInternals<unknown, unknown>>;
    }>;
    execute(args: Record<string, unknown>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
