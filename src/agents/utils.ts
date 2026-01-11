import type { AgentConfig } from "@opencode-ai/sdk"
import type { BuiltinAgentName, AgentOverrideConfig, AgentOverrides, AgentFactory, AgentPromptMetadata } from "./types"
import { createChiefAgent, CHIEF_PROMPT_METADATA } from "./chief"
import { createResearcherAgent, RESEARCHER_PROMPT_METADATA } from "./researcher"
import { createFactCheckerAgent, FACT_CHECKER_PROMPT_METADATA } from "./fact-checker"
import { createArchivistAgent, ARCHIVIST_PROMPT_METADATA } from "./archivist"
import { createExtractorAgent, EXTRACTOR_PROMPT_METADATA } from "./extractor"
import { createWriterAgent, WRITER_PROMPT_METADATA } from "./writer"
import { createEditorAgent, EDITOR_PROMPT_METADATA } from "./editor"
import { deepMerge } from "../shared"
import { DEFAULT_CATEGORIES } from "../tools/chief-task/constants"
import { resolveMultipleSkills } from "../features/opencode-skill-loader/skill-content"

type AgentSource = AgentFactory | AgentConfig

const agentSources: Record<BuiltinAgentName, AgentSource> = {
  chief: createChiefAgent,
  researcher: createResearcherAgent,
  "fact-checker": createFactCheckerAgent,
  archivist: createArchivistAgent,
  extractor: createExtractorAgent,
  writer: createWriterAgent,
  editor: createEditorAgent,
}

/**
 * Metadata for each agent, used to build Chief's dynamic prompt sections
 * (Delegation Table, Tool Selection, Key Triggers, etc.)
 */
const agentMetadata: Partial<Record<BuiltinAgentName, AgentPromptMetadata>> = {
  chief: CHIEF_PROMPT_METADATA,
  researcher: RESEARCHER_PROMPT_METADATA,
  "fact-checker": FACT_CHECKER_PROMPT_METADATA,
  archivist: ARCHIVIST_PROMPT_METADATA,
  extractor: EXTRACTOR_PROMPT_METADATA,
  writer: WRITER_PROMPT_METADATA,
  editor: EDITOR_PROMPT_METADATA,
}

function isFactory(source: AgentSource): source is AgentFactory {
  return typeof source === "function"
}

export function buildAgent(source: AgentSource, model?: string): AgentConfig {
  const base = isFactory(source) ? source(model) : source

  const agentWithCategory = base as AgentConfig & { category?: string; skills?: string[] }
  if (agentWithCategory.category) {
    const categoryConfig = DEFAULT_CATEGORIES[agentWithCategory.category]
    if (categoryConfig) {
      if (!base.model) {
        base.model = categoryConfig.model
      }
      if (base.temperature === undefined && categoryConfig.temperature !== undefined) {
        base.temperature = categoryConfig.temperature
      }
    }
  }

  if (agentWithCategory.skills?.length) {
    const { resolved } = resolveMultipleSkills(agentWithCategory.skills)
    if (resolved.size > 0) {
      const skillContent = Array.from(resolved.values()).join("\n\n")
      base.prompt = skillContent + (base.prompt ? "\n\n" + base.prompt : "")
    }
  }

  return base
}

/**
 * Creates OmO-specific environment context (time, timezone, locale).
 * Note: Working directory, platform, and date are already provided by OpenCode's system.ts,
 * so we only include fields that OpenCode doesn't provide to avoid duplication.
 * See: https://github.com/code-yeongyu/oh-my-opencode/issues/379
 */
export function createEnvContext(): string {
  const now = new Date()
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const locale = Intl.DateTimeFormat().resolvedOptions().locale

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })

  return `
<omo-env>
  Current time: ${timeStr}
  Timezone: ${timezone}
  Locale: ${locale}
</omo-env>`
}

function mergeAgentConfig(
  base: AgentConfig,
  override: AgentOverrideConfig
): AgentConfig {
  const { prompt_append, ...rest } = override
  const merged = deepMerge(base, rest as Partial<AgentConfig>)

  if (prompt_append && merged.prompt) {
    merged.prompt = merged.prompt + "\n" + prompt_append
  }

  return merged
}

export function createBuiltinAgents(
  disabledAgents: BuiltinAgentName[] = [],
  agentOverrides: AgentOverrides = {},
  directory?: string,
  systemDefaultModel?: string
): Record<string, AgentConfig> {
  const result: Record<string, AgentConfig> = {}

  for (const [name, source] of Object.entries(agentSources)) {
    const agentName = name as BuiltinAgentName

    if (agentName === "chief") continue
    if (disabledAgents.includes(agentName)) continue

    const override = agentOverrides[agentName]
    const model = override?.model

    let config = buildAgent(source, model)

    if (agentName === "researcher" && directory && config.prompt) {
      const envContext = createEnvContext()
      config = { ...config, prompt: config.prompt + envContext }
    }

    if (override) {
      config = mergeAgentConfig(config, override)
    }

    result[name] = config
  }

  if (!disabledAgents.includes("chief")) {
    const chiefOverride = agentOverrides["chief"]
    const chiefModel = chiefOverride?.model ?? systemDefaultModel

    let chiefConfig = createChiefAgent(chiefModel)

    if (directory && chiefConfig.prompt) {
      const envContext = createEnvContext()
      chiefConfig = { ...chiefConfig, prompt: chiefConfig.prompt + envContext }
    }

    if (chiefOverride) {
      chiefConfig = mergeAgentConfig(chiefConfig, chiefOverride)
    }

    result["chief"] = chiefConfig
  }

  return result
}
