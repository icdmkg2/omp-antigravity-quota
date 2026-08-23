import type { ToolSession } from "../sdk.js";
export declare function isRemoteMountPath(absolutePath: string): boolean;
export declare function isNotFoundError(error: unknown): boolean;
/** Per-execute memo of suffix-glob lookups; `null` records a confirmed miss. */
export type SuffixMatchCache = Map<string, {
    absolutePath: string;
    displayPath: string;
} | null>;
/**
 * Memoized {@link findUniqueWorkspaceSuffix} for a single read call. A missing
 * path with archive/sqlite extensions probes the workspace once per stage
 * (archive candidates, sqlite candidates, plain path) — each glob carries a
 * 5s timeout, so repeated lookups of the same string stack into a long
 * stall before erroring. The cache collapses repeats within one execute().
 */
export declare function findSuffixMatchCached(session: ToolSession, cache: SuffixMatchCache, rawPath: string, signal?: AbortSignal): Promise<{
    absolutePath: string;
    displayPath: string;
} | null>;
