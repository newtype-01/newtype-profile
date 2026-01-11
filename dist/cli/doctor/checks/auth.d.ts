import type { CheckResult, CheckDefinition, AuthProviderInfo, AuthProviderId } from "../types";
export declare function getAuthProviderInfo(providerId: AuthProviderId): AuthProviderInfo;
export declare function checkAuthProvider(providerId: AuthProviderId): Promise<CheckResult>;
export declare function checkAnthropicAuth(): Promise<CheckResult>;
export declare function checkOpenAIAuth(): Promise<CheckResult>;
export declare function checkGoogleAuth(): Promise<CheckResult>;
export declare function getAuthCheckDefinitions(): CheckDefinition[];
