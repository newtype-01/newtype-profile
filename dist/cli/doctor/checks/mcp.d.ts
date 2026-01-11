import type { CheckResult, CheckDefinition, McpServerInfo } from "../types";
export declare function getBuiltinMcpInfo(): McpServerInfo[];
export declare function getUserMcpInfo(): McpServerInfo[];
export declare function checkBuiltinMcpServers(): Promise<CheckResult>;
export declare function checkUserMcpServers(): Promise<CheckResult>;
export declare function getMcpCheckDefinitions(): CheckDefinition[];
