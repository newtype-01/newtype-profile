import type { CheckResult, CheckDefinition, LspServerInfo } from "../types";
export declare function getLspServersInfo(): Promise<LspServerInfo[]>;
export declare function getLspServerStats(servers: LspServerInfo[]): {
    installed: number;
    total: number;
};
export declare function checkLspServers(): Promise<CheckResult>;
export declare function getLspCheckDefinition(): CheckDefinition;
