/**
 * Source resolver for marketplace plugin entries.
 *
 * Resolves plugin sources to absolute local directory paths:
 *   - Relative string "./plugins/foo" → path within marketplace clone
 *   - { source: "url", url: "https://...git" } → git clone
 *   - { source: "github", repo: "owner/repo" } → git clone from GitHub
 *   - { source: "git-subdir", url: "...", path: "sub/dir" } → git clone + subdir
 *   - { source: "npm", ... } → not yet supported
 */
import type { MarketplaceCatalogMetadata, MarketplacePluginEntry } from "./types.js";
export interface ResolveContext {
    /** Absolute path to the cloned/local marketplace directory. Required for relative sources. */
    marketplaceClonePath?: string;
    /** Catalog metadata — used for `pluginRoot` prepend. */
    catalogMetadata?: MarketplaceCatalogMetadata;
    /** Scratch directory for sources that require cloning or extraction. */
    tmpDir: string;
}
/**
 * Resolve a plugin source to an absolute local directory path.
 *
 * The resolved path is verified to exist on disk.
 */
export declare function resolvePluginSource(entry: MarketplacePluginEntry, context: ResolveContext): Promise<{
    dir: string;
    tempCloneRoot?: string;
}>;
