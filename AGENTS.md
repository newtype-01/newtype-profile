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
├── tools/       # LSP, AST-Grep, Grep, Glob, chief-task, skill
├── features/    # Background agents, skill loaders, context injector
├── auth/        # Google Antigravity OAuth
├── config/      # Zod schemas and TypeScript types
├── mcp/         # MCP server configs (exa, tavily, firecrawl)
└── index.ts     # Main plugin entry
```

## THREE-LAYER ARCHITECTURE (v1.0.22+)

```
┌─────────────────────────────────────────────────────────┐
│                    Chief (Opus 4.5)                     │
│                   思考者 / Thinker                       │
│  • 与用户对话，理解需求                                   │
│  • 高层任务拆解、最终审核与交付                           │
│  • 工具白名单限制 — 只能用 chief_task 委派执行            │
└─────────────────────┬───────────────────────────────────┘
                      │ chief_task(subagent_type="deputy")
                      ↓
┌─────────────────────────────────────────────────────────┐
│                   Deputy (Sonnet 4.5)                   │
│                   执行者 / Doer                          │
│  • 接收 Chief 的精简指令，拆解复杂任务                    │
│  • 调度专业 Agents，汇总过滤输出                         │
│  • 协作语气，永不拒绝任务                                │
└─────────────────────┬───────────────────────────────────┘
                      │ chief_task(subagent_type="researcher/writer/...")
                      ↓
┌─────────────────────────────────────────────────────────┐
│              Specialists (Gemini/Sonnet)                │
│  researcher, writer, fact-checker, editor, etc.        │
│  执行具体任务，不评判任务本身                            │
└─────────────────────────────────────────────────────────┘
```

## CHIEF TOOL WHITELIST (v1.0.26+)

Chief 使用**白名单**限制工具访问，阻止所有未列出的工具（包括用户安装的 MCP）：

| 分类 | 允许的工具 |
|------|-----------|
| 执行路径 | `chief_task` |
| 任务管理 | `todowrite`, `todoread` |
| 只读文件 | `read`, `glob`, `grep` |
| LSP 只读 | `lsp_hover`, `lsp_goto_definition`, `lsp_find_references`, `lsp_document_symbols`, `lsp_workspace_symbols`, `lsp_diagnostics`, `lsp_servers`, `lsp_code_actions` |
| Session | `session_list`, `session_read`, `session_search`, `session_info` |
| 后台管理 | `background_output`, `background_cancel` |
| 其他 | `look_at`, `skill`, `slashcommand` |

**被阻止的工具**：所有 MCP 工具、`write`/`edit`、`bash`、`ast_grep_replace`、`lsp_rename` 等

## AGENT PROMPTS 语气原则 (v1.0.27+)

Deputy 和专业 Agents 必须遵循**协作语气**：

**禁止措辞**：
- ❌ "我拒绝..." / "I refuse..."
- ❌ "这个任务太复杂..."
- ❌ "定义过于严格..."
- ❌ "PROVIDE EXACTLY ONE TASK"

**正确行为**：
- ✅ 直接执行任务，不评判任务本身
- ✅ 复杂任务直接拆解，不解释为什么需要拆解
- ✅ 协作，不对抗

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
    const output = "**QUALITY SCORES:**\n- Coverage: 0.85\n**OVERALL: 0.70**"
    // #when
    const result = parseQualityScores(output, "researcher")
    // #then
    expect(result.overall).toBe(0.70)
  })
})
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

```typescript
// ❌ WRONG - causes plugin load failure
Bun.spawn([...])
Bun.write(path, data)

// ✅ CORRECT - works in both Bun and Node.js
import { spawn } from "node:child_process"
import { writeFile } from "node:fs/promises"
```

## CONFIGURATION

**User**: `~/.config/opencode/newtype-profile.json`
**Project**: `<project>/.opencode/newtype-profile.json`

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

```bash
npm version patch   # Bump version
npm publish --access public --otp=<code>
git push origin main --follow-tags
```

## RECENT CHANGES (v1.0.22 - v1.0.29)

| Version | Change |
|---------|--------|
| v1.0.29 | Fix Deputy not executing file edits — add explicit direct execution guidance to prompt |
| v1.0.28 | Remove confrontational `SINGLE_TASK_DIRECTIVE` from hooks |
| v1.0.27 | Add forbidden phrases to Deputy prompt |
| v1.0.26 | Chief uses whitelist (not blocklist) for tool restrictions |
| v1.0.25 | Fix MCP tool names, improve Deputy task decomposition |
| v1.0.24 | Add hard tool constraints to Chief |
| v1.0.23 | Remove `call_omo_agent`, unify to `chief_task` |
| v1.0.22 | Implement three-layer architecture with Deputy |
