import type { AgentOptions } from "@oh-my-pi/pi-agent-core";
import type { OAuthAccessResolution } from "@oh-my-pi/pi-ai";
import type { AuthStorage } from "../session/auth-storage.js";
import type { SecurityAccountRef } from "./contracts/index.js";
export interface ExactSecurityOAuthOptions {
    authStorage: AuthStorage;
    account: SecurityAccountRef;
}
export declare function assertSecurityIdentityMatches(account: SecurityAccountRef, resolution: {
    credentialId?: number;
    accountId?: string;
    email?: string;
    orgId?: string;
    orgName?: string;
}): void;
export declare function selectSecurityAccount(authStorage: AuthStorage, provider: string, requestedCredentialId?: number, sessionId?: string): SecurityAccountRef;
export declare function resolveExactSecurityOAuthAccess(authStorage: AuthStorage, account: SecurityAccountRef, options: {
    forceRefresh: boolean;
    signal?: AbortSignal;
}): Promise<Extract<OAuthAccessResolution, {
    ok: true;
}>>;
/**
 * Build a request credential resolver pinned to one durable OAuth row.
 *
 * Initial resolution and refresh both target the same row. The auth driver's
 * final sibling-rotation step returns `undefined`, so an unavailable account
 * fails the scan rather than crossing an account/workspace boundary.
 */
export declare function createExactSecurityOAuthResolver(options: ExactSecurityOAuthOptions): NonNullable<AgentOptions["getApiKey"]>;
