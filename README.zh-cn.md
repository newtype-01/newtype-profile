<p align="right">
  <a href="./README.md">English</a> | <strong>简体中文</strong>
</p>

# newtype-profile

**专为内容创作设计的 AI Agent 协作系统**

基于 [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) 修改，专注于内容创作场景。

---

## 作者：黄益贺 (huangyihe)

- **YouTube**: [https://www.youtube.com/@huanyihe777](https://www.youtube.com/@huanyihe777)
- **Twitter**: [https://x.com/huangyihe](https://x.com/huangyihe)
- **Substack**: [https://newtype.pro/](https://newtype.pro/)
- **知识星球**: [https://t.zsxq.com/19IaNz5wK](https://t.zsxq.com/19IaNz5wK)

---

## 项目介绍

newtype-profile 是一套专为**内容创作**设计的 AI Agent 协作框架。不同于 oh-my-opencode 专注于代码编程场景，本项目将 Agent 体系重新定义为编辑部团队模式，适用于：

- 📚 知识库管理与维护
- ✍️ 文章写作与编辑
- 🔍 信息调研与核查
- 📄 文档提取与整理

## Agent 团队

| Agent | 角色 | 默认模型 | 职责描述 |
|-------|------|---------|---------|
| **chief** | 主编 | Claude Opus 4.5 Thinking High | 双模式运作：探讨伙伴（与用户对话）+ 执行协调（委派任务给团队） |
| **deputy** | 副主编 | Claude Sonnet 4.5 | 执行主编委派的具体任务 |
| **researcher** | 情报员 | Gemini 3 Pro High | 广度搜索、发现新信息、多源三角验证 |
| **fact-checker** | 核查员 | Gemini 3 Pro High | 验证来源、评估可信度、标记不可验证的声明 |
| **archivist** | 资料员 | Claude Sonnet 4.5 | 知识库检索、发现文档关联、维护组织一致性 |
| **extractor** | 格式员 | Gemini 3 Flash | PDF/图片/文档内容提取、格式转换 |
| **writer** | 写手 | Gemini 3 Pro High | 内容生产、文章起草、散文写作 |
| **editor** | 编辑 | Claude Sonnet 4.5 | 内容精炼、结构优化、语言打磨 |

## 快速开始

### 前置要求

1. 安装 [OpenCode](https://opencode.ai/docs)
2. 安装 [Bun](https://bun.sh/)（仅本地开发需要）

### 部署方式

#### 方式一：npm 包（推荐）

编辑 `~/.config/opencode/opencode.json`：

```json
{
  "plugin": [
    "newtype-profile"
  ]
}
```

#### 方式二：克隆到本地（开发用）

用于开发或自定义：

```bash
git clone https://github.com/newtype-01/newtype-profile.git
cd newtype-profile
bun install
bun run build
```

然后在配置中引用本地路径：

```json
{
  "plugin": [
    "/path/to/newtype-profile"
  ]
}
```

### 配置 Agent 模型

创建或编辑 newtype-profile 配置文件。

**用户级**：`~/.config/opencode/newtype-profile.json`

**项目级**：`<project>/.opencode/newtype-profile.json`

```json
{
  "google_auth": true,
  "agents": {
    "chief": { "model": "google/antigravity-claude-opus-4-5-thinking-high" },
    "researcher": { "model": "google/antigravity-gemini-3-pro-high" },
    "fact-checker": { "model": "google/antigravity-gemini-3-pro-high" },
    "archivist": { "model": "google/antigravity-claude-sonnet-4-5" },
    "extractor": { "model": "google/antigravity-gemini-3-flash" },
    "writer": { "model": "google/antigravity-gemini-3-pro-high" },
    "editor": { "model": "google/antigravity-claude-sonnet-4-5" }
  }
}
```

### 认证 Google Antigravity

```bash
opencode auth login
# 选择 Provider: Google
# 选择 Login method: OAuth with Google (Antigravity)
```

## 使用方式

### 启动 OpenCode

```bash
opencode
```

### 三层架构

```
用户 ↔ Chief (主编)
           ↓ chief_task
       Deputy (副主编)
           ↓ chief_task
       专业 Agent (researcher, writer, editor...)
```

**你只需要与 Chief 对话**。Chief 会自动协调团队：

- **模式 1 - 思考伙伴**：探索想法时，Chief 会和你一起思考，挑战有问题的逻辑，进行思维碰撞。
- **模式 2 - 执行协调**：当你有明确的交付物时，Chief 负责分解任务、委派执行、交付成果。

### 对话示例

```
# 调研请求 - Chief 通过 Deputy 委派给 researcher
"帮我了解一下2024年AI发展趋势"

# 写作请求 - Chief 协调 writer → editor 流水线
"根据我们的调研写一篇关于这个话题的文章"

# 核查请求 - Chief 派遣 fact-checker
"验证这份文档中的来源"

# 复杂任务 - Chief 编排多个 Agent
"创建一份关于[主题]的综合报告，要求来源可验证"
```

### 使用任务分类

Chief 使用 `chief_task` 按分类委派任务：

| 分类 | 用途 | 模型配置 |
|------|------|---------|
| `research` | 信息调研、趋势发现 | Gemini 3 Pro High, temp 0.5 |
| `fact-check` | 来源验证、可信度评估 | Gemini 3 Pro High, temp 0.2 |
| `archive` | 知识库检索、文档关联 | Claude Sonnet 4.5, temp 0.3 |
| `writing` | 内容创作、文章起草 | Gemini 3 Pro High, temp 0.7 |
| `editing` | 内容精炼、结构优化 | Claude Sonnet 4.5, temp 0.3 |
| `extraction` | PDF/图片内容提取 | Gemini 3 Flash, temp 0.2 |
| `quick` | 简单快速任务 | Gemini 3 Flash, temp 0.3 |

## 配置详解

### 模型选择

所有模型通过 Google Antigravity 调用。可用模型：

**Gemini 系列**
- `google/antigravity-gemini-3-pro-high` - 高配额 Pro 版
- `google/antigravity-gemini-3-pro-low` - 低配额 Pro 版
- `google/antigravity-gemini-3-flash` - 快速响应版

**Claude 系列 (via Antigravity)**
- `google/antigravity-claude-opus-4-5-thinking-high` - 高思考预算 Opus
- `google/antigravity-claude-opus-4-5-thinking-medium` - 中思考预算 Opus
- `google/antigravity-claude-opus-4-5-thinking-low` - 低思考预算 Opus
- `google/antigravity-claude-sonnet-4-5` - Sonnet 4.5
- `google/antigravity-claude-sonnet-4-5-thinking-high` - 高思考预算 Sonnet

### 自定义 Agent

在配置文件中覆盖默认设置：

```json
{
  "agents": {
    "writer": {
      "model": "google/antigravity-claude-sonnet-4-5",
      "temperature": 0.8,
      "prompt_append": "请使用简洁明快的写作风格"
    }
  }
}
```

### 禁用特定 Agent

```json
{
  "disabled_agents": ["fact-checker", "extractor"]
}
```

### 禁用特定 Hook

```json
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

### MCP 服务器配置

插件内置了多个 MCP (Model Context Protocol) 服务器。在 `newtype-profile.json` 中配置：

```json
{
  "mcp": {
    "tavily": {
      "api_key": "tvly-your-api-key"
    },
    "firecrawl": {
      "api_key": "fc-your-api-key"
    },
    "filesystem": {
      "directories": ["~/Documents", "~/Projects"]
    },
    "sequential-thinking": true
  }
}
```

| MCP 服务器 | 默认状态 | 需要配置 | 说明 |
|------------|----------|----------|------|
| **websearch** (Exa) | 已启用 | 无 | 通过 Exa.ai 进行网页搜索 |
| **sequential-thinking** | 已启用 | 无 | 结构化问题解决 |
| **tavily** | 未启用 | `api_key` | 高级网页搜索、爬取、提取 |
| **firecrawl** | 未启用 | `api_key` | 网页抓取和内容提取 |
| **filesystem** | 未启用 | `directories` | 本地文件系统访问 |

获取 API Key：
- Tavily: [tavily.com](https://tavily.com)
- Firecrawl: [firecrawl.dev](https://firecrawl.dev)

禁用内置 MCP：

```json
{
  "disabled_mcps": ["sequential-thinking"]
}
```

## 继承自 oh-my-opencode 的功能

本项目保留了 oh-my-opencode 的核心能力：

- ✅ **后台任务**: 并行运行多个 Agent
- ✅ **Todo 强制执行**: 确保任务完成
- ✅ **会话恢复**: 自动从错误中恢复
- ✅ **Claude Code 兼容层**: 支持 hooks, skills, commands
- ✅ **LSP 工具**: 代码导航与重构
- ✅ **AST-Grep**: 代码模式搜索
- ✅ **MCP 支持**: 扩展能力

## 插件切换

使用 `/switch` 命令在 OpenCode 插件之间切换：

```
/switch newtype    # 切换到 newtype-profile
/switch omo        # 切换到 oh-my-opencode
/switch none       # 禁用所有插件
```

**注意**：切换后需要重启 OpenCode（Ctrl+C，然后运行 `opencode`）。

首次使用 `/switch` 时，命令会自动安装到 `~/.config/opencode/command/switch.md`。这意味着即使切换到其他插件（如 oh-my-opencode），该命令仍然可用，随时可以切换回来。

## 与 oh-my-opencode 的区别

| 方面 | oh-my-opencode | newtype-profile |
|------|----------------|-----------------|
| 场景 | 代码编程 | 内容创作 |
| 主 Agent | Sisyphus | Chief (主编) |
| 子 Agent | oracle, librarian, explore... | researcher, writer, editor... |
| 分类 | visual-engineering, ultrabrain... | research, writing, editing... |
| 工具 | sisyphus_task | chief_task |

## 许可证

本项目基于 [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) 修改，遵循其 [SUL-1.0 许可证](https://github.com/code-yeongyu/oh-my-opencode/blob/master/LICENSE.md)。

## 致谢

- [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) - 原始项目
- [OpenCode](https://opencode.ai) - AI 编程平台
- [Google Antigravity](https://github.com/NoeFabris/opencode-antigravity-auth) - 模型认证
