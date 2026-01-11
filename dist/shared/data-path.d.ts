/**
 * Returns the user-level data directory.
 * Matches OpenCode's behavior via xdg-basedir:
 * - All platforms: XDG_DATA_HOME or ~/.local/share
 *
 * Note: OpenCode uses xdg-basedir which returns ~/.local/share on ALL platforms
 * including Windows, so we match that behavior exactly.
 */
export declare function getDataDir(): string;
/**
 * Returns the OpenCode storage directory path.
 * All platforms: ~/.local/share/opencode/storage
 */
export declare function getOpenCodeStorageDir(): string;
