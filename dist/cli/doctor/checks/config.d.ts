import type { CheckResult, CheckDefinition, ConfigInfo } from "../types";
export declare function validateConfig(configPath: string): {
    valid: boolean;
    errors: string[];
};
export declare function getConfigInfo(): ConfigInfo;
export declare function checkConfigValidity(): Promise<CheckResult>;
export declare function getConfigCheckDefinition(): CheckDefinition;
