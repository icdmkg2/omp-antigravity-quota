import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
import type { GhToolDetails } from "./gh.js";
import type { GhApiLabel, GhApiSearchCodeItem, GhApiSearchCommitItem, GhApiSearchIssueItem, GhApiSearchRepoItem, GhApiUser, GhLabel, GhSearchCodeResult, GhSearchCommitResult, GhSearchRepoResult, GhSearchResult, GhUser, GithubInput } from "./gh-types.js";
export declare const SEARCH_LIMIT_DEFAULT = 10;
export declare const SEARCH_LIMIT_MAX = 50;
export declare const FILE_PREVIEW_LIMIT = 50;
export declare function resolveSearchLimit(value: number | undefined): number;
export declare const RELATIVE_DURATION_PATTERN: RegExp;
export declare const ISO_DATE_PATTERN: RegExp;
export declare const FIXED_UNIT_MS: Record<string, number>;
/**
 * Resolve a search date bound to a GitHub-search-compatible literal. Returns
 * either a `YYYY-MM-DD` date (relative durations and date-only inputs) or a
 * full ISO 8601 datetime string (datetime inputs), so the caller can drop it
 * straight into a qualifier like `created:>=<value>`.
 */
export declare function parseSearchDateBound(raw: string, now?: Date): string;
/**
 * Build the GitHub-search qualifier (e.g. `created:>=2026-05-09`) for the
 * provided bounds, or `undefined` if neither bound is set.
 */
export declare function buildSearchDateQualifier(field: string, since: string | undefined, until: string | undefined, now?: Date): string | undefined;
export declare function resolveSearchDateField(command: "issues" | "prs" | "commits" | "repos", requested: "created" | "updated" | undefined): string;
export declare function composeSearchQuery(parts: ReadonlyArray<string | undefined>): string;
export declare function buildGhApiSearchArgs(endpoint: "issues" | "code" | "commits" | "repositories", query: string, limit: number, extraHeaders?: ReadonlyArray<string>): string[];
export declare function repoFromRepositoryUrl(value: string | undefined): string | undefined;
export declare function apiUserToGhUser(user: GhApiUser | null | undefined): GhUser | undefined;
export declare function apiLabelsToGhLabels(labels: GhApiLabel[] | undefined): GhLabel[];
export declare function apiIssueToSearchResult(item: GhApiSearchIssueItem): GhSearchResult;
export declare function apiCodeToSearchResult(item: GhApiSearchCodeItem): GhSearchCodeResult;
export declare function apiCommitToSearchResult(item: GhApiSearchCommitItem): GhSearchCommitResult;
export declare function apiRepoToSearchResult(item: GhApiSearchRepoItem): GhSearchRepoResult;
/**
 * Matches search-query qualifiers that already scope to a repository, org, or
 * user. When present, callers should avoid layering a default `repo:<current>`
 * on top — the user has already expressed an explicit scope.
 *
 * Only the leading `repo:`/`org:`/`user:`/`owner:` token is treated as a
 * scope marker; arbitrary substrings (e.g. inside quoted text) are ignored.
 */
export declare const REPO_SCOPE_QUALIFIER_PATTERN: RegExp;
/**
 * Resolve the effective `repo:` scope for a search op. Returns the explicit
 * `repo` when set, `undefined` when the query already carries a scoping
 * qualifier, and otherwise the current checkout's `owner/repo` via
 * `resolveDefaultRepoMemoized`. Resolution failures (no git/gh context, no
 * configured remote) silently fall back to `undefined` so the search proceeds
 * across all of GitHub instead of throwing.
 */
export declare function resolveSearchRepoScope(cwd: string, repo: string | undefined, query: string | undefined, signal: AbortSignal | undefined): Promise<string | undefined>;
export declare function formatSearchResults(kind: "issues" | "pull requests", query: string, repo: string | undefined, items: GhSearchResult[]): string;
export declare function formatSearchCodeResults(query: string, repo: string | undefined, items: GhSearchCodeResult[]): string;
export declare function formatSearchCommitMessage(message: string | undefined): string | undefined;
export declare function formatSearchCommitsResults(query: string, repo: string | undefined, items: GhSearchCommitResult[]): string;
export declare function formatSearchReposResults(query: string, items: GhSearchRepoResult[]): string;
export declare function executeSearchIssues(session: ToolSession, params: GithubInput, signal: AbortSignal | undefined): Promise<AgentToolResult<GhToolDetails>>;
export declare function executeSearchPrs(session: ToolSession, params: GithubInput, signal: AbortSignal | undefined): Promise<AgentToolResult<GhToolDetails>>;
export declare function executeSearchCode(session: ToolSession, params: GithubInput, signal: AbortSignal | undefined): Promise<AgentToolResult<GhToolDetails>>;
export declare function executeSearchCommits(session: ToolSession, params: GithubInput, signal: AbortSignal | undefined): Promise<AgentToolResult<GhToolDetails>>;
export declare function executeSearchRepos(session: ToolSession, params: GithubInput, signal: AbortSignal | undefined): Promise<AgentToolResult<GhToolDetails>>;
