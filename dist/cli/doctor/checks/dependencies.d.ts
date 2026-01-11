import type { CheckResult, CheckDefinition, DependencyInfo } from "../types";
export declare function checkAstGrepCli(): Promise<DependencyInfo>;
export declare function checkAstGrepNapi(): DependencyInfo;
export declare function checkCommentChecker(): Promise<DependencyInfo>;
export declare function checkDependencyAstGrepCli(): Promise<CheckResult>;
export declare function checkDependencyAstGrepNapi(): Promise<CheckResult>;
export declare function checkDependencyCommentChecker(): Promise<CheckResult>;
export declare function getDependencyCheckDefinitions(): CheckDefinition[];
