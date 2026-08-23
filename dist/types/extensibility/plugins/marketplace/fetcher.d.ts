/**
 * Marketplace catalog fetcher.
 *
 * Classifies a source string, resolves it, and loads the catalog.
 */
import type { MarketplaceCatalog, MarketplaceSourceType } from "./types.js";
export interface FetchResult {
    catalog: MarketplaceCatalog;
    /** For git sources: path to the cloned marketplace directory. */
    clonePath?: string;
}
/**
 * Classify a marketplace source string into one of the four source types.
 *
 * Rules are ordered; the first match wins. Protocol/pattern checks (rules 1-3)
 * run before any path.isAbsolute() check so that SCP-style git@ URLs are
 * never misclassified as local paths on Windows.
 *
 * @throws if the source format is unrecognized.
 */
export declare function classifySource(source: string): MarketplaceSourceType;
/**
 * Parse and validate a marketplace.json catalog from raw JSON content.
 *
 * Required fields: name (valid name segment), owner.name, plugins array.
 * Each plugin entry requires name (string) and source (string or object
 * with a "source" field). Extra fields are preserved via spread.
 *
 * @throws on JSON parse failure or missing/invalid required fields.
 */
export declare function parseMarketplaceCatalog(content: string, filePath: string): MarketplaceCatalog;
/**
 * Fetch a marketplace catalog from a source.
 *
 * Dispatches on the source type: local filesystem paths are read directly;
 * GitHub/git sources are cloned with `git`; URL sources are fetched over HTTP.
 *
 * @param source   Source identifier: path, GitHub shorthand, git URL, or HTTP URL.
 * @param cacheDir Cache directory root for non-local sources.
 */
export declare function fetchMarketplace(source: string, cacheDir: string): Promise<FetchResult>;
/**
 * Promote a temporary clone directory to its final cache location.
 *
 * Callers should invoke this only after duplicate/drift checks pass.
 * Removes any existing directory at the target path before renaming.
 */
export declare function promoteCloneToCache(tmpDir: string, cacheDir: string, name: string): Promise<string>;
