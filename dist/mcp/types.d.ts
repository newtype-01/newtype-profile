import { z } from "zod";
export declare const McpNameSchema: z.ZodEnum<{
    websearch: "websearch";
}>;
export type McpName = z.infer<typeof McpNameSchema>;
export declare const AnyMcpNameSchema: z.ZodString;
export type AnyMcpName = z.infer<typeof AnyMcpNameSchema>;
