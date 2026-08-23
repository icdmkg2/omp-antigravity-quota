import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback, ToolApprovalDecision } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
import type { OutputMeta } from "./output-meta.js";
export { parsePositiveDecimalInt, resolveDefaultRepoMemoized } from "./gh-common.js";
export { getOrFetchPrDiff, type PrDiffFile, type PrDiffLookupOptions, type PrDiffPayload, parsePrUnifiedDiff, } from "./gh-pr-diff.js";
export { buildSearchDateQualifier, parseSearchDateBound } from "./gh-search.js";
export { getOrFetchIssue, getOrFetchPr, githubIssueJsonWithStateReasonFallback, type IssueViewLookupOptions, type PrViewLookupOptions, type ViewLookupResult, } from "./gh-view.js";
declare const githubSchema: import("@oh-my-pi/omptype").FluentType<{
    assignee?: string[] | undefined;
    base?: string | undefined;
    body?: string | undefined;
    branch?: string | undefined;
    dateField?: "created" | "updated" | undefined;
    draft?: boolean | undefined;
    fill?: boolean | undefined;
    force?: boolean | undefined;
    forceWithLease?: boolean | undefined;
    head?: string | undefined;
    label?: string[] | undefined;
    limit?: number | undefined;
    op: "file_read" | "pr_checkout" | "pr_create" | "pr_push" | "repo_view" | "run_watch" | "search_code" | "search_commits" | "search_issues" | "search_prs" | "search_repos";
    path?: string | undefined;
    pr?: string | string[] | undefined;
    query?: string | undefined;
    repo?: string | undefined;
    reviewer?: string[] | undefined;
    run?: string | undefined;
    since?: string | undefined;
    tail?: number | undefined;
    title?: string | undefined;
    until?: string | undefined;
}, {
    assignee?: string[] | undefined;
    base?: string | undefined;
    body?: string | undefined;
    branch?: string | undefined;
    dateField?: "created" | "updated" | undefined;
    draft?: boolean | undefined;
    fill?: boolean | undefined;
    force?: boolean | undefined;
    forceWithLease?: boolean | undefined;
    head?: string | undefined;
    label?: string[] | undefined;
    limit?: number | undefined;
    op: "file_read" | "pr_checkout" | "pr_create" | "pr_push" | "repo_view" | "run_watch" | "search_code" | "search_commits" | "search_issues" | "search_prs" | "search_repos";
    path?: string | undefined;
    pr?: string | string[] | undefined;
    query?: string | undefined;
    repo?: string | undefined;
    reviewer?: string[] | undefined;
    run?: string | undefined;
    since?: string | undefined;
    tail?: number | undefined;
    title?: string | undefined;
    until?: string | undefined;
}>;
type GithubInput = typeof githubSchema.infer;
export interface GhToolDetails {
    meta?: OutputMeta;
    artifactId?: string;
    repo?: string;
    branch?: string;
    worktreePath?: string;
    remote?: string;
    remoteBranch?: string;
    headSha?: string;
    runId?: number;
    runIds?: number[];
    status?: string;
    conclusion?: string;
    failedJobs?: string[];
    watch?: GhRunWatchViewDetails;
    checkouts?: GhPrCheckoutSummary[];
}
export interface GhPrCheckoutSummary {
    prNumber?: number;
    url?: string;
    branch: string;
    worktreePath: string;
    remote: string;
    remoteBranch: string;
    reused: boolean;
}
export interface GhRunWatchJobDetails {
    id: number;
    name: string;
    status?: string;
    conclusion?: string;
    durationSeconds?: number;
    url?: string;
}
export interface GhRunWatchRunDetails {
    id: number;
    workflowName?: string;
    displayTitle?: string;
    status?: string;
    conclusion?: string;
    branch?: string;
    headSha?: string;
    url?: string;
    jobs: GhRunWatchJobDetails[];
}
export interface GhRunWatchFailedLogDetails {
    runId: number;
    workflowName?: string;
    jobName: string;
    conclusion?: string;
    tail?: string;
    available: boolean;
}
export interface GhRunWatchViewDetails {
    mode: "run" | "commit";
    state: "watching" | "completed";
    repo: string;
    branch?: string;
    headSha?: string;
    pollCount?: number;
    note?: string;
    run?: GhRunWatchRunDetails;
    runs?: GhRunWatchRunDetails[];
    failedLogs?: GhRunWatchFailedLogDetails[];
}
export declare class GithubTool implements AgentTool<typeof githubSchema, GhToolDetails> {
    private readonly session;
    readonly name = "github";
    readonly approval: (args: unknown) => ToolApprovalDecision;
    readonly summary = "Interact with GitHub repositories, files, pull requests, and Actions";
    readonly loadMode = "discoverable";
    readonly label = "GitHub";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        assignee?: string[] | undefined;
        base?: string | undefined;
        body?: string | undefined;
        branch?: string | undefined;
        dateField?: "created" | "updated" | undefined;
        draft?: boolean | undefined;
        fill?: boolean | undefined;
        force?: boolean | undefined;
        forceWithLease?: boolean | undefined;
        head?: string | undefined;
        label?: string[] | undefined;
        limit?: number | undefined;
        op: "file_read" | "pr_checkout" | "pr_create" | "pr_push" | "repo_view" | "run_watch" | "search_code" | "search_commits" | "search_issues" | "search_prs" | "search_repos";
        path?: string | undefined;
        pr?: string | string[] | undefined;
        query?: string | undefined;
        repo?: string | undefined;
        reviewer?: string[] | undefined;
        run?: string | undefined;
        since?: string | undefined;
        tail?: number | undefined;
        title?: string | undefined;
        until?: string | undefined;
    }, {
        assignee?: string[] | undefined;
        base?: string | undefined;
        body?: string | undefined;
        branch?: string | undefined;
        dateField?: "created" | "updated" | undefined;
        draft?: boolean | undefined;
        fill?: boolean | undefined;
        force?: boolean | undefined;
        forceWithLease?: boolean | undefined;
        head?: string | undefined;
        label?: string[] | undefined;
        limit?: number | undefined;
        op: "file_read" | "pr_checkout" | "pr_create" | "pr_push" | "repo_view" | "run_watch" | "search_code" | "search_commits" | "search_issues" | "search_prs" | "search_repos";
        path?: string | undefined;
        pr?: string | string[] | undefined;
        query?: string | undefined;
        repo?: string | undefined;
        reviewer?: string[] | undefined;
        run?: string | undefined;
        since?: string | undefined;
        tail?: number | undefined;
        title?: string | undefined;
        until?: string | undefined;
    }>;
    readonly strict = true;
    constructor(session: ToolSession);
    static createIf(session: ToolSession): GithubTool | null;
    execute(_toolCallId: string, params: GithubInput, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<GhToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<GhToolDetails>>;
}
