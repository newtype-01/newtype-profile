import { z } from "zod"

export const McpNameSchema = z.enum([
  "websearch",
  "tavily",
  "firecrawl",
  "filesystem",
  "sequential-thinking",
])

export type McpName = z.infer<typeof McpNameSchema>

export const AnyMcpNameSchema = z.string().min(1)

export type AnyMcpName = z.infer<typeof AnyMcpNameSchema>

export const McpTavilyConfigSchema = z.object({
  api_key: z.string().min(1),
})

export const McpFirecrawlConfigSchema = z.object({
  api_key: z.string().min(1),
  api_url: z.string().url().optional(),
})

export const McpFilesystemConfigSchema = z.object({
  directories: z.array(z.string()).min(1),
})

export const McpConfigSchema = z.object({
  tavily: McpTavilyConfigSchema.optional(),
  firecrawl: McpFirecrawlConfigSchema.optional(),
  filesystem: McpFilesystemConfigSchema.optional(),
  "sequential-thinking": z.boolean().optional(),
})

export type McpTavilyConfig = z.infer<typeof McpTavilyConfigSchema>
export type McpFirecrawlConfig = z.infer<typeof McpFirecrawlConfigSchema>
export type McpFilesystemConfig = z.infer<typeof McpFilesystemConfigSchema>
export type McpConfig = z.infer<typeof McpConfigSchema>
