import type { CheckResult, CheckDefinition, OpenCodeInfo } from "../types";
export declare function findOpenCodeBinary(): Promise<{
    binary: string;
    path: string;
} | null>;
export declare function getOpenCodeVersion(binary: string): Promise<string | null>;
export declare function compareVersions(current: string, minimum: string): boolean;
export declare function getOpenCodeInfo(): Promise<OpenCodeInfo>;
export declare function checkOpenCodeInstallation(): Promise<CheckResult>;
export declare function getOpenCodeCheckDefinition(): CheckDefinition;
