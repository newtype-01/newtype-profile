import type { CheckResult, CheckDefinition, VersionCheckInfo } from "../types";
export declare function getVersionInfo(): Promise<VersionCheckInfo>;
export declare function checkVersionStatus(): Promise<CheckResult>;
export declare function getVersionCheckDefinition(): CheckDefinition;
