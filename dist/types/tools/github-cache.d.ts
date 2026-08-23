/**
 * SQLite-backed cache for rendered `github` issue/PR view output, plus a
 * generic cache-aware wrapper that the tool ops and the `issue://`/`pr://`
 * protocol handlers share.
 *
 * Storage:
 *   One process-wide connection opens lazily on first hit and stays open. All
 *   helpers swallow open/IO failures and degrade to "no cache" so a corrupt or
 *   unreadable DB never blocks a `gh` call.
 *
 *   Soft TTL → return cached row directly.
 *   Stateful issue/PR rows past soft TTL but within hard TTL → refresh
 *     synchronously, falling back to the cached row if the live fetch fails.
 *   Expensive PR diff rows past soft TTL but within hard TTL → return cached
 *     row AND schedule a background refresh (errors logged, never thrown).
 *   Past hard TTL → treat as miss and fetch fresh.
 */
import { Database } from "bun:sqlite";
import type { Settings } from "../config/settings.js";
export type CacheKind = "issue" | "pr" | "pr-diff";
export interface CachedView<T = unknown> {
    authKey: string;
    repo: string;
    kind: CacheKind;
    number: number;
    includeComments: boolean;
    fetchedAt: number;
    payload: T;
    rendered: string;
    sourceUrl: string | undefined;
}
export declare function openDb(): Database | null;
/**
 * Best-effort local fingerprint for the active GitHub CLI credentials.
 *
 * Cache hits must not cross account/token boundaries, but doing a `gh api user`
 * probe before every cached read would defeat the soft-TTL contract that cache
 * hits avoid a gh round-trip. Instead, key rows by credential material that the
 * GitHub CLI itself consumes: token environment variables and/or hosts.yml.
 * The DB stores only a hash, never the token or hosts.yml contents. If no
 * credential source is visible, callers should pass `null` to bypass caching.
 */
export declare function resolveGithubCacheAuthKey(host?: string): string | undefined;
export declare function getCached<T = unknown>(repo: string, kind: CacheKind, number: number, includeComments: boolean, authKey?: string): CachedView<T> | null;
export interface PutCachedInput<T = unknown> {
    authKey?: string;
    repo: string;
    kind: CacheKind;
    number: number;
    includeComments: boolean;
    payload: T;
    rendered: string;
    sourceUrl?: string;
    fetchedAt?: number;
}
export declare function putCached<T = unknown>(input: PutCachedInput<T>): void;
/** Drop a specific cache entry. */
export declare function invalidate(repo: string, kind: CacheKind, number: number, includeComments?: boolean, authKey?: string): void;
/**
 * Drop every cached row for a given issue/PR number, regardless of repo,
 * auth key, include_comments flag, or row kind ({@link CacheKind}). Best-effort:
 * swallows DB failures the same way {@link invalidate} does.
 *
 * Used by the bash-side detector that reacts to `gh issue close` / `gh pr merge`
 * style mutations. Repo + auth-key narrowing is intentionally skipped because
 * the bash command often does not name the repo (defaults to cwd's `gh`
 * config) and resolving the *current* repo from `cwd` for every bash call would
 * be far more expensive than a write-amplified DELETE.
 */
export declare function invalidateAllForNumber(number: number, repo?: string): void;
/** Drop every cached row. Test helper. */
export declare function clearAll(): void;
/**
 * Drop every cached row for a repo, or all rows when the repo is unknown.
 * Fallback for current-branch `gh pr merge`/`gh pr close`-style mutations
 * where the bash command names no PR number or URL, so the target row cannot
 * be identified. Over-invalidation is deliberate (see module header).
 */
export declare function invalidateAllForRepo(repo?: string): void;
/**
 * Test/maintenance helper. Closes and forgets the cached connection so the
 * next access reopens against (possibly) a different DB path.
 */
export declare function resetForTests(): void;
export interface FreshResult<T> {
    rendered: string;
    sourceUrl: string | undefined;
    payload: T;
}
export interface CacheLookupOptions<T> {
    repo: string;
    kind: CacheKind;
    number: number;
    includeComments: boolean;
    /**
     * Auth/credential namespace for cache rows. Omit only in storage-layer
     * tests; pass `null` when production code cannot determine an identity and
     * must bypass persistent cache reads/writes.
     */
    authKey?: string | null;
    fetchFresh: () => Promise<FreshResult<T>>;
    settings?: Settings | undefined;
    now?: number;
}
export type CacheStatus = "miss" | "fresh" | "refreshed" | "stale" | "disabled";
export interface CacheLookupResult<T> {
    rendered: string;
    sourceUrl: string | undefined;
    payload: T;
    status: CacheStatus;
    fetchedAt: number;
}
export interface CacheTtl {
    softMs: number;
    hardMs: number;
    enabled: boolean;
}
export declare function resolveCacheTtl(settings?: Settings): CacheTtl;
export declare function getOrFetchView<T>(options: CacheLookupOptions<T>): Promise<CacheLookupResult<T>>;
/**
 * Human-friendly freshness note for protocol-handler `notes[]` rendering.
 */
export declare function formatFreshnessNote(status: CacheStatus, fetchedAtMs: number, now?: number): string;
