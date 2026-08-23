/**
 * One advisor declared in a `WATCHDOG.yml` file. `model` is a model selector
 * with an optional `:level` thinking suffix (e.g. `x-ai/grok-code-fast:high`),
 * resolved exactly like any other model override; `tools` is a subset of
 * `BUILTIN_TOOL_NAMES` — any built-in name, including mutating tools such as
 * `edit`/`write`/`bash` (the advisor is a full agent). Omitted falls back to
 * the default `read`/`grep`/`glob` subset; an explicit empty list grants no
 * tools. `instructions` is the advisor's specialization, appended to the shared
 * baseline.
 */
export interface AdvisorConfig {
    name: string;
    model?: string;
    tools?: string[];
    instructions?: string;
    /** Per-advisor on/off toggle (default `true`). When `false`, the advisor
     *  stays in the roster but its runtime is never built — it shows `○` in
     *  the status line and `/advisor status` rather than disappearing. */
    enabled?: boolean;
}
/**
 * Runtime health of a single advisor, surfaced in stats and the status line.
 * - `running` — actively processing primary turns
 * - `paused` — user-toggled off via per-advisor switch (runtime disposed)
 * - `quota_exhausted` — provider returned a quota/rate-limit error; the
 *   runtime auto-retries after a cooldown so it can resume without user action
 * - `error` — repeated transient failures; backlog dropped to prevent stall
 * - `no_model` — no model resolved for this advisor's role/explicit model
 */
export type AdvisorRuntimeStatus = "running" | "paused" | "quota_exhausted" | "error" | "no_model";
/**
 * The result of walking the `WATCHDOG.yml`/`WATCHDOG.yaml` search path: the
 * deduped advisor roster plus the concatenated top-level `instructions` baseline
 * that is prepended (alongside `WATCHDOG.md`) to every advisor.
 */
export interface DiscoveredAdvisors {
    advisors: AdvisorConfig[];
    sharedInstructions: string | undefined;
}
/**
 * Normalize an advisor name into a filesystem-/id-safe slug used for its
 * transcript filename and session id: lowercase, non-alphanumerics collapsed to
 * `-`, leading/trailing `-` trimmed. Falls back to `"advisor"` when nothing
 * survives; callers dedupe collisions.
 */
export declare function slugifyAdvisorName(name: string): string;
/**
 * Returns a stable provider-facing UUIDv7 for one advisor within one primary session.
 *
 * Codex treats `session_id`/`conversation_id` as a UUID-shaped routing identity,
 * so advisor labels such as `-advisor` stay local-only.
 */
export declare function getOrCreateAdvisorProviderSessionId(ids: Map<string, string>, primarySessionId: string | undefined, slug: string, randomSessionId?: () => string): string | undefined;
/**
 * Discover advisor configs from `WATCHDOG.yml`/`WATCHDOG.yaml` files on the same
 * user + project search path as `WATCHDOG.md`. Advisors are keyed by slug; a
 * more-specific file (project leaf > project ancestor > user) replaces an earlier
 * entry with the same slug. Top-level `instructions` across all files concatenate
 * into the shared baseline. A malformed file is logged and skipped — never
 * thrown — so a bad project config can't kill the session.
 */
export declare function discoverAdvisorConfigs(cwd: string, agentDir?: string): Promise<DiscoveredAdvisors>;
/** Which level a `WATCHDOG.yml` lives at: the project root or the user agent dir. */
export type AdvisorConfigScope = "project" | "user";
/**
 * The editable contents of a single `WATCHDOG.yml` file: the shared top-level
 * `instructions` plus the advisor roster. Unlike {@link DiscoveredAdvisors}, this
 * is one file's raw view (no cross-level merge, no `@import` expansion) so the
 * config editor round-trips exactly what the user wrote.
 */
export interface WatchdogConfigDoc {
    instructions?: string;
    advisors: AdvisorConfig[];
}
/**
 * Resolve the `WATCHDOG.yml` path for a scope: `project` → `<projectDir>/WATCHDOG.yml`
 * (discovered by the project-level walk), `user` → `<agentDir>/WATCHDOG.yml` (the
 * user-level candidate).
 */
export declare function advisorConfigFilePath(scope: AdvisorConfigScope, dirs: {
    projectDir: string;
    agentDir: string;
}): string;
/**
 * Resolve which `WATCHDOG.{yml,yaml}` to edit for a scope: prefer the canonical
 * `.yml`, but when only a `.yaml` exists for that scope, edit it in place so an
 * existing `.yaml` user isn't shown a blank editor and left with two files at the
 * same precedence. Falls back to `.yml` when neither exists.
 */
export declare function resolveAdvisorConfigEditPath(scope: AdvisorConfigScope, dirs: {
    projectDir: string;
    agentDir: string;
}): Promise<string>;
/**
 * Load one `WATCHDOG.yml` file for editing — raw, un-merged, un-expanded. Missing,
 * unparseable, or schema-invalid files yield an empty doc (never throws) so the
 * editor opens cleanly on a fresh or broken file.
 */
export declare function loadWatchdogConfigFile(filePath: string): Promise<WatchdogConfigDoc>;
export declare function serializeWatchdogConfig(doc: WatchdogConfigDoc): string;
/**
 * Write an editable doc to `WATCHDOG.yml`. An empty doc removes the file so
 * discovery falls back to the legacy single-advisor path rather than leaving an
 * empty config behind.
 */
export declare function saveWatchdogConfigFile(filePath: string, doc: WatchdogConfigDoc): Promise<void>;
