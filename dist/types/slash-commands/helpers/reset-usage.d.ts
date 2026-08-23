/**
 * Shared helpers for the `/usage reset` command (TUI selector + ACP): turn the
 * live per-account reset-credit status into selector rows, and map a redeem
 * outcome code to a human message.
 */
import type { ResetCreditAccountStatus, ResetCreditRedeemOutcome, ResetCreditTarget } from "../../session/auth-storage.js";
export declare const CODEX_PROVIDER_ID = "openai-codex";
/** One Codex account row for the reset-usage selector. */
export interface ResetUsageAccount {
    /** Display label (email, else account id). */
    label: string;
    /** Saved resets redeemable for this account right now. */
    availableCount: number;
    /** Identifies the account when redeeming. */
    target: ResetCreditTarget;
    /** Whether this is the session's active Codex account. */
    active: boolean;
    /** Set when this account could not be reached (token/list failure). */
    error?: string;
}
/**
 * Map live per-account reset status to selector rows. Sorted with the active
 * account first, then most-credits, then label.
 */
export declare function toResetUsageAccounts(statuses: ResetCreditAccountStatus[]): ResetUsageAccount[];
/** Human-facing summary of a redeem outcome for status lines and ACP output. */
export declare function describeRedeemOutcome(outcome: ResetCreditRedeemOutcome, label: string): string;
