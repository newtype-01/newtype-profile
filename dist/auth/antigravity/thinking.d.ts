/**
 * Antigravity Thinking Block Handler (Gemini only)
 *
 * Handles extraction and transformation of thinking/reasoning blocks
 * from Gemini responses. Thinking blocks contain the model's internal
 * reasoning process, available in `-high` model variants.
 *
 * Key responsibilities:
 * - Extract thinking blocks from Gemini response format
 * - Detect thinking-capable model variants (`-high` suffix)
 * - Format thinking blocks for OpenAI-compatible output
 *
 * Note: This is Gemini-only. Claude models are NOT handled by Antigravity.
 */
import { type AntigravityModelConfig } from "./constants";
/**
 * Represents a single thinking/reasoning block extracted from Gemini response
 */
export interface ThinkingBlock {
    /** The thinking/reasoning text content */
    text: string;
    /** Optional signature for signed thinking blocks (required for multi-turn) */
    signature?: string;
    /** Index of the thinking block in sequence */
    index?: number;
}
/**
 * Raw part structure from Gemini response candidates
 */
export interface GeminiPart {
    /** Text content of the part */
    text?: string;
    /** Whether this part is a thinking/reasoning block */
    thought?: boolean;
    /** Signature for signed thinking blocks */
    thoughtSignature?: string;
    /** Type field for Anthropic-style format */
    type?: string;
    /** Signature field for Anthropic-style format */
    signature?: string;
}
/**
 * Gemini response candidate structure
 */
export interface GeminiCandidate {
    /** Content containing parts */
    content?: {
        /** Role of the content (e.g., "model", "assistant") */
        role?: string;
        /** Array of content parts */
        parts?: GeminiPart[];
    };
    /** Index of the candidate */
    index?: number;
}
/**
 * Gemini response structure for thinking block extraction
 */
export interface GeminiResponse {
    /** Response ID */
    id?: string;
    /** Array of response candidates */
    candidates?: GeminiCandidate[];
    /** Direct content (some responses use this instead of candidates) */
    content?: Array<{
        type?: string;
        text?: string;
        signature?: string;
    }>;
    /** Model used for response */
    model?: string;
}
/**
 * Result of thinking block extraction
 */
export interface ThinkingExtractionResult {
    /** Extracted thinking blocks */
    thinkingBlocks: ThinkingBlock[];
    /** Combined thinking text for convenience */
    combinedThinking: string;
    /** Whether any thinking blocks were found */
    hasThinking: boolean;
}
/**
 * Default thinking budget in tokens for thinking-enabled models
 */
export declare const DEFAULT_THINKING_BUDGET = 16000;
/**
 * Check if a model variant should include thinking blocks
 *
 * Returns true for model variants with `-high` suffix, which have
 * extended thinking capability enabled.
 *
 * Examples:
 * - `gemini-3-pro-high` → true
 * - `gemini-2.5-pro-high` → true
 * - `gemini-3-pro-preview` → false
 * - `gemini-2.5-pro` → false
 *
 * @param model - Model identifier string
 * @returns True if model should include thinking blocks
 */
export declare function shouldIncludeThinking(model: string): boolean;
/**
 * Check if a model is thinking-capable (broader check)
 *
 * This is a broader check than shouldIncludeThinking - it detects models
 * that have thinking capability, even if not explicitly requesting thinking output.
 *
 * @param model - Model identifier string
 * @returns True if model supports thinking/reasoning
 */
export declare function isThinkingCapableModel(model: string): boolean;
/**
 * Extract thinking blocks from a Gemini response
 *
 * Parses the response structure to identify and extract all thinking/reasoning
 * content. Supports both Gemini-style (thought: true) and Anthropic-style
 * (type: "thinking") formats.
 *
 * @param response - Gemini response object
 * @returns Extraction result with thinking blocks and metadata
 */
export declare function extractThinkingBlocks(response: GeminiResponse): ThinkingExtractionResult;
/**
 * Format thinking blocks for OpenAI-compatible output
 *
 * Converts Gemini thinking block format to OpenAI's expected structure.
 * OpenAI expects thinking content as special message blocks or annotations.
 *
 * Output format:
 * ```
 * [
 *   { type: "reasoning", text: "thinking content...", signature?: "..." },
 *   ...
 * ]
 * ```
 *
 * @param thinking - Array of thinking blocks to format
 * @returns OpenAI-compatible formatted array
 */
export declare function formatThinkingForOpenAI(thinking: ThinkingBlock[]): Array<{
    type: "reasoning";
    text: string;
    signature?: string;
}>;
/**
 * Transform thinking parts in a candidate to OpenAI format
 *
 * Modifies candidate content parts to use OpenAI-style reasoning format
 * while preserving the rest of the response structure.
 *
 * @param candidate - Gemini candidate to transform
 * @returns Transformed candidate with reasoning-formatted thinking
 */
export declare function transformCandidateThinking(candidate: GeminiCandidate): GeminiCandidate;
/**
 * Transform Anthropic-style thinking blocks to reasoning format
 *
 * Converts `type: "thinking"` blocks to `type: "reasoning"` for consistency.
 *
 * @param content - Array of content blocks
 * @returns Transformed content array
 */
export declare function transformAnthropicThinking(content: Array<{
    type?: string;
    text?: string;
    signature?: string;
}>): Array<{
    type?: string;
    text?: string;
    signature?: string;
}>;
/**
 * Filter out unsigned thinking blocks
 *
 * Claude API requires signed thinking blocks for multi-turn conversations.
 * This function removes thinking blocks without valid signatures.
 *
 * @param parts - Array of content parts
 * @returns Filtered array without unsigned thinking blocks
 */
export declare function filterUnsignedThinkingBlocks(parts: GeminiPart[]): GeminiPart[];
/**
 * Transform entire response thinking parts
 *
 * Main transformation function that handles both Gemini-style and
 * Anthropic-style thinking blocks in a response.
 *
 * @param response - Response object to transform
 * @returns Transformed response with standardized reasoning format
 */
export declare function transformResponseThinking(response: GeminiResponse): GeminiResponse;
/**
 * Thinking configuration for requests
 */
export interface ThinkingConfig {
    /** Token budget for thinking/reasoning */
    thinkingBudget?: number;
    /** Whether to include thoughts in response */
    includeThoughts?: boolean;
}
/**
 * Normalize thinking configuration
 *
 * Ensures thinkingConfig is valid: includeThoughts only allowed when budget > 0.
 *
 * @param config - Raw thinking configuration
 * @returns Normalized configuration or undefined
 */
export declare function normalizeThinkingConfig(config: unknown): ThinkingConfig | undefined;
/**
 * Extract thinking configuration from request payload
 *
 * Supports both Gemini-style thinkingConfig and Anthropic-style thinking options.
 * Also supports reasoning_effort parameter which maps to thinking budget/level.
 *
 * @param requestPayload - Request body
 * @param generationConfig - Generation config from request
 * @param extraBody - Extra body options
 * @returns Extracted thinking configuration or undefined
 */
export declare function extractThinkingConfig(requestPayload: Record<string, unknown>, generationConfig?: Record<string, unknown>, extraBody?: Record<string, unknown>): ThinkingConfig | DeleteThinkingConfig | undefined;
/**
 * Resolve final thinking configuration based on model and context
 *
 * Handles special cases like Claude models requiring signed thinking blocks
 * for multi-turn conversations.
 *
 * @param userConfig - User-provided thinking configuration
 * @param isThinkingModel - Whether model supports thinking
 * @param isClaudeModel - Whether model is Claude (not used in Antigravity, but kept for compatibility)
 * @param hasAssistantHistory - Whether conversation has assistant history
 * @returns Final thinking configuration
 */
export declare function resolveThinkingConfig(userConfig: ThinkingConfig | undefined, isThinkingModel: boolean, isClaudeModel: boolean, hasAssistantHistory: boolean): ThinkingConfig | undefined;
/**
 * Get thinking config for a model by normalized ID.
 * Uses pattern matching fallback if exact match not found.
 *
 * @param model - Model identifier string (with or without provider prefix)
 * @returns Thinking configuration or undefined if not found
 */
export declare function getModelThinkingConfig(model: string): AntigravityModelConfig | undefined;
/**
 * Type for the delete thinking config marker.
 * Used when reasoning_effort is "none" to signal complete removal.
 */
export interface DeleteThinkingConfig {
    deleteThinkingConfig: true;
}
/**
 * Union type for thinking configuration input.
 */
export type ThinkingConfigInput = ThinkingConfig | DeleteThinkingConfig;
/**
 * Convert thinking budget to closest level string for Gemini 3 models.
 *
 * @param budget - Thinking budget in tokens
 * @param model - Model identifier
 * @returns Level string ("low", "high", etc.) or "medium" fallback
 */
export declare function budgetToLevel(budget: number, model: string): string;
/**
 * Apply thinking config to request body.
 *
 * CRITICAL: Sets request.generationConfig.thinkingConfig (NOT outer body!)
 *
 * Handles:
 * - Gemini 3: Sets thinkingLevel (string)
 * - Gemini 2.5: Sets thinkingBudget (number)
 * - Delete marker: Removes thinkingConfig entirely
 *
 * @param requestBody - Request body to modify (mutates in place)
 * @param model - Model identifier
 * @param config - Thinking configuration or delete marker
 */
export declare function applyThinkingConfigToRequest(requestBody: Record<string, unknown>, model: string, config: ThinkingConfigInput): void;
