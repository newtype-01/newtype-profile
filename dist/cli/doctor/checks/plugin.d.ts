import type { CheckResult, CheckDefinition, PluginInfo } from "../types";
export declare function getPluginInfo(): PluginInfo;
export declare function checkPluginRegistration(): Promise<CheckResult>;
export declare function getPluginCheckDefinition(): CheckDefinition;
