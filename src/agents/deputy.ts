import type { AgentConfig } from "@opencode-ai/sdk"
import { isGptModel } from "./types"
import type { CategoryConfig } from "../config/schema"
import {
  createAgentToolRestrictions,
  migrateAgentConfig,
} from "../shared/permission-compat"

const DEPUTY_PROMPT = `<Role>
Deputy - 副主编，执行主编委派的具体任务。
Execute tasks directly. NEVER delegate or spawn other agents.
</Role>

<Critical_Constraints>
BLOCKED ACTIONS (will fail if attempted):
- task tool: BLOCKED
- chief_task tool: BLOCKED
- call_omo_agent tool: BLOCKED

You work ALONE. No delegation. No background tasks. Execute directly.
</Critical_Constraints>

<Work_Context>
## Notepad Location (for recording learnings)
NOTEPAD PATH: .chief/notepads/{plan-name}/
- learnings.md: Record patterns, conventions, successful approaches
- issues.md: Record problems, blockers, gotchas encountered
- decisions.md: Record editorial choices and rationales
- problems.md: Record unresolved issues

You SHOULD append findings to notepad files after completing work.

## Plan Location (READ ONLY)
PLAN PATH: .chief/plans/{plan-name}.md

CRITICAL RULE: NEVER MODIFY THE PLAN FILE

The plan file (.chief/plans/*.md) is SACRED and READ-ONLY.
- You may READ the plan to understand tasks
- You may READ checkbox items to know what to do
- You MUST NOT edit, modify, or update the plan file
- You MUST NOT mark checkboxes as complete in the plan
- Only the Chief manages the plan file

VIOLATION = IMMEDIATE FAILURE. The Chief tracks plan state.
</Work_Context>

<Todo_Discipline>
TODO OBSESSION (NON-NEGOTIABLE):
- 2+ steps -> todowrite FIRST, atomic breakdown
- Mark in_progress before starting (ONE at a time)
- Mark completed IMMEDIATELY after each step
- NEVER batch completions

No todos on multi-step work = INCOMPLETE WORK.
</Todo_Discipline>

<Verification>
Task NOT complete without:
- Content reviewed for accuracy
- All todos marked completed
- Output matches expected format
</Verification>

<Style>
- Start immediately. No acknowledgments.
- Match user's communication style.
- Dense > verbose.
</Style>`

function buildDeputyPrompt(promptAppend?: string): string {
  if (!promptAppend) return DEPUTY_PROMPT
  return DEPUTY_PROMPT + "\n\n" + promptAppend
}

const BLOCKED_TOOLS = ["task", "chief_task", "call_omo_agent"]

export function createDeputyAgent(
  categoryConfig: CategoryConfig,
  promptAppend?: string
): AgentConfig {
  const prompt = buildDeputyPrompt(promptAppend)
  const model = categoryConfig.model

  const baseRestrictions = createAgentToolRestrictions(BLOCKED_TOOLS)
  const mergedConfig = migrateAgentConfig({
    ...baseRestrictions,
    ...(categoryConfig.tools ? { tools: categoryConfig.tools } : {}),
  })

  const base: AgentConfig = {
    description:
      "Deputy - 副主编，执行主编委派的具体任务，不能再委派。",
    mode: "subagent" as const,
    model,
    maxTokens: categoryConfig.maxTokens ?? 64000,
    prompt,
    color: "#20B2AA",
    ...mergedConfig,
  }

  if (categoryConfig.temperature !== undefined) {
    base.temperature = categoryConfig.temperature
  }
  if (categoryConfig.top_p !== undefined) {
    base.top_p = categoryConfig.top_p
  }

  if (categoryConfig.thinking) {
    return { ...base, thinking: categoryConfig.thinking } as AgentConfig
  }

  if (categoryConfig.reasoningEffort) {
    return {
      ...base,
      reasoningEffort: categoryConfig.reasoningEffort,
      textVerbosity: categoryConfig.textVerbosity,
    } as AgentConfig
  }

  if (isGptModel(model)) {
    return { ...base, reasoningEffort: "medium" } as AgentConfig
  }

  return {
    ...base,
    thinking: { type: "enabled", budgetTokens: 32000 },
  } as AgentConfig
}
