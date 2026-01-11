import type { CliLanguage, SgResult } from "./types";
export interface RunOptions {
    pattern: string;
    lang: CliLanguage;
    paths?: string[];
    globs?: string[];
    rewrite?: string;
    context?: number;
    updateAll?: boolean;
}
export declare function getAstGrepPath(): Promise<string | null>;
export declare function startBackgroundInit(): void;
export declare function runSg(options: RunOptions): Promise<SgResult>;
export declare function isCliAvailable(): boolean;
export declare function ensureCliAvailable(): Promise<boolean>;
