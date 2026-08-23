/**
 * Extract "owner/repo" from a GitHub remote URL.
 * Handles HTTPS, SSH (scp-style), and git:// protocols.
 *
 * @returns "owner/repo" or null if the URL isn't a recognized GitHub remote.
 */
export declare function parseGitHubRepo(remoteUrl: string): string | null;
/**
 * Extract the branch name from a remote HEAD ref like "origin/main".
 * Returns the portion after the first "/" or the whole string if no "/" is present.
 */
export declare function parseDefaultBranch(ref: string): string;
export interface PrCacheContext {
    branch: string;
    repoId: string | null;
}
export declare function createPrCacheContext(branch: string, repoId: string | null): PrCacheContext;
export declare function isSamePrCacheContext(a: PrCacheContext | undefined, b: PrCacheContext | undefined): boolean;
export declare function canReuseCachedPr(cachedPr: {
    number: number;
    url: string;
} | null | undefined, cachedContext: PrCacheContext | undefined, currentContext: PrCacheContext | null): boolean;
