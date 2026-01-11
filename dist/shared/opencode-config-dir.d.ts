export type OpenCodeBinaryType = "opencode" | "opencode-desktop";
export interface OpenCodeConfigDirOptions {
    binary: OpenCodeBinaryType;
    version?: string | null;
    checkExisting?: boolean;
}
export interface OpenCodeConfigPaths {
    configDir: string;
    configJson: string;
    configJsonc: string;
    packageJson: string;
    omoConfig: string;
}
export declare const TAURI_APP_IDENTIFIER = "ai.opencode.desktop";
export declare const TAURI_APP_IDENTIFIER_DEV = "ai.opencode.desktop.dev";
export declare function isDevBuild(version: string | null | undefined): boolean;
export declare function getOpenCodeConfigDir(options: OpenCodeConfigDirOptions): string;
export declare function getOpenCodeConfigPaths(options: OpenCodeConfigDirOptions): OpenCodeConfigPaths;
export declare function detectExistingConfigDir(binary: OpenCodeBinaryType, version?: string | null): string | null;
