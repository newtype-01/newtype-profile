/**
 * Returns the user-level config directory based on the OS.
 * - Linux/macOS: XDG_CONFIG_HOME or ~/.config
 * - Windows: Checks ~/.config first (cross-platform), then %APPDATA% (fallback)
 *
 * On Windows, prioritizes ~/.config for cross-platform consistency.
 * Falls back to %APPDATA% for backward compatibility with existing installations.
 */
export declare function getUserConfigDir(): string;
/**
 * Returns the full path to the user-level oh-my-opencode config file.
 */
export declare function getUserConfigPath(): string;
/**
 * Returns the full path to the project-level oh-my-opencode config file.
 */
export declare function getProjectConfigPath(directory: string): string;
