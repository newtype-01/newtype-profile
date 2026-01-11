import { type GrepBackend } from "./constants";
import type { GlobOptions, GlobResult } from "./types";
export interface ResolvedCli {
    path: string;
    backend: GrepBackend;
}
export declare function runRgFiles(options: GlobOptions, resolvedCli?: ResolvedCli): Promise<GlobResult>;
