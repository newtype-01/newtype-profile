/**
 * Cross-platform browser opening utility.
 * Uses the "open" npm package for reliable cross-platform support.
 *
 * Supports: macOS, Windows, Linux (including WSL)
 */
/**
 * Opens a URL in the user's default browser.
 *
 * Cross-platform support:
 * - macOS: uses `open` command
 * - Windows: uses `start` command
 * - Linux: uses `xdg-open` command
 * - WSL: uses Windows PowerShell
 *
 * @param url - The URL to open in the browser
 * @returns Promise<boolean> - true if browser opened successfully, false otherwise
 *
 * @example
 * ```typescript
 * const success = await openBrowserURL("https://accounts.google.com/oauth...")
 * if (!success) {
 *   console.log("Please open this URL manually:", url)
 * }
 * ```
 */
export declare function openBrowserURL(url: string): Promise<boolean>;
