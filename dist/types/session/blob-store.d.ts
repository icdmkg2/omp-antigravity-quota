/** Canonical blob hash shape: exactly 64 lowercase hex chars (a SHA-256 digest). */
export declare const BLOB_HASH_RE: RegExp;
export interface BlobPutOptions {
    /** Optional file extension for a sidecar hardlink/copy that OS openers can type-detect. */
    extension?: string;
}
export interface BlobPutResult {
    hash: string;
    /** Canonical content-addressed path, always `<dir>/<sha256-hex>`. */
    path: string;
    /** Path with the requested extension when supplied, otherwise the canonical path. */
    displayPath: string;
    get ref(): string;
}
export declare function blobExtensionForImageMimeType(mimeType: string | undefined): string | undefined;
export declare class BlobStore {
    readonly dir: string;
    constructor(dir: string);
    /**
     * Write binary data to the blob store.
     * @returns SHA-256 hex hash of the data
     */
    put(data: Buffer, options?: BlobPutOptions): Promise<BlobPutResult>;
    /**
     * Synchronous variant of {@link put}. Use on persistence hot paths where the caller
     * cannot afford the microtask hops of the async version (e.g. OOM-safe session writes).
     * Returns once the bytes are in the kernel page cache.
     */
    putSync(data: Buffer, options?: BlobPutOptions): BlobPutResult;
    /** Read blob by hash, returns Buffer or null if not found. */
    get(hash: string): Promise<Buffer | null>;
    /** Synchronous variant of {@link get}. */
    getSync(hash: string): Buffer | null;
    /** Check if a blob exists. */
    has(hash: string): Promise<boolean>;
}
/** Check if a data string is a blob reference. */
export declare function isBlobRef(data: string): boolean;
/**
 * Extract the SHA-256 hash from a blob reference string.
 *
 * Returns null when the string is not a blob ref, or when the suffix is not a
 * canonical 64-char lowercase hex hash. Rejecting non-hash suffixes here is the
 * single choke point that keeps every resolution path confined to the blob dir:
 * `get`/`getSync` feed this value into `path.join(this.dir, hash)`, so an
 * unvalidated `../` suffix would otherwise escape the store and read arbitrary files.
 */
export declare function parseBlobRef(data: string): string | null;
/** Identify provider transport image data URLs so persistence can externalize and restore them losslessly. */
export declare function isImageDataUrl(data: string): boolean;
/**
 * Externalize a provider image data URL to the blob store, returning a blob reference.
 * The full data URL string is preserved so transport-native history can be reconstructed on resume.
 */
export declare function externalizeImageDataUrl(blobStore: BlobStore, dataUrl: string): Promise<string>;
/** Synchronous variant of {@link externalizeImageDataUrl}. */
export declare function externalizeImageDataUrlSync(blobStore: BlobStore, dataUrl: string): string;
/**
 * Externalize an image's base64 data to the blob store, returning a blob reference.
 * If the data is already a blob reference, returns it unchanged.
 */
export declare function externalizeImageData(blobStore: BlobStore, base64Data: string, mimeType?: string): Promise<string>;
/** Synchronous variant of {@link externalizeImageData}. */
export declare function externalizeImageDataSync(blobStore: BlobStore, base64Data: string, mimeType?: string): string;
/**
 * Resolve an externalized provider image data URL back to its original string.
 * If the data is not a blob reference, returns it unchanged.
 * If the blob is missing, logs a warning and returns the reference as-is.
 */
export declare function resolveImageDataUrl(blobStore: BlobStore, data: string): Promise<string>;
/**
 * Resolve a blob reference back to base64 data.
 * If the data is not a blob reference, returns it unchanged.
 * If the blob is missing, logs a warning and returns a placeholder.
 */
export declare function resolveImageData(blobStore: BlobStore, data: string): Promise<string>;
/** Synchronous variant of {@link resolveImageData}. */
export declare function resolveImageDataSync(blobStore: BlobStore, data: string): string;
