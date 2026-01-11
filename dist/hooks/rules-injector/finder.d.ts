import type { RuleFileCandidate } from "./types";
/**
 * Find project root by walking up from startPath.
 * Checks for PROJECT_MARKERS (.git, pyproject.toml, package.json, etc.)
 *
 * @param startPath - Starting path to search from (file or directory)
 * @returns Project root path or null if not found
 */
export declare function findProjectRoot(startPath: string): string | null;
/**
 * Calculate directory distance between a rule file and current file.
 * Distance is based on common ancestor within project root.
 *
 * @param rulePath - Path to the rule file
 * @param currentFile - Path to the current file being edited
 * @param projectRoot - Project root for relative path calculation
 * @returns Distance (0 = same directory, higher = further)
 */
export declare function calculateDistance(rulePath: string, currentFile: string, projectRoot: string | null): number;
/**
 * Find all rule files for a given context.
 * Searches from currentFile upward to projectRoot for rule directories,
 * then user-level directory (~/.claude/rules).
 *
 * IMPORTANT: This searches EVERY directory from file to project root.
 * Not just the project root itself.
 *
 * @param projectRoot - Project root path (or null if outside any project)
 * @param homeDir - User home directory
 * @param currentFile - Current file being edited (for distance calculation)
 * @returns Array of rule file candidates sorted by distance
 */
export declare function findRuleFiles(projectRoot: string | null, homeDir: string, currentFile: string): RuleFileCandidate[];
