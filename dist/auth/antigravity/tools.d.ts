/**
 * Antigravity Tool Normalization
 * Converts tools between OpenAI and Gemini formats.
 *
 * OpenAI format:
 *   { "type": "function", "function": { "name": "x", "description": "...", "parameters": {...} } }
 *
 * Gemini format:
 *   { "functionDeclarations": [{ "name": "x", "description": "...", "parameters": {...} }] }
 *
 * Note: This is for Gemini models ONLY. Claude models are not supported via Antigravity.
 */
/**
 * OpenAI function tool format
 */
export interface OpenAITool {
    type: string;
    function?: {
        name: string;
        description?: string;
        parameters?: Record<string, unknown>;
    };
}
/**
 * Gemini function declaration format
 */
export interface GeminiFunctionDeclaration {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
}
/**
 * Gemini tools format (array of functionDeclarations)
 */
export interface GeminiTools {
    functionDeclarations: GeminiFunctionDeclaration[];
}
/**
 * OpenAI tool call in response
 */
export interface OpenAIToolCall {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
}
/**
 * Gemini function call in response
 */
export interface GeminiFunctionCall {
    name: string;
    args: Record<string, unknown>;
}
/**
 * Gemini function response format
 */
export interface GeminiFunctionResponse {
    name: string;
    response: Record<string, unknown>;
}
/**
 * Gemini tool result containing function calls
 */
export interface GeminiToolResult {
    functionCall?: GeminiFunctionCall;
    functionResponse?: GeminiFunctionResponse;
}
/**
 * Normalize OpenAI-format tools to Gemini format.
 * Converts an array of OpenAI tools to Gemini's functionDeclarations format.
 *
 * - Handles `function` type tools with name, description, parameters
 * - Logs warning for unsupported tool types (does NOT silently drop them)
 * - Creates a single object with functionDeclarations array
 *
 * @param tools - Array of OpenAI-format tools
 * @returns Gemini-format tools object with functionDeclarations, or undefined if no valid tools
 */
export declare function normalizeToolsForGemini(tools: OpenAITool[]): GeminiTools | undefined;
/**
 * Convert Gemini tool results (functionCall) back to OpenAI tool_call format.
 * Handles both functionCall (request) and functionResponse (result) formats.
 *
 * Gemini functionCall format:
 *   { "name": "tool_name", "args": { ... } }
 *
 * OpenAI tool_call format:
 *   { "id": "call_xxx", "type": "function", "function": { "name": "tool_name", "arguments": "..." } }
 *
 * @param results - Array of Gemini tool results containing functionCall or functionResponse
 * @returns Array of OpenAI-format tool calls
 */
export declare function normalizeToolResultsFromGemini(results: GeminiToolResult[]): OpenAIToolCall[];
/**
 * Convert a single Gemini functionCall to OpenAI tool_call format.
 * Useful for streaming responses where each chunk may contain a function call.
 *
 * @param functionCall - Gemini function call
 * @param id - Optional tool call ID (generates one if not provided)
 * @returns OpenAI-format tool call
 */
export declare function convertFunctionCallToToolCall(functionCall: GeminiFunctionCall, id?: string): OpenAIToolCall;
/**
 * Check if a tool array contains any function-type tools.
 *
 * @param tools - Array of OpenAI-format tools
 * @returns true if there are function tools to normalize
 */
export declare function hasFunctionTools(tools: OpenAITool[]): boolean;
/**
 * Extract function declarations from already-normalized Gemini tools.
 * Useful when tools may already be in Gemini format.
 *
 * @param tools - Tools that may be in Gemini or OpenAI format
 * @returns Array of function declarations
 */
export declare function extractFunctionDeclarations(tools: unknown): GeminiFunctionDeclaration[];
