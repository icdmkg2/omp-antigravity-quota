/**
 * Plugin cache management.
 *
 * Cache layout: `<cacheDir>/<marketplace>___<pluginName>___<version>/`
 *
 * All three components are validated before any filesystem operation:
 *   - marketplace / pluginName: isValidNameSegment (lowercase alnum + hyphens, max 64)
 *   - version: isValidVersionForCache (alnum + ._+-, max 128)
 *
 * This ensures cache paths cannot be crafted to escape the cache directory.
 */
/** Return true when `version` is safe for use as a cache path component. */
export declare function isValidVersionForCache(version: string): boolean;
/**
 * Return the absolute path for a cached plugin directory.
 * Throws if any component fails validation.
 */
export declare function getCachedPluginPath(cacheDir: string, marketplace: string, pluginName: string, version: string): string;
/**
 * Copy `sourcePath` into the cache, returning the absolute cache path.
 *
 * Idempotent: if the target already exists it is removed before copying,
 * so a partial previous cache is never silently reused.
 */
export declare function cachePlugin(sourcePath: string, cacheDir: string, marketplace: string, pluginName: string, version: string): Promise<string>;
/**
 * Synchronous check — true when the cache directory exists on disk.
 * Uses `existsSync` because callers may need to run this check inline without async.
 */
export declare function isCached(cacheDir: string, marketplace: string, pluginName: string, version: string): boolean;
/** Remove a single cached plugin directory. No-op if it does not exist. */
export declare function removeCachedPlugin(cacheDir: string, marketplace: string, pluginName: string, version: string): Promise<void>;
/**
 * Remove all cache entries whose full path is not in `installedPaths`.
 *
 * Returns the count of removed directories. If `cacheDir` does not exist,
 * returns `{ removed: 0 }` rather than throwing.
 */
export declare function cleanOrphanedCache(cacheDir: string, installedPaths: Set<string>): Promise<{
    removed: number;
}>;
