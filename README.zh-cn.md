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

newtype-profile 是专为**内容创作**设计的 AI Agent 协作框架：

- 📚 知识库管理与维护
- ✍️ 文章写作与编辑
- 🔍 信息调研与核查
- 📄 文档提取与整理

## Agent 团队

| Agent | 角色 | 职责描述 |
|-------|------|---------|
| **chief** | 主编 | 双模式：探讨伙伴 + 执行协调 |
| **deputy** | 副主编 | 执行委派任务 |
| **researcher** | 情报员 | 广度搜索、发现新信息 |
| **fact-checker** | 核查员 | 验证来源、评估可信度 |
| **archivist** | 资料员 | 知识库检索 |
| **extractor** | 格式员 | PDF/图片/文档提取 |
| **writer** | 写手 | 内容生产 |
| **editor** | 编辑 | 内容精炼 |

## 快速开始

### 安装

```bash
cd ~/.config/opencode
bun add newtype-profile
```

编辑 `~/.config/opencode/opencode.json`：

```json
{
  "plugin": ["newtype-profile"]
}
```

### 配置模型

创建 `~/.config/opencode/newtype-profile.json`：

```json
{
  "google_auth": true,
  "agents": {
    "chief": { "model": "google/antigravity-claude-opus-4-5-thinking-high" },
    "researcher": { "model": "google/antigravity-gemini-3-pro-high" },
    "writer": { "model": "google/antigravity-gemini-3-pro-high" },
    "editor": { "model": "google/antigravity-claude-sonnet-4-5" }
  }
}
```

### 认证

```bash
opencode auth login
# 选择 Provider: Google
# 选择 Login method: OAuth with Google (Antigravity)
```

## 使用方式

### 三层架构

```
用户 ↔ Chief (主编)
           ↓ chief_task
       Deputy (副主编)
           ↓ chief_task
       专业 Agent (researcher, writer, editor...)
```

**你只需要与 Chief 对话**：

- **模式 1 - 思考伙伴**：Chief 和你一起思考，挑战有问题的逻辑
- **模式 2 - 执行协调**：Chief 分解任务、委派执行、交付成果

### 对话示例

```
"帮我了解一下2024年AI发展趋势"
"根据我们的调研写一篇文章"
"验证这份文档中的来源"
```

## 自定义

### SOUL.md - 自定义 Chief 人格 (v1.0.60+)

Chief 的人格分三层：
- **底层能力**（硬编码）：Chief 能做什么
- **里人格**（硬编码）：核心价值观和思维方式
- **表人格**（可自定义）：沟通风格

创建 `.opencode/SOUL.md` 来自定义 Chief 的沟通风格：

```bash
/init-soul  # 创建默认 SOUL.md 模板
```

可自定义内容：
- 让 Chief 更正式或更随意
- 调整语言偏好
- 改变直接程度

修改后重启 OpenCode 生效。

### 内置 Skills

| 技能 | 命令 | 说明 |
|------|------|------|
| **super-analyst** | `/super-analyst` | 12 个分析框架 + 调研方法论 |
| **super-writer** | `/super-writer` | 6 种写作方法论（W.R.I.T.E、AIDA 等） |
| **super-fact-checker** | `/super-fact-checker` | 声明核查 + 来源可信度评估 |
| **super-editor** | `/super-editor` | 四层编辑：结构 → 段落 → 句子 → 词语 |
| **super-interviewer** | `/super-interviewer` | 对话技巧，用于探索 |
| **playwright** | `/playwright` | 浏览器自动化 |

Chief 在任务需要时自动加载技能。

### MCP 服务器

内置 MCP：

| MCP | 默认状态 | 配置 |
|-----|----------|------|
| **websearch** (Exa) | 已启用 | 无 |
| **sequential-thinking** | 已启用 | 无 |
| **tavily** | 未启用 | `api_key` |
| **firecrawl** | 未启用 | `api_key` |

### 禁用功能

```json
{
  "disabled_agents": ["fact-checker"],
  "disabled_skills": ["super-analyst"],
  "disabled_hooks": ["memory-system"],
  "disabled_mcps": ["sequential-thinking"]
}
```

## 记忆系统

自动保存对话摘要到 `.opencode/memory/`：
- 每日摘要（LLM 生成）
- 每个 session 的完整记录
- 7 天后自动归档到 `MEMORY.md`

使用 `/memory-consolidate` 手动触发整理。

## 其他功能

- **后台任务**：并行运行多个 Agent
- **会话恢复**：自动从错误中恢复
- **启动配置检查**：首次运行时引导模型设置
- **插件切换**：`/switch newtype` / `/switch omo` / `/switch none`

## 许可证

基于 [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) 修改，遵循 [SUL-1.0 许可证](https://github.com/code-yeongyu/oh-my-opencode/blob/master/LICENSE.md)。
