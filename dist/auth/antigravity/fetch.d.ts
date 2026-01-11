/**
 * Antigravity Fetch Interceptor
 *
 * Creates a custom fetch function that:
 * - Checks token expiration and auto-refreshes
 * - Rewrites URLs to Antigravity endpoints
 * - Applies request transformation (including tool normalization)
 * - Applies response transformation (including thinking extraction)
 * - Implements endpoint fallback (daily → autopush → prod)
 *
 * **Body Type Assumption:**
 * This interceptor assumes `init.body` is a JSON string (OpenAI format).
 * Non-string bodies (ReadableStream, Blob, FormData, URLSearchParams, etc.)
 * are passed through unchanged to the original fetch to avoid breaking
 * other requests that may not be OpenAI-format API calls.
 *
 * Debug logging available via ANTIGRAVITY_DEBUG=1 environment variable.
 */
import { AccountManager } from "./accounts";
/**
 * Auth interface matching OpenCode's auth system
 */
interface Auth {
    access?: string;
    refresh?: string;
    expires?: number;
}
/**
 * Client interface for auth operations
 */
interface AuthClient {
    set(providerId: string, auth: Auth): Promise<void>;
}
/**
 * Create Antigravity fetch interceptor
 *
 * Factory function that creates a custom fetch function for Antigravity API.
 * Handles token management, request/response transformation, and endpoint fallback.
 *
 * @param getAuth - Async function to retrieve current auth state
 * @param client - Auth client for saving updated tokens
 * @param providerId - Provider identifier (e.g., "google")
 * @param clientId - Optional custom client ID for token refresh (defaults to ANTIGRAVITY_CLIENT_ID)
 * @param clientSecret - Optional custom client secret for token refresh (defaults to ANTIGRAVITY_CLIENT_SECRET)
 * @returns Custom fetch function compatible with standard fetch signature
 *
 * @example
 * ```typescript
 * const customFetch = createAntigravityFetch(
 *   () => auth(),
 *   client,
 *   "google",
 *   "custom-client-id",
 *   "custom-client-secret"
 * )
 *
 * // Use like standard fetch
 * const response = await customFetch("https://api.example.com/chat", {
 *   method: "POST",
 *   body: JSON.stringify({ messages: [...] })
 * })
 * ```
 */
export declare function createAntigravityFetch(getAuth: () => Promise<Auth>, client: AuthClient, providerId: string, clientId?: string, clientSecret?: string, accountManager?: AccountManager | null): (url: string, init?: RequestInit) => Promise<Response>;
/**
 * Type export for createAntigravityFetch return type
 */
export type AntigravityFetch = (url: string, init?: RequestInit) => Promise<Response>;
export {};
