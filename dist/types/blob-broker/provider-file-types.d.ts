import type { ProviderFileReference } from "@oh-my-pi/pi-ai";
import type { RemoteDeleteAction } from "./publication.js";
/** Model providers whose official APIs support reusable uploaded-file references. */
export type ProviderFileProvider = "openai" | "anthropic" | "google";
/** Immutable bytes supplied to a provider-native file client. */
export interface ProviderFileUploadRequest {
    /** Raw file bytes. */
    readonly bytes: Uint8Array;
    /** Internet media type sent with the upload. */
    readonly mimeType: string;
    /** Preferred provider-visible filename. */
    readonly filename?: string;
    /** Optional cancellation signal for the upload. */
    readonly signal?: AbortSignal;
}
/** Durable metadata for one file uploaded to a model provider. */
export interface ProviderFileHandle {
    /** Provider that owns the remote file. */
    readonly provider: ProviderFileProvider;
    /** Provider-assigned identifier, used by OpenAI and Anthropic. */
    readonly id?: string;
    /** Provider-assigned URI, used by Google. */
    readonly uri?: string;
    /** Internet media type of the uploaded bytes. */
    readonly mimeType: string;
    /** Number of uploaded bytes. */
    readonly bytes: number;
    /** Unix epoch milliseconds after which the provider may remove the file. */
    readonly expiresAt?: number;
    /** Replayable metadata describing the provider's remote delete operation. */
    readonly delete: RemoteDeleteAction;
}
/** Provider-specific upload/delete implementation selected for a model and account. */
export interface ProviderFileClient {
    /** Provider implemented by this client. */
    readonly provider: ProviderFileProvider;
    /** Upload bytes once and return their durable provider-native handle. */
    upload(request: ProviderFileUploadRequest): Promise<ProviderFileHandle>;
    /** Delete a handle previously produced by this provider client. */
    delete(handle: ProviderFileHandle): Promise<void>;
}
/** One account- and content-scoped cache record safe to persist to disk. */
export interface ProviderFileCacheEntry {
    /** Provider that owns the remote file. */
    readonly provider: ProviderFileProvider;
    /** SHA-256 of the account credential; the credential itself is never retained. */
    readonly credentialHash: string;
    /** Lowercase SHA-256 of the source bytes. */
    readonly contentHash: string;
    /** Durable remote handle. */
    readonly handle: ProviderFileHandle;
}
/** Snapshot of provider-file cache state for CLI reporting. */
export interface ProviderFileCacheStatus {
    /** Caller-provided path of the durable JSON index. */
    readonly indexPath: string;
    /** Number of unexpired cached handles. */
    readonly entries: number;
    /** Sum of source byte counts represented by cached handles. */
    readonly bytes: number;
    /** Entry count grouped by provider. */
    readonly providers: Readonly<Record<ProviderFileProvider, number>>;
    /** Whether memory contains changes not yet written to the index. */
    readonly dirty: boolean;
    /** Unix epoch milliseconds of the most recent successful save. */
    readonly lastSavedAt?: number;
    /** Most recent load or automatic-save failure, if any. */
    readonly lastError?: string;
}
/** Optional timing controls for a provider-file cache. */
export interface ProviderFileCacheOptions {
    /** Delay used to coalesce index writes. Defaults to 250 milliseconds. */
    readonly saveDebounceMs?: number;
    /** Clock override for deterministic consumers and tests. */
    readonly now?: () => number;
}
/** Return a lowercase SHA-256 digest without retaining the supplied credential. */
export declare function hashProviderFileCredential(credential: string): string;
/** Return the content digest used to deduplicate provider-native uploads. */
export declare function hashProviderFileContent(bytes: Uint8Array): string;
/** Convert a durable cache handle to the provider reference carried by AI image content. */
export declare function toProviderFileReference(handle: ProviderFileHandle): ProviderFileReference;
/**
 * Durable provider-native file index keyed by provider, credential digest, and
 * content digest. Mutations are persisted atomically after a short debounce.
 */
export declare class ProviderFileCache {
    #private;
    /** Load an existing index from `indexPath`, ignoring malformed or expired records. */
    constructor(indexPath: string, options?: ProviderFileCacheOptions);
    /** Return an unexpired handle for the provider, account credential, and content digest. */
    get(provider: ProviderFileProvider, credential: string, contentHash: string): ProviderFileHandle | undefined;
    /** Insert or replace a provider handle for one account-scoped content digest. */
    set(provider: ProviderFileProvider, credential: string, contentHash: string, handle: ProviderFileHandle): void;
    /** Remove and return one account-scoped cache record, if present. */
    delete(provider: ProviderFileProvider, credential: string, contentHash: string): ProviderFileCacheEntry | undefined;
    /** Remove expired records and return their deletion metadata to the caller. */
    purgeExpired(): readonly ProviderFileCacheEntry[];
    /** Return every unexpired cache record in deterministic order. */
    entries(): readonly ProviderFileCacheEntry[];
    /** Return current counts and persistence state for CLI presentation. */
    status(): ProviderFileCacheStatus;
    /** Remove every record and return their remote deletion metadata. */
    deleteAll(): readonly ProviderFileCacheEntry[];
    /** Immediately persist pending mutations using a same-directory atomic rename. */
    save(): void;
}
