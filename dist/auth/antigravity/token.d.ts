import type { AntigravityRefreshParts, AntigravityTokenExchangeResult, AntigravityTokens } from "./types";
export declare class AntigravityTokenRefreshError extends Error {
    code?: string;
    description?: string;
    status: number;
    statusText: string;
    responseBody?: string;
    constructor(options: {
        message: string;
        code?: string;
        description?: string;
        status: number;
        statusText: string;
        responseBody?: string;
    });
    get isInvalidGrant(): boolean;
    get isNetworkError(): boolean;
}
export declare function isTokenExpired(tokens: AntigravityTokens): boolean;
export declare function refreshAccessToken(refreshToken: string, clientId?: string, clientSecret?: string): Promise<AntigravityTokenExchangeResult>;
/**
 * Parse a stored token string into its component parts.
 * Storage format: `refreshToken|projectId|managedProjectId`
 *
 * @param stored - The pipe-separated stored token string
 * @returns Parsed refresh parts with refreshToken, projectId, and optional managedProjectId
 */
export declare function parseStoredToken(stored: string): AntigravityRefreshParts;
/**
 * Format token components for storage.
 * Creates a pipe-separated string: `refreshToken|projectId|managedProjectId`
 *
 * @param refreshToken - The refresh token
 * @param projectId - The GCP project ID
 * @param managedProjectId - Optional managed project ID for enterprise users
 * @returns Formatted string for storage
 */
export declare function formatTokenForStorage(refreshToken: string, projectId: string, managedProjectId?: string): string;
