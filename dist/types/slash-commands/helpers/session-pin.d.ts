import type { OAuthAccountSummary } from "../../session/auth-storage.js";
/** Stored OAuth account rendered and matched by `/session pin`. */
export interface SessionPinAccount extends OAuthAccountSummary {
    label: string;
}
/** Add stable user-facing labels to provider account summaries. */
export declare function toSessionPinAccounts(accounts: readonly OAuthAccountSummary[]): SessionPinAccount[];
/** Match a `/session pin` selector by 1-based position or exact account identity. */
export declare function matchSessionPinAccounts(accounts: readonly SessionPinAccount[], selector: string): SessionPinAccount[];
