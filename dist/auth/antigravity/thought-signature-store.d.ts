/**
 * Thought Signature Store
 *
 * Stores and retrieves thought signatures for multi-turn conversations.
 * Gemini 3 Pro requires thought_signature on function call content blocks
 * in subsequent requests to maintain reasoning continuity.
 *
 * Key responsibilities:
 * - Store the latest thought signature per session
 * - Provide signature for injection into function call requests
 * - Clear signatures when sessions end
 */
/**
 * Store a thought signature for a session
 *
 * @param sessionKey - Unique session identifier (typically fetch instance ID)
 * @param signature - The thought signature from model response
 */
export declare function setThoughtSignature(sessionKey: string, signature: string): void;
/**
 * Retrieve the stored thought signature for a session
 *
 * @param sessionKey - Unique session identifier
 * @returns The stored signature or undefined if not found
 */
export declare function getThoughtSignature(sessionKey: string): string | undefined;
/**
 * Clear the thought signature for a session
 *
 * @param sessionKey - Unique session identifier
 */
export declare function clearThoughtSignature(sessionKey: string): void;
/**
 * Store or retrieve a persistent session ID for a fetch instance
 *
 * @param fetchInstanceId - Unique identifier for the fetch instance
 * @param sessionId - Optional session ID to store (if not provided, returns existing or generates new)
 * @returns The session ID for this fetch instance
 */
export declare function getOrCreateSessionId(fetchInstanceId: string, sessionId?: string): string;
/**
 * Clear the session ID for a fetch instance
 *
 * @param fetchInstanceId - Unique identifier for the fetch instance
 */
export declare function clearSessionId(fetchInstanceId: string): void;
/**
 * Clear all stored data for a fetch instance (signature + session ID)
 *
 * @param fetchInstanceId - Unique identifier for the fetch instance
 */
export declare function clearFetchInstanceData(fetchInstanceId: string): void;
