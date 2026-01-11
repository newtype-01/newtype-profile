/**
 * Antigravity request transformer.
 * Transforms OpenAI-format requests to Antigravity format.
 * Does NOT handle tool normalization (handled by tools.ts in Task 9).
 */
import type { AntigravityRequestBody } from "./types";
/**
 * Result of request transformation including URL, headers, and body.
 */
export interface TransformedRequest {
    /** Transformed URL for Antigravity API */
    url: string;
    /** Request headers including Authorization and Antigravity-specific headers */
    headers: Record<string, string>;
    /** Transformed request body in Antigravity format */
    body: AntigravityRequestBody;
    /** Whether this is a streaming request */
    streaming: boolean;
}
/**
 * Build Antigravity-specific request headers.
 * Includes Authorization, User-Agent, X-Goog-Api-Client, and Client-Metadata.
 *
 * @param accessToken - OAuth access token for Authorization header
 * @returns Headers object with all required Antigravity headers
 */
export declare function buildRequestHeaders(accessToken: string): Record<string, string>;
/**
 * Extract model name from request body.
 * OpenAI-format requests include model in the body.
 *
 * @param body - Request body that may contain a model field
 * @returns Model name or undefined if not found
 */
export declare function extractModelFromBody(body: Record<string, unknown>): string | undefined;
/**
 * Extract model name from URL path.
 * Handles Google Generative Language API format: /models/{model}:{action}
 *
 * @param url - Request URL to parse
 * @returns Model name or undefined if not found
 */
export declare function extractModelFromUrl(url: string): string | undefined;
/**
 * Determine the action type from the URL path.
 * E.g., generateContent, streamGenerateContent
 *
 * @param url - Request URL to parse
 * @returns Action name or undefined if not found
 */
export declare function extractActionFromUrl(url: string): string | undefined;
/**
 * Check if a URL is targeting Google's Generative Language API.
 *
 * @param url - URL to check
 * @returns true if this is a Google Generative Language API request
 */
export declare function isGenerativeLanguageRequest(url: string): boolean;
/**
 * Build Antigravity API URL for the given action.
 *
 * @param baseEndpoint - Base Antigravity endpoint URL (from fallbacks)
 * @param action - API action (e.g., generateContent, streamGenerateContent)
 * @param streaming - Whether to append SSE query parameter
 * @returns Formatted Antigravity API URL
 */
export declare function buildAntigravityUrl(baseEndpoint: string, action: string, streaming: boolean): string;
/**
 * Get the first available Antigravity endpoint.
 * Can be used with fallback logic in fetch.ts.
 *
 * @returns Default (first) Antigravity endpoint
 */
export declare function getDefaultEndpoint(): string;
/**
 * Inject ANTIGRAVITY_SYSTEM_PROMPT into request.systemInstruction.
 * Prepends Antigravity prompt before any existing systemInstruction.
 * Prevents duplicate injection by checking for <identity> marker.
 *
 * CRITICAL: Modifies wrappedBody.request.systemInstruction (NOT outer body!)
 *
 * @param wrappedBody - The wrapped request body with request field
 */
export declare function injectSystemPrompt(wrappedBody: {
    request?: unknown;
}): void;
export declare function wrapRequestBody(body: Record<string, unknown>, projectId: string, modelName: string, sessionId: string): AntigravityRequestBody;
export declare function injectThoughtSignatureIntoFunctionCalls(body: Record<string, unknown>, signature: string | undefined): Record<string, unknown>;
/**
 * Detect if request is for streaming.
 * Checks both action name and request body for stream flag.
 *
 * @param url - Request URL
 * @param body - Request body
 * @returns true if streaming is requested
 */
export declare function isStreamingRequest(url: string, body: Record<string, unknown>): boolean;
export interface TransformRequestOptions {
    url: string;
    body: Record<string, unknown>;
    accessToken: string;
    projectId: string;
    sessionId: string;
    modelName?: string;
    endpointOverride?: string;
    thoughtSignature?: string;
}
export declare function transformRequest(options: TransformRequestOptions): TransformedRequest;
/**
 * Prepare request headers for streaming responses.
 * Adds Accept header for SSE format.
 *
 * @param headers - Existing headers object
 * @returns Headers with streaming support
 */
export declare function addStreamingHeaders(headers: Record<string, string>): Record<string, string>;
