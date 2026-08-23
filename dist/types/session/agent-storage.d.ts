import { type AuthCredential, type AuthCredentialStore, type StoredAuthCredential } from "@oh-my-pi/pi-ai";
import type { RawSettings as Settings } from "../config/settings.js";
/** One completed request's timing, folded into the per-model aggregates. */
export interface ModelPerfSample {
    /** Output tokens the provider reported for the turn. */
    outputTokens: number;
    /** Total request duration in milliseconds. */
    durationMs: number;
    /** Time to first token in milliseconds; omit when the provider did not report one. */
    ttftMs?: number;
}
/** Recency-weighted per-model performance averages. */
export interface ModelPerfStats {
    /** Decayed sample count backing the averages. */
    samples: number;
    /** Average output tokens/sec over the total request duration. */
    tps: number;
    /** Average time-to-first-token in milliseconds; null when no sample reported one. */
    ttftMs: number | null;
}
/** Current agent.db schema version; bump when schema changes require migration. */
export declare const SCHEMA_VERSION = 6;
/**
 * Unified SQLite storage for agent settings, model usage, and auth credentials.
 * Delegates auth credential operations to AuthCredentialStore from @oh-my-pi/pi-ai.
 * Uses singleton pattern per database path; access via AgentStorage.open().
 */
export declare class AgentStorage {
    #private;
    private constructor();
    /**
     * Returns singleton instance for the given database path, creating if needed.
     * Retries on the `SQLITE_BUSY` family (including `SQLITE_BUSY_RECOVERY`) with
     * exponential backoff. See issue #2421.
     * @param dbPath - Path to the SQLite database file (defaults to config path)
     * @returns AgentStorage instance for the given path
     */
    static open(dbPath?: string): Promise<AgentStorage>;
    /** @internal Reset all singletons and close their databases — test-only. */
    static resetInstance(): void;
    /**
     * Reads legacy settings persisted in the agent.db `settings` table.
     * The canonical settings store is `config.yml`; this accessor only
     * exists so the config loader can migrate values from older installs.
     * @returns Settings object, or null if no settings are stored
     */
    getSettings(): Settings | null;
    /**
     * Records model usage, updating the last-used timestamp.
     * @param modelKey - Model key in "provider/modelId" format
     */
    recordModelUsage(modelKey: string): void;
    /**
     * Gets model keys ordered by most recently used.
     * Results are cached until recordModelUsage is called.
     * @returns Array of model keys ("provider/modelId") in MRU order
     */
    getModelUsageOrder(): string[];
    /**
     * Records one slash-command invocation, bumping its usage count and
     * last-used timestamp. Frequency-ranked autocomplete reads these counts.
     * @param name - Canonical command name (e.g. "model", "skill:review")
     */
    recordCommandUsage(name: string): void;
    /**
     * Gets slash-command usage counts keyed by canonical command name.
     * @returns Command name → invocation count
     */
    listCommandUsage(): Record<string, number>;
    /**
     * Folds one completed request's timing into the model's perf aggregates.
     * TPS is measured over the total request duration — not the post-TTFT
     * decode window, which undercounts generation time (and so inflates the
     * rate) when reasoning tokens are generated before the first visible
     * token. Invalid samples (no tokens, no duration) are dropped.
     *
     * Deferred like prompt history: samples are batched and written in one
     * transaction after {@link MODEL_PERF_FLUSH_DELAY_MS}, keeping SQLite off
     * the turn-completion hot path. Fire-and-forget safe — flush failures are
     * logged, never thrown; await the returned promise only to observe the flush.
     * @param modelKey - Model key in "provider/modelId" format
     */
    recordModelPerf(modelKey: string, sample: ModelPerfSample): Promise<void>;
    /**
     * Returns recency-weighted TPS/TTFT averages for every model with recorded
     * requests, keyed by "provider/modelId". Read by the /models browser.
     * Also kicks the one-time background stats.db import; until it completes,
     * models without live samples are simply absent.
     */
    getModelPerf(): Map<string, ModelPerfStats>;
    /**
     * Imports recent measurable request rows from an `omp stats` database
     * (`messages` table) into the model_perf aggregates. Walks newest-first
     * over the timestamp index in {@link MODEL_PERF_BACKFILL_CHUNK}-row chunks,
     * yielding to the event loop between chunks, and keeps at most
     * {@link MODEL_PERF_DECAY_AT} rows per model within the
     * {@link MODEL_PERF_BACKFILL_MAX_AGE_MS} window — beyond either bound the
     * live decay would erase the contribution anyway. Errored turns are
     * excluded; aborted turns with reported usage count, matching live capture.
     * Sums land in one additive transaction at the end, so concurrent live
     * samples merge correctly regardless of order.
     * @param statsDbPath - Path to a stats.db file; opened read-only
     * @returns Number of rows folded in
     * @throws When the stats db cannot be opened or queried
     */
    backfillModelPerfFromStats(statsDbPath: string): Promise<number>;
    /**
     * Checks if any auth credentials exist in storage.
     * @returns True if at least one credential is stored
     */
    hasAuthCredentials(): boolean;
    /**
     * Returns the underlying {@link AuthCredentialStore} so callers that need
     * the lower-level pi-ai abstraction (e.g. `findAnthropicAuth(store)`) can
     * reuse this storage's open database connection instead of opening their
     * own.
     */
    get authStore(): AuthCredentialStore;
    /**
     * Lists auth credentials, optionally filtered by provider.
     * Only returns active (non-disabled) credentials by default.
     * @param provider - Optional provider name to filter by
     * @param includeDisabled - If true, includes disabled credentials
     * @returns Array of stored credentials with their database IDs
     */
    listAuthCredentials(provider?: string, includeDisabled?: boolean): StoredAuthCredential[];
    /**
     * Atomically replaces all credentials for a provider.
     * Useful for OAuth token refresh where old tokens should be discarded.
     * @param provider - Provider name (e.g., "anthropic", "openai")
     * @param credentials - New credentials to store
     * @returns Array of newly stored credentials with their database IDs
     */
    replaceAuthCredentialsForProvider(provider: string, credentials: AuthCredential[]): StoredAuthCredential[];
    /**
     * Updates an existing auth credential by ID.
     * @param id - Database row ID of the credential to update
     * @param credential - New credential data
     */
    updateAuthCredential(id: number, credential: AuthCredential): void;
    /**
     * Disables an auth credential by ID with a persisted cause.
     * @param id - Database row ID of the credential to disable
     * @param disabledCause - Human-readable cause stored with the disabled row
     */
    deleteAuthCredential(id: number, disabledCause: string): void;
    /**
     * Disables all auth credentials for a provider with a persisted cause.
     * @param provider - Provider name whose credentials should be disabled
     * @param disabledCause - Human-readable cause stored with the disabled rows
     */
    deleteAuthCredentialsForProvider(provider: string, disabledCause: string): void;
    /**
     * Gets a cached value by key. Returns null if not found or expired.
     */
    getCache(key: string): string | null;
    /**
     * Sets a cached value with expiry time (unix seconds).
     */
    setCache(key: string, value: string, expiresAtSec: number): void;
    /**
     * Deletes expired cache entries. Call periodically for cleanup.
     */
    cleanExpiredCache(): void;
}
