import type { AccountStorage } from "./types";
export declare function getDataDir(): string;
export declare function getStoragePath(): string;
export declare function loadAccounts(path?: string): Promise<AccountStorage | null>;
export declare function saveAccounts(storage: AccountStorage, path?: string): Promise<void>;
