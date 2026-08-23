/**
 * Usage CLI command handler.
 *
 * Handles `omp usage` — fetches provider usage reports for every
 * authenticated account and prints a detailed per-account breakdown
 * (limits, windows, reset times, plan metadata). Accounts whose
 * credentials produced no usage report are listed too, so the output
 * always covers the full credential pool.
 */
import { type DisabledCredentialSummary, type UsageHistoryEntry, type UsageReport } from "@oh-my-pi/pi-ai";
export interface UsageCommandArgs {
    action?: string;
    json?: boolean;
    provider?: string;
    redact?: boolean;
    /** Show recorded usage-limit history instead of a live snapshot. */
    history?: boolean;
    /** History window in days (with `history`). */
    days?: number;
}
/** Identity slice of a stored credential, for "every account" coverage. */
export interface UsageAccountIdentity {
    provider: string;
    type: "api_key" | "oauth";
    email?: string;
    accountId?: string;
    projectId?: string;
    enterpriseUrl?: string;
    /** Organization/workspace the credential is scoped to (Anthropic multi-subscription). */
    orgId?: string;
    orgName?: string;
    /** Epoch ms of the interactive login that minted the OAuth grant (see `OAuthCredentials.authorizedAt`). */
    authorizedAt?: number;
}
/**
 * Minimal-reveal masks for identity strings (`--redact`).
 *
 * Every mask shows a two-character anchor. When two identities share the
 * anchor, the mask additionally reveals the shortest "middle-out"
 * differentiator — the shortest substring (closest to the string's middle on
 * ties) that no colliding identity contains — as `an*`, `ca*9*`, `ca*nb*`.
 * Prefix growth is deliberately avoided: it leaks the start of the local
 * part (`can.boluk@*`) when a couple of mid-string characters suffice.
 * Duplicate strings (same account on two providers) share a mask.
 */
export declare function buildRedactionMap(values: Iterable<string>): Map<string, string>;
/**
 * Stored credentials that no usage report could be attributed to.
 *
 * Conservative on purpose: when a provider's reports carry no identity at
 * all (or the credential is an API key alongside existing reports), we
 * can't attribute, so we don't claim the account is missing.
 */
export declare function collectUnreportedAccounts(reports: UsageReport[], accounts: UsageAccountIdentity[]): UsageAccountIdentity[];
/** Per-window capacity stat: how much account quota is burned and left. */
export interface ProviderWindowStat {
    /** Compact window label, e.g. "5h", "7d". */
    window: string;
    durationMs?: number;
    /** Accounts reporting a limit in this window. */
    accounts: number;
    /** Sum of each account's binding used fraction — accounts' worth of quota burned. */
    usedAccounts: number;
    /** Accounts' worth of quota still available across reporting accounts. */
    remainingAccounts: number;
}
/**
 * Aggregate one provider's reports into per-window quota capacity stats.
 *
 * Limits are bucketed by window duration (5h, 7d, ...). Within a bucket each
 * account contributes its single highest used fraction — when an account has
 * several meters on the same window (tiered/metered limits), the most-burned
 * one is what binds.
 */
export declare function computeProviderWindowStats(reports: UsageReport[]): ProviderWindowStat[];
/**
 * Render the full text breakdown: per provider, per account, every limit
 * with a bar, amounts, and reset times; unattributed credentials trail
 * each provider section as "no usage data" rows.
 */
export declare function formatUsageBreakdown(reports: UsageReport[], accounts: UsageAccountIdentity[], nowMs: number, redaction?: Map<string, string>, disabled?: DisabledCredentialSummary[]): string;
/**
 * Render recorded usage-limit history: per provider, per account, one
 * peak-per-bucket sparkline per limit window plus latest/peak percentages.
 */
export declare function formatUsageHistory(entries: UsageHistoryEntry[], sinceMs: number, nowMs: number, redaction?: Map<string, string>): string;
/**
 * Keep only accounts worth a usage row: those whose provider has a usage
 * provider, so a missing report is a real gap rather than the absence of any
 * usage concept. Providers with no usage endpoint (web-search keys, local /
 * keyless servers, inference providers without a usage API) would only ever
 * render as noise, so they are dropped.
 *
 * `hasUsageProvider` is injected (in practice {@link AuthStorage.usageProviderFor})
 * so custom/broker resolvers stay authoritative — no provider list is duplicated
 * here. An explicit `--provider` request bypasses the cull, so
 * `omp usage --provider xai` can still confirm the stored credential has no
 * usage endpoint.
 */
export declare function selectReportableAccounts(accounts: UsageAccountIdentity[], hasUsageProvider: (provider: string) => boolean, explicitProvider?: string): UsageAccountIdentity[];
export declare function runUsageCommand(cmd: UsageCommandArgs): Promise<void>;
