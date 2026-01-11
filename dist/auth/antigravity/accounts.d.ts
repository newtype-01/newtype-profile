import { type AccountStorage, type AccountTier, type AntigravityRefreshParts, type ModelFamily, type RateLimitState } from "./types";
export interface ManagedAccount {
    index: number;
    parts: AntigravityRefreshParts;
    access?: string;
    expires?: number;
    rateLimits: RateLimitState;
    lastUsed: number;
    email?: string;
    tier?: AccountTier;
}
interface AuthDetails {
    refresh: string;
    access: string;
    expires: number;
}
interface OAuthAuthDetails {
    type: "oauth";
    refresh: string;
    access: string;
    expires: number;
}
export declare class AccountManager {
    private accounts;
    private currentIndex;
    private activeIndex;
    constructor(auth: AuthDetails, storedAccounts?: AccountStorage | null);
    getAccountCount(): number;
    getCurrentAccount(): ManagedAccount | null;
    getAccounts(): ManagedAccount[];
    getCurrentOrNextForFamily(family: ModelFamily): ManagedAccount | null;
    getNextForFamily(family: ModelFamily): ManagedAccount | null;
    markRateLimited(account: ManagedAccount, retryAfterMs: number, family: ModelFamily): void;
    clearExpiredRateLimits(account: ManagedAccount): void;
    addAccount(parts: AntigravityRefreshParts, access?: string, expires?: number, email?: string, tier?: AccountTier): void;
    removeAccount(index: number): boolean;
    save(path?: string): Promise<void>;
    toAuthDetails(): OAuthAuthDetails;
}
export {};
