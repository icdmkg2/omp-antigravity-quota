/**
 * Cache schema/format revision. Bumping it changes the on-disk key prefix
 * (`v<N>-...`), so old entries become unreachable and are pruned naturally.
 * Bump when the cache *file* shape changes (entry JSON layout, key scheme).
 *
 * Converter *output* changes are handled separately: the package version is
 * folded into the key (see {@link markitConversionCacheKey}), so any release
 * that ships new markdown from `src/markit/converters/*` auto-invalidates the
 * cache without a manual bump here.
 */
export declare const MARKIT_CONVERSION_CACHE_VERSION = 1;
export declare const MAX_MARKIT_CONVERSION_CACHE_BYTES: number;
export type MarkitConversionCacheStatus = "hit" | "miss" | "skipped";
export type MarkitConversionCacheReadResult = {
    status: "hit";
    content: string;
} | {
    status: "miss";
};
export declare function markitConversionCacheKey(bytes: Uint8Array, extension: string): string;
export declare function readMarkitConversionCache(key: string): Promise<MarkitConversionCacheReadResult>;
export declare function pruneMarkitConversionCache(cacheDir: string): Promise<void>;
export declare function writeMarkitConversionCache(key: string, content: string): Promise<void>;
