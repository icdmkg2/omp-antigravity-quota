import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
import type { GhToolDetails } from "./gh.js";
import type { GhLabel, GhUser } from "./gh-types.js";
export declare function normalizeText(value: string | null | undefined): string;
export declare function normalizeBlock(value: string | null | undefined): string;
export declare function looksLikeGitHubUrl(value: string | undefined): boolean;
export declare function normalizeOptionalString(value: string | null | undefined): string | undefined;
export declare function normalizePrIdentifierList(value: string | string[] | undefined): string[];
export declare function requireNonEmpty(value: string | null | undefined, label: string): string;
export declare function appendRepoFlag(args: string[], repo: string | undefined, identifier?: string): void;
export declare const REPO_API_URL_PREFIX = "https://api.github.com/repos/";
export declare const PR_URL_PATTERN: RegExp;
export declare const ISSUE_URL_PATTERN: RegExp;
export declare function requireCurrentGitBranch(cwd: string, signal?: AbortSignal): Promise<string>;
export declare function requireCurrentGitHead(cwd: string, signal?: AbortSignal): Promise<string>;
export declare function formatAuthor(author: GhUser | null | undefined): string | undefined;
export declare function formatLabels(labels: GhLabel[] | undefined): string | undefined;
export declare function pushLine(lines: string[], label: string, value: string | number | boolean | undefined): void;
export declare function parsePullRequestUrl(value: string | undefined): {
    repo?: string;
    prNumber?: number;
};
/**
 * Parse a digit-only decimal positive integer or return undefined. Rejects
 * `1e2`, `0x10`, `12.0`, leading +/-, or any other shape `Number()` would
 * accept — those would otherwise key the cache against the wrong row.
 */
export declare function parsePositiveDecimalInt(value: string | undefined): number | undefined;
export declare function parseIssueUrl(value: string | undefined): {
    repo?: string;
    issueNumber?: number;
};
export declare function githubRepoSlugEquals(left: string | undefined, right: string): boolean;
export declare function resolveGitHubRepo(cwd: string, repo: string | undefined, runRepo: string | undefined, signal?: AbortSignal): Promise<string>;
/**
 * Process-lifetime cache of `gh repo view --json nameWithOwner` lookups keyed
 * by absolute cwd. Avoids repeated `gh` chatter when the same protocol handler
 * or tool call resolves the default repo many times in a row.
 *
 * The shared lookup is intentionally **not** bound to any caller's
 * AbortSignal. Cancelling one caller would otherwise kill the underlying
 * `gh repo view` for every concurrent waiter on the same cwd. Each caller's
 * signal is honored at the wait point via `untilAborted` instead, so an abort
 * unwinds only that caller.
 */
export declare const DEFAULT_REPO_RESOLVED: Map<string, string>;
export declare const DEFAULT_REPO_INFLIGHT: Map<string, Promise<string>>;
export declare function resolveDefaultRepoMemoized(cwd: string, signal?: AbortSignal): Promise<string>;
/**
 * Best-effort cached cwd → `owner/repo` resolution that swallows any failure
 * (not a git checkout, no GitHub remote, `gh` unauthenticated, …) into
 * `undefined`. Use where the cwd repo is a convenience fallback, not a safety
 * check.
 */
export declare function tryResolveCurrentRepo(cwd: string, signal: AbortSignal | undefined): Promise<string | undefined>;
/**
 * Best-effort fresh cwd → `owner/repo` resolution for safety checks that must
 * reflect the repository currently mounted at `cwd`, not the process-lifetime
 * default-repo cache.
 */
export declare function tryResolveCurrentRepoFresh(cwd: string, signal: AbortSignal | undefined): Promise<string | undefined>;
export declare function saveArtifactText(session: ToolSession, toolType: string, text: string): Promise<string | undefined>;
export declare function appendArtifactReference(text: string, artifactId: string | undefined, label: string): string;
export declare function buildTextResult(text: string, sourceUrl?: string, details?: GhToolDetails, options?: {
    artifactId?: string;
    artifactLabel?: string;
    useless?: boolean;
}): AgentToolResult<GhToolDetails>;
