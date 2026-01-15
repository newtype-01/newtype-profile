# NEWTYPE-PROFILE KNOWLEDGE BASE

**AI Agent Collaboration System for Content Creation** - Based on oh-my-opencode, redesigned for editorial team workflows.

## BUILD & TEST COMMANDS

```bash
bun install           # Install dependencies (bun only - never npm/yarn)
bun run build         # Full build: ESM + declarations + schema
bun run typecheck     # Type check only
bun test              # Run all tests
bun test chief        # Run tests matching "chief"
bun test path/to.test.ts  # Run single test file
```

## PROJECT STRUCTURE

```
src/
├── agents/      # 7 agents: chief, researcher, fact-checker, archivist, extractor, writer, editor
├── hooks/       # Lifecycle hooks (chief-orchestrator, comment-checker, etc.)
├── tools/       # LSP, AST-Grep, Grep, Glob, chief-task, skill
├── features/    # Background agents, skill loaders, context injector
├── auth/        # Google Antigravity OAuth
├── config/      # Zod schemas and TypeScript types
├── mcp/         # MCP server configs (exa, tavily, firecrawl)
└── index.ts     # Main plugin entry
```

## AGENT TEAM

| Agent | Model | Role |
|-------|-------|------|
| **chief** | Claude Opus 4.5 | Editor-in-Chief: thought partner + coordinator |
| **researcher** | Gemini 3 Pro High | External research, trends |
| **fact-checker** | Gemini 3 Pro High | Validate sources, credibility |
| **archivist** | Claude Sonnet 4.5 | Knowledge base retrieval |
| **extractor** | Gemini 3 Flash | PDF/image/document extraction |
| **writer** | Gemini 3 Pro High | Content production |
| **editor** | Claude Sonnet 4.5 | Content refinement |

## CODE STYLE

### Imports
```typescript
// External first, then internal with relative paths
import type { Plugin } from "@opencode-ai/plugin"
import { existsSync } from "node:fs"
import { log } from "../../shared/logger"
import type { AgentConfig } from "./types"
```

### Types
```typescript
// Use bun-types (NOT @types/node) - configured in tsconfig.json
// Prefer explicit types, use type imports for type-only
import type { PluginInput } from "@opencode-ai/plugin"
export function createAgent(model: string = DEFAULT_MODEL): AgentConfig { }
```

### Naming
| Element | Convention | Example |
|---------|------------|---------|
| Directories/Files | kebab-case | `chief-orchestrator/`, `output-summarizer.ts` |
| Hook creators | `createXXXHook` | `createChiefOrchestratorHook()` |
| Agent factories | `createXXXAgent` | `createChiefAgent()` |
| Constants | UPPER_SNAKE | `DEFAULT_MODEL`, `HOOK_NAME` |
| Types | PascalCase | `AgentConfig`, `TaskProgress` |

### Exports
```typescript
// Barrel exports in index.ts
export * from "./types"
export { createBuiltinAgents } from "./utils"
export const builtinAgents: Record<string, AgentConfig> = { ... }
```

### Error Handling
```typescript
try {
  const result = await someAsyncOperation()
} catch (error) {
  log.error("Operation failed:", error)
  throw error
}
// NEVER: empty catch {}, as any, @ts-ignore, @ts-expect-error
```

## TESTING

Test files: `*.test.ts` alongside source. BDD comments: `#given`, `#when`, `#then`

```typescript
import { describe, test, expect } from "bun:test"

describe("TaskProgressTracker", () => {
  test("should track progress", () => {
    // #given
    const tracker = createTaskProgressTracker()
    // #when
    tracker.startTask("task-1", "Test")
    // #then
    expect(tracker.getStatus("task-1")).toBe("running")
  })
})
```

## ADDING COMPONENTS

### Add an Agent
1. Create `src/agents/my-agent.ts`:
```typescript
import type { AgentConfig } from "@opencode-ai/sdk"
const DEFAULT_MODEL = "anthropic/claude-sonnet-4-5"

export function createMyAgent(model: string = DEFAULT_MODEL): AgentConfig {
  return { model, temperature: 0.3, description: "...", prompt: `...` }
}
export const myAgent = createMyAgent()
```
2. Add to `builtinAgents` in `src/agents/index.ts`
3. Update `BuiltinAgentName` type in `src/agents/types.ts`

### Add a Hook
1. Create `src/hooks/my-hook/index.ts`:
```typescript
import type { PluginInput } from "@opencode-ai/plugin"
export const HOOK_NAME = "my-hook"

export function createMyHook(ctx: PluginInput) {
  return {
    onSessionStart: async () => { /* ... */ },
    onPostToolUse: async (props) => { /* ... */ },
  }
}
```
2. Export from `src/hooks/index.ts`

## ANTI-PATTERNS

| Forbidden | Use Instead |
|-----------|-------------|
| `npm` / `yarn` | `bun` |
| `@types/node` | `bun-types` |
| `as any`, `@ts-ignore` | Proper typing |
| Empty `catch {}` | Log and handle errors |
| bash file ops in code | Node/Bun fs APIs |
| Direct `bun publish` | GitHub Actions workflow |

## CONFIGURATION

**User**: `~/.config/opencode/oh-my-opencode.json`
**Project**: `<project>/.opencode/oh-my-opencode.json`

```json
{
  "google_auth": true,
  "agents": {
    "chief": { "model": "google/antigravity-claude-opus-4-5-thinking-high" },
    "writer": { "model": "google/antigravity-gemini-3-pro-high", "temperature": 0.7 }
  }
}
```

## DEPLOYMENT

**GitHub Actions only** - Never publish locally, never modify package.json version.

```bash
gh workflow run publish -f bump=patch
```
