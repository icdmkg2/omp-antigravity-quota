import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import * as git from "../utils/git.js";
import type { ToolSession } from "./index.js";
import type { GhPrCheckoutSummary, GhToolDetails } from "./gh.js";
import type { GhPrViewData, GhRepoViewData, GithubInput } from "./gh-types.js";
export declare const GH_REPO_CLONE_FIELDS: string[];
export declare const GH_PR_CHECKOUT_FIELDS: string[];
export declare function sanitizeRemoteName(value: string): string;
/** Maximum disambiguation suffixes we try before giving up on a worktree path. */
export declare const WORKTREE_PATH_MAX_SUFFIX = 100;
export declare function toLocalBranchRef(value: string): string;
export declare function requireGitRepoRoot(cwd: string, signal?: AbortSignal): Promise<string>;
export declare function requirePrimaryGitRepoRoot(cwd: string, signal?: AbortSignal): Promise<string>;
/**
 * Resolve a worktree path that is free of conflicts.
 *
 * Given a `basePath`, return either `basePath` itself or `${basePath}-2`,
 * `${basePath}-3`, … up to {@link WORKTREE_PATH_MAX_SUFFIX} — whichever is the
 * first variant that is **not** registered with git as another worktree and
 * **not** present on disk. The numeric tail salvages two rare cases that
 * would otherwise abort a checkout: stale leftover dirs from an interrupted
 * `git worktree add`, and the (vanishingly unlikely) `hashPath` collision
 * between two repos that happen to produce the same 7-hex digest.
 */
export declare function resolveAvailableWorktreePath(basePath: string, existingWorktrees: git.GitWorktreeEntry[]): Promise<string>;
export declare function selectPrCloneUrl(originUrl: string | undefined, repo: Pick<GhRepoViewData, "url" | "sshUrl">): string;
export declare function getRemoteUrls(repoRoot: string, signal?: AbortSignal): Promise<Map<string, string>>;
export declare function ensurePrRemote(repoRoot: string, data: GhPrViewData, signal?: AbortSignal): Promise<{
    name: string;
    url: string;
}>;
export declare function resolvePrBranchPushTarget(repoRoot: string, localBranch: string, signal?: AbortSignal): Promise<{
    remoteName: string;
    remoteBranch: string;
    remoteUrl?: string;
    prUrl?: string;
    maintainerCanModify?: boolean;
    isCrossRepository: boolean;
}>;
export declare function formatPrCheckoutResult(options: {
    data: GhPrViewData;
    localBranch: string;
    worktreePath: string;
    remoteName: string;
    remoteUrl: string;
    reused: boolean;
}): string;
export declare function formatPrPushResult(options: {
    localBranch: string;
    remoteName: string;
    remoteBranch: string;
    remoteUrl?: string;
    prUrl?: string;
    forceWithLease: boolean;
}): string;
export declare function joinSections(sections: string[]): string[];
export declare function executePrCheckout(session: ToolSession, params: GithubInput, signal: AbortSignal | undefined): Promise<AgentToolResult<GhToolDetails>>;
export interface PrCheckoutOptions {
    prRef: string | undefined;
    repo: string | undefined;
    force: boolean;
}
export interface PrCheckoutOutcome {
    data: GhPrViewData;
    localBranch: string;
    worktreePath: string;
    remoteName: string;
    remoteUrl: string;
    headRefName: string;
    reused: boolean;
}
export declare function checkoutPullRequest(session: ToolSession, signal: AbortSignal | undefined, options: PrCheckoutOptions): Promise<PrCheckoutOutcome>;
export declare function outcomeToSummary(outcome: PrCheckoutOutcome): GhPrCheckoutSummary;
export declare function executePrPush(session: ToolSession, params: GithubInput, signal: AbortSignal | undefined): Promise<AgentToolResult<GhToolDetails>>;
export declare function executePrCreate(session: ToolSession, params: GithubInput, signal: AbortSignal | undefined): Promise<AgentToolResult<GhToolDetails>>;
export declare function formatPrCreateResult(options: {
    url: string;
    prNumber?: number;
    data?: GhPrViewData;
    title?: string;
    base?: string;
    head?: string;
    draft?: boolean;
}): string;
