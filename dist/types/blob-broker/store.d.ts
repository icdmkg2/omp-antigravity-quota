/**
 * Blob registry shared by the in-process broker and the daemon worker:
 * capability-token entries, lazy producers, a byte-budgeted RAM cache — and,
 * when serving, a persistent disk layer.
 *
 * Persistence keeps two promises at once:
 * - **Resume-stable links.** The key→token index survives restarts in
 *   `~/.omp/agent/blobs/urls-index-<project>.json`, and eager bytes live in
 *   the same content-addressed session blob store conversation images are
 *   already externalized to — so re-decorating a resumed conversation yields
 *   byte-identical URLs without copying anything.
 * - **Limited serving window.** Every entry carries a TTL anchored to its
 *   last registration. An active (or resumed) conversation re-registers its
 *   images each turn, re-arming the window; an abandoned link expires and
 *   serves 410.
 *
 * Lazy entries hold a fetcher instead of bytes — nothing renders until a
 * provider actually GETs the URL, and RAM eviction drops only cached bytes
 * (the fetcher survives, so a later cache-miss refetch re-renders).
 */
import { type BlobBrokerPurgeRequest, type BlobBrokerPurgeResponse, type BlobStoreStatus } from "./protocol.js";
import type { BlobPublication } from "./publication.js";
/** Produces a lazy blob's bytes on demand; `null` when the source is gone. */
export type LazyBlobFetcher = () => Promise<Uint8Array | null>;
/** Disk layer configuration for serving registries. */
export interface BlobPersistence {
    /** Content-addressed session blob store holding (or receiving) eager bytes. */
    blobsDir: string;
    /** Key→token index path; per project scope so sibling daemons never clobber. */
    indexPath: string;
    /** Serving window measured from the last registration; `<= 0` never expires. */
    ttlMs: number;
}
/** Stable store registration returned to a local blob backend. */
export interface BlobRegistryEntry {
    /** Capability path relative to the public serving origin. */
    path: string;
    /** Known blob size, or zero until a lazy producer first resolves. */
    bytes: number;
    /** Durable publication metadata attached by the owning backend. */
    publication?: BlobPublication;
}
interface StoredBlob {
    token: string;
    mimeType: string;
    ext: string;
    /** Raw-bytes SHA-256 — the session blob store address. Eager entries only. */
    sha: string | undefined;
    /** Known byte length, retained even when bytes live only on disk. */
    bytesCount: number;
    lazy: boolean;
    /** TTL anchor: last registration (not last fetch), persisted. */
    touchedAt: number;
    /** RAM cache: memory-mode eager bytes, or a lazy entry's rendered bytes. */
    bytes: Uint8Array | undefined;
    fetcher: LazyBlobFetcher | undefined;
    /** In-flight fetch, shared across concurrent GETs (OpenAI fetches twice). */
    pending: Promise<Uint8Array | null> | undefined;
    lastServe: number;
    successfulGets: number;
    publication: BlobPublication | undefined;
}
export declare const EXT_BY_MIME: Record<string, string>;
export declare const BLOB_PATH_PATTERN: RegExp;
/** Token/byte registry with content-keyed dedup and optional persistence. */
export declare class BlobRegistry {
    #private;
    constructor(options?: {
        maxBytes?: number;
        persist?: BlobPersistence | undefined;
        now?: () => number;
    });
    /**
     * Resolve an existing key registration, re-arming its serving window.
     * `null` when unknown or expired — the caller then supplies bytes.
     */
    lookup(key: string): BlobRegistryEntry | null;
    /**
     * Register eager bytes under a content key and return its registration. With
     * persistence, bytes land in the content-addressed session blob store
     * (idempotent — conversation images are usually already there) and are
     * never held in RAM.
     */
    registerBytes(key: string, mimeType: string, bytes: Uint8Array): Promise<BlobRegistryEntry>;
    /**
     * Register a lazy blob under a caller key. Re-registration replaces the
     * fetcher (a restarted session supplies fresh producers) but keeps the
     * token, so URLs stay stable for provider caches and resumed histories.
     */
    registerLazy(key: string, mimeType: string, fetcher: LazyBlobFetcher): BlobRegistryEntry;
    /** Persist an uploader publication that has no locally served bytes. */
    recordPublication(key: string, mimeType: string, publication: BlobPublication): BlobRegistryEntry;
    /** Attach durable publication metadata after the backend creates it. */
    setPublication(key: string, publication: BlobPublication): void;
    /** Return current store counters and the bounded fetch-attribution history. */
    status(): BlobStoreStatus;
    /**
     * Select registrations for cleanup and, only when `apply` is true, remove
     * candidates accepted by `canRemove`. An unscoped request defaults to
     * expired registrations; callers must set `all` to select live entries.
     */
    purge(request?: BlobBrokerPurgeRequest, canRemove?: (publication: BlobPublication | undefined) => boolean): BlobBrokerPurgeResponse;
    /** Resolve a lazy blob's bytes, invoking and caching the fetcher when needed. */
    materialize(entry: StoredBlob): Promise<Uint8Array | null>;
    /**
     * Serve one public request against the registry. Unknown tokens 404;
     * expired or source-less entries 410; only GET/HEAD are read operations.
     * Fetcher attribution is logged, never gated.
     */
    serve(request: Request): Promise<Response>;
    /** Flush any pending index write; call before shutdown. */
    flush(): void;
}
export {};
