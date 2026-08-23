import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { Settings } from "../config/settings.js";
import * as git from "../utils/git.js";
import type { ToolSession } from "./index.js";
import type { GhToolDetails } from "./gh.js";
import type { GhComment, GhIssueViewData, GhPrFile, GhPrReview, GhPrReviewComment, GhPrReviewCommentApi, GhPrViewData, GhRepoViewData, GithubInput } from "./gh-types.js";
import { type CacheStatus } from "./github-cache.js";
export declare const GH_REPO_FIELDS: string[];
export declare const GH_ISSUE_FIELDS: string[];
export declare const GH_ISSUE_FIELDS_NO_COMMENTS: string[];
export declare const GH_ISSUE_STATE_REASON_FIELD = "stateReason";
export declare function ghJsonErrorNamesField(err: unknown, field: string): boolean;
export declare function dropJsonField(args: readonly string[], field: string): string[] | undefined;
/** Runs `gh --json` for issue data, retrying without optional stateReason on older gh releases. */
export declare function githubIssueJsonWithStateReasonFallback<T>(cwd: string, args: readonly string[], signal: AbortSignal | undefined, options?: git.GhCommandOptions): Promise<T>;
export declare const GH_PR_FIELDS: string[];
export declare const GH_PR_FIELDS_NO_COMMENTS: string[];
export declare const GH_REPO_CLONE_FIELDS: string[];
export declare const REVIEW_COMMENTS_PAGE_SIZE = 100;
export declare function normalizePrReviewComment(comment: GhPrReviewCommentApi): GhPrReviewComment | null;
export declare function fetchPrReviewComments(cwd: string, repo: string, prNumber: number, signal?: AbortSignal): Promise<GhPrReviewComment[]>;
export declare function formatCommentsSection(comments: GhComment[] | undefined): string[];
export declare function formatReviewsSection(reviews: GhPrReview[] | undefined): string[];
export declare function formatReviewCommentLocation(comment: GhPrReviewComment): string | undefined;
export declare function formatReviewCommentsSection(comments: GhPrReviewComment[] | undefined): string[];
export declare function formatRepoView(data: GhRepoViewData, input: {
    repo?: string;
    branch?: string;
}): string;
export declare function formatIssueView(data: GhIssueViewData, input: {
    issue: string;
    repo?: string;
    comments?: boolean;
}): string;
export declare function formatPrFiles(files: GhPrFile[] | undefined): string[];
export declare function formatPrView(data: GhPrViewData, input: {
    pr?: string;
    repo?: string;
    comments?: boolean;
}): string;
export declare function executeRepoView(session: ToolSession, params: GithubInput, signal: AbortSignal | undefined): Promise<AgentToolResult<GhToolDetails>>;
export interface IssueViewLookupOptions {
    cwd: string;
    repo?: string;
    /** Issue number or GitHub issue URL. */
    issue: string;
    includeComments?: boolean;
    signal?: AbortSignal;
    settings?: Settings;
    cacheAuthKey?: string | null;
}
export interface PrViewLookupOptions {
    cwd: string;
    repo: string;
    number: number;
    includeComments?: boolean;
    signal?: AbortSignal;
    settings?: Settings;
    cacheAuthKey?: string | null;
}
export interface ViewLookupResult<T> {
    rendered: string;
    sourceUrl: string | undefined;
    payload: T;
    status: CacheStatus;
    fetchedAt: number;
}
export declare function fetchIssueViewFresh(cwd: string, repo: string | undefined, identifier: string, includeComments: boolean, signal: AbortSignal | undefined): Promise<{
    rendered: string;
    sourceUrl: string | undefined;
    payload: GhIssueViewData;
}>;
export declare function fetchPrViewFresh(cwd: string, repo: string, number: number, includeComments: boolean, signal: AbortSignal | undefined): Promise<{
    rendered: string;
    sourceUrl: string | undefined;
    payload: GhPrViewData;
}>;
/**
 * Cache-aware issue/view fetcher. Used by both the `github` tool op and the
 * `issue://` protocol handler so a single shared row services both surfaces.
 */
export declare function getOrFetchIssue(options: IssueViewLookupOptions): Promise<ViewLookupResult<GhIssueViewData>>;
/**
 * Cache-aware PR view fetcher. Caller must supply a numeric PR number;
 * branch-name / current-branch lookups bypass the cache entirely upstream
 * (see `executePrView`).
 */
export declare function getOrFetchPr(options: PrViewLookupOptions): Promise<ViewLookupResult<GhPrViewData>>;
