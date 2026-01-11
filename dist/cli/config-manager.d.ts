import { type OpenCodeBinaryType, type OpenCodeConfigPaths } from "../shared";
import type { ConfigMergeResult, DetectedConfig, InstallConfig } from "./types";
interface ConfigContext {
    binary: OpenCodeBinaryType;
    version: string | null;
    paths: OpenCodeConfigPaths;
}
export declare function initConfigContext(binary: OpenCodeBinaryType, version: string | null): void;
export declare function getConfigContext(): ConfigContext;
export declare function resetConfigContext(): void;
export declare function fetchLatestVersion(packageName: string): Promise<string | null>;
type ConfigFormat = "json" | "jsonc" | "none";
export declare function detectConfigFormat(): {
    format: ConfigFormat;
    path: string;
};
export declare function addPluginToOpenCodeConfig(): ConfigMergeResult;
export declare function generateOmoConfig(installConfig: InstallConfig): Record<string, unknown>;
export declare function writeOmoConfig(installConfig: InstallConfig): ConfigMergeResult;
export declare function isOpenCodeInstalled(): Promise<boolean>;
export declare function getOpenCodeVersion(): Promise<string | null>;
export declare function addAuthPlugins(config: InstallConfig): Promise<ConfigMergeResult>;
export interface BunInstallResult {
    success: boolean;
    timedOut?: boolean;
    error?: string;
}
export declare function runBunInstall(): Promise<boolean>;
export declare function runBunInstallWithDetails(): Promise<BunInstallResult>;
/**
 * Antigravity Provider Configuration
 *
 * IMPORTANT: Model names MUST use `antigravity-` prefix for stability.
 *
 * The opencode-antigravity-auth plugin supports two naming conventions:
 * - `antigravity-gemini-3-pro-high` (RECOMMENDED, explicit Antigravity quota routing)
 * - `gemini-3-pro-high` (LEGACY, backward compatible but may break in future)
 *
 * Legacy names rely on Gemini CLI using `-preview` suffix for disambiguation.
 * If Google removes `-preview`, legacy names may route to wrong quota.
 *
 * @see https://github.com/NoeFabris/opencode-antigravity-auth#migration-guide-v127
 */
export declare const ANTIGRAVITY_PROVIDER_CONFIG: {
    google: {
        name: string;
        models: {
            "antigravity-gemini-3-pro-high": {
                name: string;
                thinking: boolean;
                attachment: boolean;
                limit: {
                    context: number;
                    output: number;
                };
                modalities: {
                    input: string[];
                    output: string[];
                };
            };
            "antigravity-gemini-3-pro-low": {
                name: string;
                thinking: boolean;
                attachment: boolean;
                limit: {
                    context: number;
                    output: number;
                };
                modalities: {
                    input: string[];
                    output: string[];
                };
            };
            "antigravity-gemini-3-flash": {
                name: string;
                attachment: boolean;
                limit: {
                    context: number;
                    output: number;
                };
                modalities: {
                    input: string[];
                    output: string[];
                };
            };
        };
    };
};
export declare function addProviderConfig(config: InstallConfig): ConfigMergeResult;
export declare function detectCurrentConfig(): DetectedConfig;
export {};
