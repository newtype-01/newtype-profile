import type { CommandDefinition } from "../claude-code-command-loader"
import type { BuiltinCommandName, BuiltinCommands } from "./types"
import { INIT_DEEP_TEMPLATE } from "./templates/init-deep"
import { RALPH_LOOP_TEMPLATE, CANCEL_RALPH_TEMPLATE } from "./templates/ralph-loop"
import { SWITCH_PLUGIN_TEMPLATE } from "./templates/switch-plugin"

const BUILTIN_COMMAND_DEFINITIONS: Record<BuiltinCommandName, Omit<CommandDefinition, "name">> = {
  "init-deep": {
    description: "(builtin) Generate KNOWLEDGE.md index for document repositories",
    template: `<command-instruction>
${INIT_DEEP_TEMPLATE}
</command-instruction>

<user-request>
$ARGUMENTS
</user-request>`,
    argumentHint: "[--create-new] [--max-depth=N]",
  },
  "ralph-loop": {
    description: "(builtin) Start self-referential task loop until completion",
    template: `<command-instruction>
${RALPH_LOOP_TEMPLATE}
</command-instruction>

<user-task>
$ARGUMENTS
</user-task>`,
    argumentHint: '"task description" [--completion-promise=TEXT] [--max-iterations=N]',
  },
  "cancel-ralph": {
    description: "(builtin) Cancel active Ralph Loop",
    template: `<command-instruction>
${CANCEL_RALPH_TEMPLATE}
</command-instruction>`,
  },
  "switch": {
    description: "(builtin) Switch OpenCode plugin (newtype/omo/none)",
    template: `<command-instruction>
${SWITCH_PLUGIN_TEMPLATE}
</command-instruction>`,
    argumentHint: "<newtype|omo|none>",
  },
  "super-analyst": {
    description: "(builtin) Elite analytical consulting system with 12 professional frameworks",
    template: `<command-instruction>
Use the skill tool to load the super-analyst skill, then follow its instructions.

Call: skill({ name: "super-analyst" })
</command-instruction>

<user-request>
$ARGUMENTS
</user-request>`,
    argumentHint: "<analysis question or problem>",
  },
}

export function loadBuiltinCommands(
  disabledCommands?: BuiltinCommandName[]
): BuiltinCommands {
  const disabled = new Set(disabledCommands ?? [])
  const commands: BuiltinCommands = {}

  for (const [name, definition] of Object.entries(BUILTIN_COMMAND_DEFINITIONS)) {
    if (!disabled.has(name as BuiltinCommandName)) {
      const { argumentHint: _argumentHint, ...openCodeCompatible } = definition
      commands[name] = openCodeCompatible as CommandDefinition
    }
  }

  return commands
}
