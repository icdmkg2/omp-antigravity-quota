import type { Settings } from "../config/settings.js";
import type { ViewLookupResult } from "./gh-view.js";
export declare const PR_DIFF_FILES_PAGE_SIZE = 100;
export declare const PR_DIFF_FILES_MAX = 3000;
export interface PrDiffFile {
    /** Display path. Prefers the post-image (`b/<path>`) when present. */
    path: string;
    additions: number;
    deletions: number;
    changeType: "modified" | "added" | "deleted" | "renamed" | "binary";
    /** Pre-image path for renames/deletes; same as `path` otherwise. */
    oldPath?: string;
    /** Byte offset of the section's `diff --git` line in the unified diff. */
    startOffset: number;
    /** Byte offset of the next section (or end-of-text). */
    endOffset: number;
}
export interface PrDiffPayload {
    /** Full unified diff text as returned by `gh pr diff --color never`. */
    unified: string;
    files: PrDiffFile[];
}
export interface PrDiffLookupOptions {
    cwd: string;
    repo: string;
    number: number;
    signal?: AbortSignal;
    settings?: Settings;
    cacheAuthKey?: string | null;
}
/**
 * Split `gh pr diff` output on `^diff --git ` boundaries and parse per-file
 * metadata. The unified diff is preserved verbatim so callers can slice it by
 * byte offsets without re-running gh.
 */
export declare function parsePrUnifiedDiff(text: string): PrDiffPayload;
export interface ParsedDiffHeaderToken {
    value: string;
    nextIndex: number;
}
export declare function skipDiffHeaderSpaces(text: string, index: number): number;
export declare function parseDiffQuotedEscape(text: string, slashIndex: number): ParsedDiffHeaderToken;
export declare function parseDiffQuotedToken(text: string, startIndex: number): ParsedDiffHeaderToken | undefined;
export declare function parseDiffHeaderToken(text: string, startIndex: number): ParsedDiffHeaderToken | undefined;
export declare function stripPrDiffPathPrefix(value: string, prefix: "a/" | "b/"): string | undefined;
export declare function parsePrDiffHeaderPaths(header: string): {
    oldPath?: string;
    newPath?: string;
};
export declare function isPrDiffFileHeaderLine(line: string): boolean;
export declare function parsePrDiffSection(section: string, startOffset: number, endOffset: number): PrDiffFile;
/**
 * A single entry from `GET /repos/{owner}/{repo}/pulls/{n}/files`. `patch` is
 * absent for binary files and for individual file diffs GitHub deems too large
 * to render.
 */
export interface GhPrFileApi {
    filename?: string;
    previous_filename?: string;
    status?: string;
    additions?: number;
    deletions?: number;
    patch?: string;
}
export interface GhPrApi {
    changed_files?: number;
}
/**
 * GitHub rejects the aggregate PR diff endpoint with HTTP 406 once the diff
 * exceeds 20,000 lines. Detect that specific failure so the caller can fall
 * back to the per-file endpoint instead of aborting the whole review.
 */
export declare function isPrDiffTooLargeError(err: unknown): boolean;
export declare function formatSyntheticDiffPath(prefix: "a/" | "b/", path: string): string;
/**
 * Reconstruct a `diff --git` section from a single files-API entry. The API's
 * `patch` field carries only the hunk body, so the `diff --git`/`---`/`+++`
 * headers are synthesized to match `gh pr diff` output — this keeps
 * {@link parsePrUnifiedDiff} and the review parser producing identical section
 * boundaries and byte offsets. Files whose `patch` is omitted (binary or
 * too-large) stay visible with an explicit marker rather than being dropped.
 */
export declare function buildSyntheticDiffSection(file: GhPrFileApi): string | undefined;
/**
 * Fallback PR diff retrieval via the paginated per-file endpoint, used when the
 * aggregate `gh pr diff` is rejected for exceeding GitHub's 20,000-line limit.
 * The per-file patches are not subject to that aggregate cap, so even very
 * large PRs can be reassembled into a synthetic unified diff.
 */
export declare function fetchPrDiffViaFilesApi(cwd: string, repo: string, number: number, signal: AbortSignal | undefined): Promise<string>;
export declare function fetchPrDiffFresh(cwd: string, repo: string, number: number, signal: AbortSignal | undefined): Promise<{
    rendered: string;
    sourceUrl: string | undefined;
    payload: PrDiffPayload;
}>;
/**
 * Cache-aware PR diff fetcher. Stores the full unified diff plus a parsed
 * file index in a single `pr-diff` cache row so the listing, full-diff, and
 * per-file slice variants of `pr://<n>/diff` share one `gh pr diff`
 * invocation.
 */
export declare function getOrFetchPrDiff(options: PrDiffLookupOptions): Promise<ViewLookupResult<PrDiffPayload>>;
