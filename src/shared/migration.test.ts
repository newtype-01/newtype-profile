import { describe, test, expect, afterEach } from "bun:test"
import * as fs from "fs"
import * as path from "path"
import {
  AGENT_NAME_MAP,
  HOOK_NAME_MAP,
  migrateAgentNames,
  migrateHookNames,
  migrateConfigFile,
  migrateAgentConfigToCategory,
  shouldDeleteAgentConfig,
} from "./migration"

describe("migrateAgentNames", () => {
  test("migrates legacy OmO names to chief", () => {
    // #given: Config with legacy OmO agent names
    const agents = {
      omo: { model: "anthropic/claude-opus-4-5" },
      OmO: { temperature: 0.5 },
      "OmO-Plan": { prompt: "custom prompt" },
    }

    // #when: Migrate agent names
    const { migrated, changed } = migrateAgentNames(agents)

    // #then: Legacy names should be migrated to chief
    expect(changed).toBe(true)
    expect(migrated["chief"]).toBeDefined()
    expect(migrated["omo"]).toBeUndefined()
    expect(migrated["OmO"]).toBeUndefined()
    expect(migrated["OmO-Plan"]).toBeUndefined()
  })

  test("preserves current agent names unchanged", () => {
    // #given: Config with current agent names
    const agents = {
      researcher: { model: "google/antigravity-gemini-3-pro-high" },
      archivist: { model: "google/antigravity-claude-sonnet-4-5" },
      writer: { model: "google/antigravity-gemini-3-pro-high" },
    }

    // #when: Migrate agent names
    const { migrated, changed } = migrateAgentNames(agents)

    // #then: Current names should remain unchanged
    expect(changed).toBe(false)
    expect(migrated["researcher"]).toEqual({ model: "google/antigravity-gemini-3-pro-high" })
    expect(migrated["archivist"]).toEqual({ model: "google/antigravity-claude-sonnet-4-5" })
    expect(migrated["writer"]).toEqual({ model: "google/antigravity-gemini-3-pro-high" })
  })

  test("handles case-insensitive migration", () => {
    // #given: Config with mixed case agent names
    const agents = {
      SISYPHUS: { model: "test" },
      "planner-sisyphus": { prompt: "test" },
    }

    // #when: Migrate agent names
    const { migrated, changed } = migrateAgentNames(agents)

    // #then: Case-insensitive lookup should migrate correctly
    expect(migrated["chief"]).toBeDefined()
  })

  test("passes through unknown agent names unchanged", () => {
    // #given: Config with unknown agent name
    const agents = {
      "custom-agent": { model: "custom/model" },
    }

    // #when: Migrate agent names
    const { migrated, changed } = migrateAgentNames(agents)

    // #then: Unknown names should pass through
    expect(changed).toBe(false)
    expect(migrated["custom-agent"]).toEqual({ model: "custom/model" })
  })
})

describe("migrateHookNames", () => {
  test("migrates anthropic-auto-compact to anthropic-context-window-limit-recovery", () => {
    // #given: Config with legacy hook name
    const hooks = ["anthropic-auto-compact", "comment-checker"]

    // #when: Migrate hook names
    const { migrated, changed } = migrateHookNames(hooks)

    // #then: Legacy hook name should be migrated
    expect(changed).toBe(true)
    expect(migrated).toContain("anthropic-context-window-limit-recovery")
    expect(migrated).toContain("comment-checker")
    expect(migrated).not.toContain("anthropic-auto-compact")
  })

  test("preserves current hook names unchanged", () => {
    // #given: Config with current hook names
    const hooks = [
      "anthropic-context-window-limit-recovery",
      "todo-continuation-enforcer",
      "session-recovery",
    ]

    // #when: Migrate hook names
    const { migrated, changed } = migrateHookNames(hooks)

    // #then: Current names should remain unchanged
    expect(changed).toBe(false)
    expect(migrated).toEqual(hooks)
  })

  test("handles empty hooks array", () => {
    // #given: Empty hooks array
    const hooks: string[] = []

    // #when: Migrate hook names
    const { migrated, changed } = migrateHookNames(hooks)

    // #then: Should return empty array with no changes
    expect(changed).toBe(false)
    expect(migrated).toEqual([])
  })

  test("migrates multiple legacy hook names", () => {
    // #given: Multiple legacy hook names (if more are added in future)
    const hooks = ["anthropic-auto-compact"]

    // #when: Migrate hook names
    const { migrated, changed } = migrateHookNames(hooks)

    // #then: All legacy names should be migrated
    expect(changed).toBe(true)
    expect(migrated).toEqual(["anthropic-context-window-limit-recovery"])
  })
})

describe("migrateConfigFile", () => {
  const testConfigPath = "/tmp/nonexistent-path-for-test.json"

  test("migrates omo_agent to chief_agent", () => {
    // #given: Config with legacy omo_agent key
    const rawConfig: Record<string, unknown> = {
      omo_agent: { disabled: false },
    }

    // #when: Migrate config file
    const needsWrite = migrateConfigFile(testConfigPath, rawConfig)

    // #then: omo_agent should be migrated to chief_agent
    expect(needsWrite).toBe(true)
    expect(rawConfig.chief_agent).toEqual({ disabled: false })
    expect(rawConfig.omo_agent).toBeUndefined()
  })

  test("migrates legacy agent names in agents object", () => {
    // #given: Config with legacy agent names
    const rawConfig: Record<string, unknown> = {
      agents: {
        omo: { model: "test" },
        OmO: { temperature: 0.5 },
      },
    }

    // #when: Migrate config file
    const needsWrite = migrateConfigFile(testConfigPath, rawConfig)

    // #then: Agent names should be migrated
    expect(needsWrite).toBe(true)
    const agents = rawConfig.agents as Record<string, unknown>
    expect(agents["chief"]).toBeDefined()
  })

  test("migrates legacy hook names in disabled_hooks", () => {
    // #given: Config with legacy hook names
    const rawConfig: Record<string, unknown> = {
      disabled_hooks: ["anthropic-auto-compact", "comment-checker"],
    }

    // #when: Migrate config file
    const needsWrite = migrateConfigFile(testConfigPath, rawConfig)

    // #then: Hook names should be migrated
    expect(needsWrite).toBe(true)
    expect(rawConfig.disabled_hooks).toContain("anthropic-context-window-limit-recovery")
    expect(rawConfig.disabled_hooks).not.toContain("anthropic-auto-compact")
  })

  test("does not write if no migration needed", () => {
    // #given: Config with current names
    const rawConfig: Record<string, unknown> = {
      chief_agent: { disabled: false },
      agents: {
        chief: { model: "test" },
      },
      disabled_hooks: ["anthropic-context-window-limit-recovery"],
    }

    // #when: Migrate config file
    const needsWrite = migrateConfigFile(testConfigPath, rawConfig)

    // #then: No write should be needed
    expect(needsWrite).toBe(false)
  })

  test("handles migration of all legacy items together", () => {
    // #given: Config with all legacy items
    const rawConfig: Record<string, unknown> = {
      omo_agent: { disabled: false },
      agents: {
        omo: { model: "test" },
        "OmO-Plan": { prompt: "custom" },
      },
      disabled_hooks: ["anthropic-auto-compact"],
    }

    // #when: Migrate config file
    const needsWrite = migrateConfigFile(testConfigPath, rawConfig)

    // #then: All legacy items should be migrated
    expect(needsWrite).toBe(true)
    expect(rawConfig.chief_agent).toEqual({ disabled: false })
    expect(rawConfig.omo_agent).toBeUndefined()
    const agents = rawConfig.agents as Record<string, unknown>
    expect(agents["chief"]).toBeDefined()
    expect(rawConfig.disabled_hooks).toContain("anthropic-context-window-limit-recovery")
  })
})

describe("migration maps", () => {
  test("AGENT_NAME_MAP contains all expected legacy mappings", () => {
    // #given/#when: Check AGENT_NAME_MAP
    // #then: Should contain all legacy → current mappings
    expect(AGENT_NAME_MAP["omo"]).toBe("chief")
    expect(AGENT_NAME_MAP["OmO"]).toBe("chief")
    expect(AGENT_NAME_MAP["sisyphus"]).toBe("chief")
    expect(AGENT_NAME_MAP["oracle"]).toBe("researcher")
    expect(AGENT_NAME_MAP["librarian"]).toBe("archivist")
  })

  test("HOOK_NAME_MAP contains anthropic-auto-compact migration", () => {
    // #given/#when: Check HOOK_NAME_MAP
    // #then: Should contain be legacy hook name mapping
    expect(HOOK_NAME_MAP["anthropic-auto-compact"]).toBe("anthropic-context-window-limit-recovery")
  })
})

describe("migrateAgentConfigToCategory", () => {
  test("migrates model to category when mapping exists", () => {
    // #given: Config with a model that has a category mapping
    const config = {
      model: "google/antigravity-gemini-3-pro-high",
      temperature: 0.5,
      top_p: 0.9,
    }

    // #when: Migrate agent config to category
    const { migrated, changed } = migrateAgentConfigToCategory(config)

    // #then: Model should be replaced with category
    expect(changed).toBe(true)
    expect(migrated.category).toBe("research")
    expect(migrated.model).toBeUndefined()
    expect(migrated.temperature).toBe(0.5)
    expect(migrated.top_p).toBe(0.9)
  })

  test("does not migrate when model is not in map", () => {
    // #given: Config with a model that has no mapping
    const config = {
      model: "custom/model",
      temperature: 0.5,
    }

    // #when: Migrate agent config to category
    const { migrated, changed } = migrateAgentConfigToCategory(config)

    // #then: Config should remain unchanged
    expect(changed).toBe(false)
    expect(migrated).toEqual(config)
  })

  test("does not migrate when model is not a string", () => {
    // #given: Config with non-string model
    const config = {
      model: { name: "test" },
      temperature: 0.5,
    }

    // #when: Migrate agent config to category
    const { migrated, changed } = migrateAgentConfigToCategory(config)

    // #then: Config should remain unchanged
    expect(changed).toBe(false)
    expect(migrated).toEqual(config)
  })

  test("handles all mapped models correctly", () => {
    // #given: Configs for each mapped model
    const configs = [
      { model: "google/antigravity-gemini-3-pro-high" },
      { model: "google/antigravity-claude-sonnet-4-5" },
      { model: "google/antigravity-gemini-3-flash" },
      { model: "google/antigravity-claude-opus-4-5-thinking-high" },
    ]

    const expectedCategories = ["research", "archive", "quick", "writing"]

    // #when: Migrate each config
    const results = configs.map(migrateAgentConfigToCategory)

    // #then: Each model should map to correct category
    results.forEach((result, index) => {
      expect(result.changed).toBe(true)
      expect(result.migrated.category).toBe(expectedCategories[index])
      expect(result.migrated.model).toBeUndefined()
    })
  })

  test("preserves non-model fields during migration", () => {
    // #given: Config with multiple fields
    const config = {
      model: "google/antigravity-gemini-3-pro-high",
      temperature: 0.1,
      top_p: 0.95,
      maxTokens: 4096,
      prompt_append: "custom instruction",
    }

    // #when: Migrate agent config to category
    const { migrated } = migrateAgentConfigToCategory(config)

    // #then: All non-model fields should be preserved
    expect(migrated.category).toBe("research")
    expect(migrated.temperature).toBe(0.1)
    expect(migrated.top_p).toBe(0.95)
    expect(migrated.maxTokens).toBe(4096)
    expect(migrated.prompt_append).toBe("custom instruction")
  })
})

describe("shouldDeleteAgentConfig", () => {
  test("returns true when config only has category field", () => {
    // #given: Config with only category field (no overrides)
    const config = { category: "research" }

    // #when: Check if config should be deleted
    const shouldDelete = shouldDeleteAgentConfig(config, "research")

    // #then: Should return true (matches category defaults)
    expect(shouldDelete).toBe(true)
  })

  test("returns false when category does not exist", () => {
    // #given: Config with unknown category
    const config = { category: "unknown" }

    // #when: Check if config should be deleted
    const shouldDelete = shouldDeleteAgentConfig(config, "unknown")

    // #then: Should return false (category not found)
    expect(shouldDelete).toBe(false)
  })

  test("returns true when all fields match category defaults", () => {
    // #given: Config with fields matching category defaults
    const config = {
      category: "research",
      model: "google/antigravity-gemini-3-pro-high",
      temperature: 0.5,
    }

    // #when: Check if config should be deleted
    const shouldDelete = shouldDeleteAgentConfig(config, "research")

    // #then: Should return true (all fields match defaults)
    expect(shouldDelete).toBe(true)
  })

  test("returns false when fields differ from category defaults", () => {
    // #given: Config with custom temperature override
    const config = {
      category: "research",
      temperature: 0.9, // Different from default (0.5)
    }

    // #when: Check if config should be deleted
    const shouldDelete = shouldDeleteAgentConfig(config, "research")

    // #then: Should return false (has custom override)
    expect(shouldDelete).toBe(false)
  })

  test("handles different categories with their defaults", () => {
    // #given: Configs for different categories
    const configs = [
      { category: "research", temperature: 0.5 },
      { category: "quick", temperature: 0.3 },
      { category: "writing", temperature: 0.7 },
      { category: "archive", temperature: 0.3 },
    ]

    // #when: Check each config
    const results = configs.map((config) => shouldDeleteAgentConfig(config, config.category as string))

    // #then: All should be true (all match defaults)
    results.forEach((result) => {
      expect(result).toBe(true)
    })
  })

  test("returns false when additional fields are present", () => {
    // #given: Config with extra fields
    const config = {
      category: "research",
      temperature: 0.5,
      custom_field: "value", // Extra field not in defaults
    }

    // #when: Check if config should be deleted
    const shouldDelete = shouldDeleteAgentConfig(config, "research")

    // #then: Should return false (has extra field)
    expect(shouldDelete).toBe(false)
  })

  test("handles complex config with multiple overrides", () => {
    // #given: Config with multiple custom overrides
    const config = {
      category: "research",
      temperature: 0.1, // Different from default
      top_p: 0.8, // Different from default
      prompt_append: "custom prompt", // Custom field
    }

    // #when: Check if config should be deleted
    const shouldDelete = shouldDeleteAgentConfig(config, "research")

    // #then: Should return false (has overrides)
    expect(shouldDelete).toBe(false)
  })
})

describe("migrateConfigFile with backup", () => {
  const cleanupPaths: string[] = []

  afterEach(() => {
    cleanupPaths.forEach((p) => {
      try {
        fs.unlinkSync(p)
      } catch {
      }
    })
  })

  test("creates backup file with timestamp when migration needed", () => {
    // #given: Config file path and config needing migration
    const testConfigPath = "/tmp/test-config-migration.json"
    const testConfigContent = globalThis.JSON.stringify({ agents: { researcher: { model: "google/antigravity-gemini-3-pro-high" } } }, null, 2)
    const rawConfig: Record<string, unknown> = {
      agents: {
        researcher: { model: "google/antigravity-gemini-3-pro-high" },
      },
    }

    fs.writeFileSync(testConfigPath, testConfigContent)
    cleanupPaths.push(testConfigPath)

    // #when: Migrate config file
    const needsWrite = migrateConfigFile(testConfigPath, rawConfig)

    // #then: Backup file should be created with timestamp
    expect(needsWrite).toBe(true)

    const dir = path.dirname(testConfigPath)
    const basename = path.basename(testConfigPath)
    const files = fs.readdirSync(dir)
    const backupFiles = files.filter((f) => f.startsWith(`${basename}.bak.`))
    expect(backupFiles.length).toBeGreaterThan(0)

    const backupFile = backupFiles[0]
    const backupPath = path.join(dir, backupFile)
    cleanupPaths.push(backupPath)

    expect(backupFile).toMatch(/test-config-migration\.json\.bak\.\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/)

    const backupContent = fs.readFileSync(backupPath, "utf-8")
    expect(backupContent).toBe(testConfigContent)
  })

  test("deletes agent config when all fields match category defaults", () => {
    // #given: Config with agent matching category defaults
    const testConfigPath = "/tmp/test-config-delete.json"
    const rawConfig: Record<string, unknown> = {
      agents: {
        researcher: {
          model: "google/antigravity-gemini-3-pro-high",
        },
      },
    }

    fs.writeFileSync(testConfigPath, globalThis.JSON.stringify(rawConfig, null, 2))
    cleanupPaths.push(testConfigPath)

    // #when: Migrate config file
    const needsWrite = migrateConfigFile(testConfigPath, rawConfig)

    // #then: Agent config should be deleted (matches defaults after migration)
    expect(needsWrite).toBe(true)
    const agents = rawConfig.agents as Record<string, unknown>
    expect(agents["researcher"]).toBeUndefined()
  })

  test("handles multiple agent migrations correctly", () => {
    // #given: Config with multiple agents
    const testConfigPath = "/tmp/test-config-multi.json"
    const rawConfig: Record<string, unknown> = {
      agents: {
        researcher: { model: "google/antigravity-gemini-3-pro-high" },
        writer: { temperature: 0.9 },
        custom: { model: "custom/model" },
      },
    }

    fs.writeFileSync(testConfigPath, globalThis.JSON.stringify(rawConfig, null, 2))
    cleanupPaths.push(testConfigPath)

    // #when: Migrate config file
    const needsWrite = migrateConfigFile(testConfigPath, rawConfig)

    // #then: Check migrations
    expect(needsWrite).toBe(true)
    const agents = rawConfig.agents as Record<string, unknown>
    expect(agents["researcher"]).toBeUndefined()
    expect(agents["writer"]).toEqual({ temperature: 0.9 })
    expect(agents["custom"]).toEqual({ model: "custom/model" })
  })
})
