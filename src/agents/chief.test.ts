import { describe, test, expect } from "bun:test"
import { buildChiefPrompt, DEFAULT_OUTER_PERSONA, createChiefAgent } from "./chief"

describe("chief prompt layers", () => {
  describe("buildChiefPrompt", () => {
    test("uses DEFAULT_OUTER_PERSONA when no outerPersona provided", () => {
      // #when
      const prompt = buildChiefPrompt()
      
      // #then
      expect(prompt).toContain(DEFAULT_OUTER_PERSONA)
    })

    test("uses custom outerPersona when provided", () => {
      // #given
      const customPersona = "<Communication_Style>Custom style</Communication_Style>"
      
      // #when
      const prompt = buildChiefPrompt(customPersona)
      
      // #then
      expect(prompt).toContain(customPersona)
      expect(prompt).not.toContain(DEFAULT_OUTER_PERSONA)
    })

    test("always includes CAPABILITIES (bottom layer)", () => {
      // #when
      const prompt = buildChiefPrompt()
      
      // #then
      expect(prompt).toContain("<Role>")
      expect(prompt).toContain("<Core_Capabilities>")
      expect(prompt).toContain("<Your_Team>")
      expect(prompt).toContain("<Delegation_Logic>")
      expect(prompt).toContain("<Execution_Behavior>")
      expect(prompt).toContain("<Memory_System>")
    })

    test("always includes INNER_PERSONA (middle layer)", () => {
      // #when
      const prompt = buildChiefPrompt()
      
      // #then
      expect(prompt).toContain("<Philosophy>")
      expect(prompt).toContain("<Thinking_Framework>")
      expect(prompt).toContain("<Information_Standards>")
    })

    test("custom outerPersona does not affect other layers", () => {
      // #given
      const customPersona = "<Communication_Style>Minimal</Communication_Style>"
      
      // #when
      const prompt = buildChiefPrompt(customPersona)
      
      // #then - capabilities still present
      expect(prompt).toContain("<Role>")
      expect(prompt).toContain("<Your_Team>")
      // #then - inner persona still present
      expect(prompt).toContain("<Philosophy>")
      expect(prompt).toContain("<Thinking_Framework>")
    })
  })

  describe("createChiefAgent", () => {
    test("creates agent with default persona when no outerPersona", () => {
      // #when
      const agent = createChiefAgent()
      
      // #then
      expect(agent.prompt).toContain(DEFAULT_OUTER_PERSONA)
    })

    test("creates agent with custom persona when provided", () => {
      // #given
      const customPersona = "<Discussion_Style>Be brief</Discussion_Style>"
      
      // #when
      const agent = createChiefAgent(undefined, customPersona)
      
      // #then
      expect(agent.prompt).toContain(customPersona)
      expect(agent.prompt).not.toContain(DEFAULT_OUTER_PERSONA)
    })

    test("accepts model parameter", () => {
      // #given
      const model = "google/antigravity-claude-opus-4-5"
      
      // #when
      const agent = createChiefAgent(model)
      
      // #then
      expect(agent.model).toBe(model)
    })

    test("has correct temperature", () => {
      // #when
      const agent = createChiefAgent()
      
      // #then
      expect(agent.temperature).toBe(0.3)
    })
  })
})
