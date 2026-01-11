import type { AgentConfig } from "@opencode-ai/sdk"
import { chiefAgent } from "./chief"
import { researcherAgent } from "./researcher"
import { factCheckerAgent } from "./fact-checker"
import { archivistAgent } from "./archivist"
import { extractorAgent } from "./extractor"
import { writerAgent } from "./writer"
import { editorAgent } from "./editor"

export const builtinAgents: Record<string, AgentConfig> = {
  chief: chiefAgent,
  researcher: researcherAgent,
  "fact-checker": factCheckerAgent,
  archivist: archivistAgent,
  extractor: extractorAgent,
  writer: writerAgent,
  editor: editorAgent,
}

export * from "./types"
export { createBuiltinAgents } from "./utils"
