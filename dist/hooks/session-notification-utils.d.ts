type Platform = "darwin" | "linux" | "win32" | "unsupported";
export declare function getNotifySendPath(): Promise<string | null>;
export declare function getOsascriptPath(): Promise<string | null>;
export declare function getPowershellPath(): Promise<string | null>;
export declare function getAfplayPath(): Promise<string | null>;
export declare function getPaplayPath(): Promise<string | null>;
export declare function getAplayPath(): Promise<string | null>;
export declare function startBackgroundCheck(platform: Platform): void;
export {};
