import type { AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
import type { GhRunWatchFailedLogDetails, GhRunWatchJobDetails, GhRunWatchRunDetails, GhRunWatchViewDetails, GhToolDetails } from "./gh.js";
import type { GhActionsJobApi, GhActionsRunApi, GhFailedJobLog, GhRunJobSnapshot, GhRunReference, GhRunSnapshot, GithubInput } from "./gh-types.js";
export declare const RUN_WATCH_INTERVAL_DEFAULT = 3;
export declare const RUN_WATCH_INTERVAL_SLOW = 15;
export declare const RUN_WATCH_FAST_WINDOW_MS = 60000;
export declare const RUN_WATCH_NO_RUNS_GIVE_UP_MS = 90000;
export declare const RUN_WATCH_MAX_POLL_FAILURES = 5;
export declare const RUN_WATCH_GRACE_DEFAULT = 5;
export declare const RUN_WATCH_TAIL_DEFAULT = 15;
export declare const RUN_WATCH_TAIL_MAX = 200;
export declare const RUN_JOBS_PAGE_SIZE = 100;
export declare function resolveTailLimit(value: number | undefined): number;
export declare const RUN_URL_PATTERN: RegExp;
export declare const RUN_SUCCESS_CONCLUSIONS: Set<string>;
export declare const RUN_FAILURE_CONCLUSIONS: Set<string>;
export declare const JOB_FAILURE_CONCLUSIONS: Set<string>;
export declare function parseRunReference(value: string | undefined): GhRunReference;
export declare function normalizeRunJob(job: GhActionsJobApi): GhRunJobSnapshot | null;
export declare function normalizeRunSnapshot(run: GhActionsRunApi, jobs: GhRunJobSnapshot[]): GhRunSnapshot;
export declare function getRunOutcome(value: string | undefined): "success" | "failure" | "pending";
export declare function getRunSnapshotOutcome(run: GhRunSnapshot): "success" | "failure" | "pending";
export declare function getRunCollectionOutcome(runs: GhRunSnapshot[]): "success" | "failure" | "pending";
export declare function getRunCollectionSignature(runs: GhRunSnapshot[]): string;
export declare function isFailedJob(job: GhRunJobSnapshot): boolean;
export declare const GH_RATE_LIMIT_ERROR_PATTERN: RegExp;
/**
 * Rate-limit / secondary-limit gh failures are transient; the run_watch poll
 * loops back off and retry them instead of discarding the whole watch.
 */
export declare function isRateLimitedGhError(err: unknown): boolean;
export declare function formatJobState(job: GhRunJobSnapshot): string;
export declare function parseTimestampMs(value: string | undefined): number | undefined;
export declare function getJobDurationSeconds(job: GhRunJobSnapshot, observedAtMs: number): number | undefined;
export declare function buildRunWatchJobDetails(job: GhRunJobSnapshot, observedAtMs: number): GhRunWatchJobDetails;
export declare function buildRunWatchRunDetails(run: GhRunSnapshot, observedAtMs: number): GhRunWatchRunDetails;
export declare function buildFailedLogDetails(failedJobLogs: GhFailedJobLog[]): GhRunWatchFailedLogDetails[];
export declare function renderJobsSection(jobs: GhRunJobSnapshot[]): string[];
export declare function renderFailedJobLogs(failedJobLogs: GhFailedJobLog[], options: {
    mode: "tail";
    tail: number;
} | {
    mode: "full";
}): string[];
export declare function renderRunSection(run: GhRunSnapshot): string[];
export declare function formatRunWatchSnapshot(repo: string, run: GhRunSnapshot, pollCount: number, note?: string, includeOutcome?: boolean): string;
export declare function formatRunWatchResult(repo: string, run: GhRunSnapshot, failedJobLogs: GhFailedJobLog[], tail: number, options?: {
    mode?: "tail" | "full";
}): string;
export declare function formatCommitRunWatchSnapshot(repo: string, headSha: string, branch: string | undefined, runs: GhRunSnapshot[], pollCount: number, note?: string): string;
export declare function formatCommitRunWatchResult(repo: string, headSha: string, branch: string | undefined, runs: GhRunSnapshot[], failedJobLogs: GhFailedJobLog[], tail: number, options?: {
    mode?: "tail" | "full";
}): string;
export declare function buildGhDetails(repo: string, run: GhRunSnapshot): GhToolDetails;
export declare function buildRunWatchDetails(repo: string, run: GhRunSnapshot, options?: {
    state?: GhRunWatchViewDetails["state"];
    pollCount?: number;
    note?: string;
    failedJobLogs?: GhFailedJobLog[];
}): GhToolDetails;
export declare function buildGhRunCollectionDetails(repo: string, headSha: string, branch: string | undefined, runs: GhRunSnapshot[]): GhToolDetails;
export declare function buildCommitRunWatchDetails(repo: string, headSha: string, branch: string | undefined, runs: GhRunSnapshot[], options?: {
    state?: GhRunWatchViewDetails["state"];
    pollCount?: number;
    note?: string;
    failedJobLogs?: GhFailedJobLog[];
}): GhToolDetails;
export declare function resolveGitHubBranchHead(cwd: string, repo: string, branch: string, signal?: AbortSignal): Promise<string>;
export declare function fetchRunsForCommit(cwd: string, repo: string, headSha: string, signal?: AbortSignal, completedRunJobsCache?: Map<number, GhRunJobSnapshot[]>): Promise<GhRunSnapshot[]>;
export declare function fetchRunJobs(cwd: string, repo: string, runId: number, signal?: AbortSignal): Promise<GhRunJobSnapshot[]>;
export declare function fetchRunSnapshot(cwd: string, repo: string, runId: number, signal?: AbortSignal): Promise<GhRunSnapshot>;
export declare function tailLogLines(log: string, tail: number): string | undefined;
export declare function fetchFailedJobLogs(cwd: string, repo: string, failedJobs: Array<{
    run: GhRunSnapshot;
    job: GhRunJobSnapshot;
}>, tail: number, signal?: AbortSignal): Promise<GhFailedJobLog[]>;
export declare function executeRunWatch(session: ToolSession, toolName: string, params: GithubInput, signal: AbortSignal | undefined, onUpdate: AgentToolUpdateCallback<GhToolDetails> | undefined): Promise<AgentToolResult<GhToolDetails>>;
