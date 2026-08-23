import type { SpecialHandler } from "./types.js";
interface GitHubUrl {
    type: "blob" | "tree" | "repo" | "commit" | "issue" | "issues" | "pull" | "pulls" | "discussion" | "discussions" | "actions-run" | "actions-job" | "other";
    owner: string;
    repo: string;
    ref?: string;
    path?: string;
    number?: number;
    runId?: number;
    jobId?: number;
}
/**
 * Parse GitHub URL into components
 */
export declare function parseGitHubUrl(url: string): GitHubUrl | null;
/**
 * Fetch from GitHub API
 */
export declare function fetchGitHubApi(endpoint: string, timeout: number, signal?: AbortSignal): Promise<{
    data: unknown;
    ok: boolean;
}>;
/**
 * Strip the per-line ISO-8601 timestamp prefix GitHub prepends to every job log line.
 * Cuts ~28 bytes/line of noise while preserving the message text. Also drops the leading
 * UTF-8 BOM GitHub puts at the start of the log file (otherwise the first line's timestamp
 * survives because `^` no longer sits before a digit).
 */
export declare function stripActionsLogTimestamps(logs: string): string;
/**
 * Handle GitHub URLs specially
 */
export declare const handleGitHub: SpecialHandler;
export {};
