/**
 * Pool-wide planner for spending saved OpenAI Codex rate-limit resets, plus
 * the process-wide coordinator that serializes attempts.
 *
 * A saved reset is a scarce, ~monthly credit — but it is also perishable:
 * every credit carries an `expiresAt`, and an expired credit is worth exactly
 * nothing. The planner therefore balances two failure modes instead of only
 * one: wasting a credit on a window that would have healed anyway, and letting
 * a credit die unspent. Two rules, evaluated over EVERY stored Codex account
 * (not just the session's active one):
 *
 * - `expiring-credit` (salvage; any trigger): the account's soonest available
 *   credit expires within `salvageHorizonMs` and the weekly window is at least
 *   {@link SALVAGE_MIN_USED_FRACTION} used, so redeeming restores real quota.
 *   The `keepCredits` reserve is deliberately ignored here — reserving a
 *   credit that is about to expire preserves nothing. If the window resets
 *   naturally before the credit expires, the next sweep sees a mostly-free
 *   window and skips: the credit had nothing left to restore. The backend may
 *   refuse a partial-usage consume with `nothing_to_reset`; that outcome is
 *   NON-terminal — the episode is deferred (not buried), so the credit is
 *   retried as usage grows or a window exhausts before expiry.
 * - `blocked-account` (restore; `blocked` trigger only): a live 429 blocked
 *   the turn and no sibling credential could take over, so the pool is dry.
 *   Candidates are accounts with at least one genuinely exhausted chat window
 *   — 5h primary or weekly secondary. A banked reset clears the account's
 *   chat rate limits generally, not just the weekly window: OpenAI's own
 *   client consumes one for a 5h-only block while the weekly window still has
 *   ~80% headroom (openai/codex#28525). The natural unblock is the LATEST
 *   reset among the exhausted windows (the account stays blocked until every
 *   one rolls over) and must be far enough away to justify the spend, with
 *   credits above the reserve. One candidate is redeemed — active account
 *   first, then the account whose credit dies soonest — and the redeem clears
 *   its credential blocks so the retry's re-rank picks it up.
 *
 * TRIGGERS: `blocked` runs from the usage-limit branch of the retry pipeline
 * after sibling switch fails, on force-refreshed reports (the cached snapshot
 * predates the 429 that got us there). `sweep` piggybacks on every successful
 * usage-report fetch — the status line polls every 5 minutes while the TUI is
 * open — so expiring credits are caught even when nothing is blocked.
 *
 * THE DECISION-2 TRAP (status MUST NOT be used to find the blocker):
 * `openai-codex.ts` applies the top-level `rate_limit.limit_reached` flag to
 * BOTH the primary (5h) and secondary (weekly) `buildUsageLimit` calls, so when
 * an account is blocked, *both* limit entries carry `status: "exhausted"`
 * regardless of which window is actually at 100%. Only `amount.usedFraction`
 * disambiguates. This module keys eligibility off exact limit ids
 * (`openai-codex:primary` / `openai-codex:secondary`) and `usedFraction`,
 * never off `status`, so the plan names the true blocking window(s) and their
 * real unblock time. Whether a short wait (e.g. a 5h-only block) is worth a
 * credit is the `minBlockedMinutes` knob's call, not hardcoded fiat.
 *
 * All of this is pure — no fetches, no IO. The only stateful piece is the
 * {@link CodexAutoRedeemCoordinator} container, whose read-only views are
 * passed in so the planner itself stays deterministic.
 */
import type { OAuthAccountIdentity, ResetCreditAccountStatus, ResetCreditTarget, UsageReport } from "@oh-my-pi/pi-ai";
import type { CodexAutoRedeemMode } from "../config/settings-schema.js";
/** A chat window counts as exhausted at `usedFraction >= 0.999` (used_percent >= 99.9). */
export declare const WINDOW_EXHAUSTED_MIN_FRACTION = 0.999;
/** A weekly reset can never be more than one window length (7d) away; +1h slack for skew. */
export declare const MAX_PLAUSIBLE_WEEKLY_REMAINING_MS: number;
/** A 5h reset can never be more than one window length (5h) away; +1h slack for skew. */
export declare const MAX_PLAUSIBLE_PRIMARY_REMAINING_MS: number;
/** Below this usage on BOTH chat windows a salvaged reset restores too little to bother (and risks a `nothing_to_reset` no-op). */
export declare const SALVAGE_MIN_USED_FRACTION = 0.25;
/** Retry spacing after a non-terminal consume outcome (`nothing_to_reset`, transport failure). */
export declare const REDEEM_RETRY_DEFER_MS: number;
/** Report must be no older than the 5-min usage cache TTL plus slack. */
export declare const REPORT_FRESHNESS_MS: number;
/** Per-account cooldown that catches attempt-key drift across a minute boundary. */
export declare const ATTEMPT_COOLDOWN_MS = 60000;
/** Minute bucket for attempt keys, absorbing `reset_after_seconds`/expiry jitter. */
export declare const DEBOUNCE_BUCKET_MS = 60000;
/** Floor between salvage sweeps; dedupe keys make sweeps idempotent, this just avoids useless re-planning. */
export declare const SWEEP_MIN_INTERVAL_MS = 60000;
export declare function shouldEvaluateCodexAutoRedeem(mode: CodexAutoRedeemMode): boolean;
export declare function shouldPromptCodexAutoRedeem(mode: CodexAutoRedeemMode): boolean;
/** What woke the planner. `sweep` may only salvage; `blocked` may also restore. */
export type CodexResetTrigger = "blocked" | "sweep";
/** Why one account produced no action (or, with `accountKey: "*"`, a whole rule was off). */
export type CodexResetSkipReason = "disabled" | "wrong-provider" | "spark-model" | "no-identity" | "stale-report" | "not-limit-reached" | "no-exhausted-window" | "deferred" | "no-reset-time" | "reset-too-soon" | "reset-implausible" | "credits-unknown" | "no-credits" | "reserve" | "no-expiring-credit" | "window-mostly-free" | "already-attempted" | "cooldown";
export interface CodexResetPlanInput {
    nowMs: number;
    trigger: CodexResetTrigger;
    /** `this.model.provider` — gates the `blocked-account` rule only. */
    provider: string;
    /** `this.model.id` — gates the `blocked-account` rule only. */
    modelId: string;
    settings: {
        enabled: boolean;
        /** `blocked-account`: skip when the natural unblock is closer than this. */
        minBlockedMinutes: number;
        /** `blocked-account`: never spend below this many remaining credits. */
        keepCredits: number;
        /** `expiring-credit`: salvage window; `<= 0` disables the rule. */
        salvageHorizonMs: number;
    };
    /** Active account (marks the preferred restore candidate); may be undefined. */
    identity: OAuthAccountIdentity | undefined;
    /** Usage reports for ALL stored accounts (one per account for Codex). */
    reports: UsageReport[] | null;
    attemptedKeys: ReadonlySet<string>;
    /** Episodes parked by a non-terminal consume outcome, keyed by attempt key (epoch ms). */
    deferredUntilByKey: ReadonlyMap<string, number>;
    lastAttemptAtByAccount: ReadonlyMap<string, number>;
    /**
     * Live 429 evidence for the ACTIVE account: absolute epoch ms when the
     * provider said the account unblocks, derived from the usage-limit error's
     * parsed retry hint AT THE ERROR (absolute, so slow usage IO between the
     * error and planning cannot drift it). Authoritative when the usage report
     * is stale or missing — the report layer can adopt a pre-block in-flight
     * fetch or serve the last-good snapshot when `/wham/usage` fails (it is
     * IP-throttled, so failure right after a 429 is common), and such a
     * snapshot still shows `limitReached: false` with healthy windows. With no
     * usable report at all, a candidate is synthesized from `identity` and the
     * redeem re-checks credits live. Only used on `blocked`.
     */
    activeBlockUnblockAtMs?: number;
}
/** One credit to spend. `redeemResetCredit` picks the account's soonest-expiring credit. */
export interface CodexResetAction {
    reason: "blocked-account" | "expiring-credit";
    target: ResetCreditTarget;
    accountKey: string;
    /** Once-per-episode dedupe key; record in `attemptedKeys` BEFORE consuming. */
    attemptKey: string;
    /** Human label for notices/prompts (email preferred). */
    label: string;
    /** Redeemable credits per the report; undefined for a synthesized live-429 candidate. */
    availableCount?: number;
    weeklyUsedFraction?: number;
    /** `blocked-account`: ms until the natural unblock (latest exhausted-window reset). */
    remainingMs?: number;
    /** `blocked-account`: the exhausted chat windows a redeem would clear. */
    blockedWindows?: ("5h" | "weekly")[];
    /** `expiring-credit`: the fuller chat window a redeem restores (for messaging). */
    salvageWindow?: "5h" | "weekly";
    /** `expiring-credit`: used fraction of {@link CodexResetAction.salvageWindow}. */
    salvageUsedFraction?: number;
    /** `expiring-credit`: ms until the credit expires. */
    expiresInMs?: number;
    /** True when this is the session's active account. */
    active: boolean;
}
export interface CodexResetSkip {
    /** Normalized account key, or `"*"` for a rule-wide gate. */
    accountKey: string;
    rule: "blocked-account" | "expiring-credit" | "account";
    reason: CodexResetSkipReason;
}
export interface CodexResetPlan {
    /** At most one `blocked-account` action (first), then salvages by soonest expiry. */
    actions: CodexResetAction[];
    /** Diagnostics for `logger.debug` and tests. */
    skipped: CodexResetSkip[];
}
/**
 * Plan which saved Codex resets to spend right now. Pure: a function of the
 * snapshot inputs only. Callers execute the returned actions in order,
 * re-checking `attemptedKeys` immediately before each consume.
 */
export declare function planCodexResetRedemptions(input: CodexResetPlanInput): CodexResetPlan;
/** One attempt per (account, weekly-reset-minute) block episode. */
export declare function blockedAttemptKey(accountKey: string, weeklyResetsAtMs: number): string;
/** One attempt per (account, credit-expiry-minute) salvage episode. */
export declare function salvageAttemptKey(accountKey: string, creditExpiresAtMs: number): string;
/**
 * Overlay LIVE per-account credit state (from the dedicated
 * `rate-limit-reset-credits` route) onto usage reports before a blocked pass.
 *
 * `/wham/usage` credit counts can be stale or pre-feature, and the usage
 * provider only consults the live detail endpoint when the usage payload
 * already reports a POSITIVE count — a stale ZERO is never corrected there.
 * Live data therefore replaces the report's credit block wholesale; accounts
 * with no live row (or a failed lookup) get the block stripped, so the planner
 * treats them as `credits-unknown` instead of trusting a stale count: siblings
 * stay conservative while the active account can still be synthesized from
 * live 429 evidence (the redeem re-lists atomically either way).
 */
export declare function overlayLiveResetCredits(reports: UsageReport[] | null, statuses: readonly ResetCreditAccountStatus[]): UsageReport[] | null;
/**
 * Whether a consume outcome permanently settles its episode. Terminal codes
 * either spent the credit (`reset`), or prove this credit can never be spent
 * (`already_redeemed`, `no_credit` — a live listing that really had nothing).
 * Everything else — `nothing_to_reset` (limits not constrained enough right
 * now), `credit_list_failed` (flaky listing), thrown transport failures,
 * unknown codes — leaves the credit banked: the executor releases the attempt
 * key and
 * defers the episode by {@link REDEEM_RETRY_DEFER_MS} instead of burying a
 * live credit for the rest of the process.
 */
export declare function isTerminalRedeemOutcome(code: string): boolean;
/**
 * Process-wide (NOT per-session) coordinator state. Parallel subagent sessions
 * share the same Codex accounts and must not race a double-spend, so this is a
 * single shared container, not a per-session field.
 *
 * - `attemptedKeys`: one attempt per episode key — recorded before calling the
 *   consume so exceptions can't re-enter. Non-terminal outcomes (see
 *   {@link isTerminalRedeemOutcome}) release the key again and park the
 *   episode in `deferredUntilByKey` instead.
 * - `deferredUntilByKey`: earliest retry time for episodes whose consume was
 *   refused non-terminally (`nothing_to_reset`, transport failure).
 * - `lastAttemptAtByAccount`: per-account cooldown timestamps (epoch ms),
 *   catching attempt-key drift across a minute boundary.
 * - `inFlightByAccount`: serializes blocked passes per account — a second
 *   session for the same account adopts the in-flight promise instead of
 *   starting a second consume.
 * - `sweepInFlight` / `lastSweepAt` / `sweepPromise`: re-entrancy guard, floor,
 *   and settlement handle for the salvage sweep (a redeem refreshes usage,
 *   which would recurse into a sweep; the promise lets tests and diagnostics
 *   await a fire-and-forget sweep instead of polling).
 * - `notifiedKeys`: headless "run /usage reset" notices already emitted, so a
 *   5-minute sweep cadence can't spam the transcript.
 */
export interface CodexAutoRedeemCoordinator {
    attemptedKeys: Set<string>;
    deferredUntilByKey: Map<string, number>;
    lastAttemptAtByAccount: Map<string, number>;
    inFlightByAccount: Map<string, Promise<boolean>>;
    sweepInFlight: boolean;
    lastSweepAt: number;
    /** Settlement of the most recently scheduled sweep (never rejects). */
    sweepPromise: Promise<void> | undefined;
    notifiedKeys: Set<string>;
}
/** Fresh, empty coordinator: backs the process-wide default; inject one per test for isolation. */
export declare function createCodexAutoRedeemCoordinator(): CodexAutoRedeemCoordinator;
export declare const defaultCodexAutoRedeemCoordinator: CodexAutoRedeemCoordinator;
