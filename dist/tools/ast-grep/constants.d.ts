export declare function findSgCliPathSync(): string | null;
export declare function getSgCliPath(): string;
export declare function setSgCliPath(path: string): void;
export declare const CLI_LANGUAGES: readonly ["bash", "c", "cpp", "csharp", "css", "elixir", "go", "haskell", "html", "java", "javascript", "json", "kotlin", "lua", "nix", "php", "python", "ruby", "rust", "scala", "solidity", "swift", "typescript", "tsx", "yaml"];
export declare const NAPI_LANGUAGES: readonly ["html", "javascript", "tsx", "css", "typescript"];
export declare const DEFAULT_TIMEOUT_MS = 300000;
export declare const DEFAULT_MAX_OUTPUT_BYTES: number;
export declare const DEFAULT_MAX_MATCHES = 500;
export declare const LANG_EXTENSIONS: Record<string, string[]>;
export interface EnvironmentCheckResult {
    cli: {
        available: boolean;
        path: string;
        error?: string;
    };
    napi: {
        available: boolean;
        error?: string;
    };
}
/**
 * Check if ast-grep CLI and NAPI are available.
 * Call this at startup to provide early feedback about missing dependencies.
 */
export declare function checkEnvironment(): EnvironmentCheckResult;
/**
 * Format environment check result as user-friendly message.
 */
export declare function formatEnvironmentCheck(result: EnvironmentCheckResult): string;
