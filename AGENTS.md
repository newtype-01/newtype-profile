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
├── agents/      # 8 agents: chief, deputy, researcher, fact-checker, archivist, extractor, writer, editor
├── hooks/       # Lifecycle hooks (chief-orchestrator, comment-checker, etc.)
│   └── chief-orchestrator/  # Main orchestration with quality scoring
│       ├── confidence-router.ts      # Single-score routing (legacy)
│       ├── quality-dimensions.ts     # Multi-dimensional scoring (v1.0.20+)
│       ├── task-progress-tracker.ts  # Track delegated tasks
│       └── output-summarizer.ts      # Summarize agent outputs
├── tools/       # LSP, AST-Grep, Grep, Glob, chief-task, skill
├── features/    # Background agents, skill loaders, context injector
├── auth/        # Google Antigravity OAuth
├── config/      # Zod schemas and TypeScript types
├── mcp/         # MCP server configs (exa, tavily, firecrawl)
└── index.ts     # Main plugin entry
```

## THREE-LAYER ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    Chief (Opus 4.5)                     │
│                   思考者 / Thinker                       │
│  • 与用户对话，理解需求                                   │
│  • 高层任务拆解                                          │
│  • 最终审核与交付                                        │
│  • 不需要专业 Agent 时，自己处理                          │
└─────────────────────┬───────────────────────────────────┘
                      │ 精简指令
                      ↓
┌─────────────────────────────────────────────────────────┐
│                   Deputy (Sonnet 4.5)                   │
│                   执行者 / Doer                          │
│  • 接收 Chief 的精简指令                                 │
│  • 简单任务自己执行                                       │
│  • 复杂任务调度专业 Agents                                │
│  • 汇总过滤输出，返回精简结果给 Chief                     │
└─────────────────────┬───────────────────────────────────┘
                      │ 调用
                      ↓
┌─────────────────────────────────────────────────────────┐
│              Specialists (Gemini/Sonnet)                │
│  researcher, writer, fact-checker, editor, etc.        │
└─────────────────────────────────────────────────────────┘
```

**三个价值：**
1. **Context 隔离** — 专业 Agent 的冗长输出不污染 Chief 的 context
2. **成本控制** — Opus 只做决策，Sonnet 做调度，便宜模型做执行
3. **职责分离** — Thinker vs Doer

## AGENT TEAM & QUALITY DIMENSIONS

| Agent | Model | Role | Quality Dimensions |
|-------|-------|------|-------------------|
| **chief** | Claude Opus 4.5 | 思考者/协调者 | N/A |
| **deputy** | Claude Sonnet 4.5 | 执行者/调度者 | N/A |
| **researcher** | Gemini 3 Pro High | 情报员 | Coverage, Sources, Relevance |
| **fact-checker** | Gemini 3 Pro High | 核查员 | Accuracy, Authority, Completeness |
| **archivist** | Claude Sonnet 4.5 | 资料员 | Coverage, Connections, Relevance |
| **extractor** | Gemini 3 Flash | 格式员 | Accuracy, Completeness, Format |
| **writer** | Gemini 3 Pro High | 写手 | Structure, Clarity, Grounding |
| **editor** | Claude Sonnet 4.5 | 编辑 | Polish, Logic, Consistency |

Each specialist agent outputs multi-dimensional scores. Deputy uses WEAKEST dimension to request targeted improvements.

## CODE STYLE

### Imports
```typescript
// External first, then internal with relative paths
import type { Plugin } from "@opencode-ai/plugin"
import { existsSync } from "node:fs"
import { log } from "../../shared/logger"
import type { AgentConfig } from "./types"
```

### Naming
| Element | Convention | Example |
|---------|------------|---------|
| Directories/Files | kebab-case | `chief-orchestrator/`, `quality-dimensions.ts` |
| Hook creators | `createXXXHook` | `createChiefOrchestratorHook()` |
| Agent factories | `createXXXAgent` | `createChiefAgent()` |
| Constants | UPPER_SNAKE | `DEFAULT_MODEL`, `HOOK_NAME` |
| Types | PascalCase | `AgentConfig`, `QualityScores` |

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

describe("QualityDimensions", () => {
  test("should parse multi-dimensional scores", () => {
    // #given
    const output = "**QUALITY SCORES:**\n- Coverage: 0.85\n- Sources: 0.55\n**OVERALL: 0.70**"
    // #when
    const result = parseQualityScores(output, "researcher")
    // #then
    expect(result.overall).toBe(0.70)
    expect(result.weakest?.name).toBe("sources")
  })
})
```

## QUALITY SCORING SYSTEM (v1.0.20+)

### Agent Output Format
```markdown
**QUALITY SCORES:**
- Coverage: 0.85
- Sources: 0.55
- Relevance: 0.90
**OVERALL: 0.70**
**WEAKEST: Sources** (only if any < 0.70)
```

### Routing Logic
| Overall Score | Action |
|--------------|--------|
| ≥ 0.80 | Pass to Chief |
| 0.50-0.79 | Polish (same agent) |
| < 0.50 | Rewrite (max 2 attempts, then escalate) |

### Per-Agent Thresholds (configurable)
```json
{
  "confidence": {
    "default": { "pass": 0.8, "polish": 0.5 },
    "by_agent": {
      "fact-checker": { "pass": 0.9 }
    }
  }
}
```

## ANTI-PATTERNS

| Forbidden | Use Instead |
|-----------|-------------|
| `npm` / `yarn` | `bun` |
| `@types/node` | `bun-types` |
| `as any`, `@ts-ignore` | Proper typing |
| Empty `catch {}` | Log and handle errors |
| `Bun.spawn` | `node:child_process` |
| Direct `npm publish` | `npm version patch && npm publish` |

## RUNTIME COMPATIBILITY (CRITICAL)

**OpenCode loads plugins using a runtime that may not support Bun-specific APIs.**

### DO NOT USE:
```typescript
// ❌ WRONG - causes plugin load failure
import { spawn } from "bun"
Bun.spawn([...])
Bun.write(path, data)
```

### USE INSTEAD:
```typescript
// ✅ CORRECT - works in both Bun and Node.js
import { spawn } from "node:child_process"
import { writeFile } from "node:fs/promises"
import { spawnAsync } from "../../shared/spawn"
```

## CONFIGURATION

**User**: `~/.config/opencode/oh-my-opencode.json`
**Project**: `<project>/.opencode/oh-my-opencode.json`

```json
{
  "google_auth": true,
  "agents": {
    "chief": { "model": "google/antigravity-claude-opus-4-5-thinking-high" },
    "writer": { "model": "google/antigravity-gemini-3-pro-high", "temperature": 0.7 }
  },
  "confidence": {
    "default": { "pass": 0.8, "polish": 0.5 },
    "max_rewrite_attempts": 2
  }
}
```

## DEPLOYMENT

```bash
npm version patch   # Bump version
npm publish --access public
```
