import type { CommandDefinition } from "../claude-code-command-loader"

export type BuiltinCommandName = "init-deep" | "ralph-loop" | "cancel-ralph" | "switch" | "super-analyst" | "super-writer" | "super-fact-checker" | "super-editor" | "super-interviewer" | "memory-consolidate" | "configure-models"

export interface BuiltinCommandConfig {
  disabled_commands?: BuiltinCommandName[]
}

export type BuiltinCommands = Record<string, CommandDefinition>
