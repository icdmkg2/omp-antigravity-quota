/**
 * Shared foreground-wait helpers for tools that auto-background long-running
 * work as {@link AsyncJobManager} jobs (bash commands, eval cells): the
 * LLM-facing background notice, the threshold-vs-timeout wait budget, and the
 * settlement race against abort/steering signals.
 */
/** Default foreground-wait threshold before a tool call auto-backgrounds. */
export declare const DEFAULT_AUTO_BACKGROUND_THRESHOLD_MS = 60000;
/** LLM-facing footer appended when a tool call is converted into a background job. */
export declare function formatBackgroundNotice(jobId: string): string;
/**
 * How long a tool foreground-waits before backgrounding. Bounded by the call's
 * own timeout minus a small buffer so a deadline expiry resolves inline instead
 * of backgrounding moments before it fires. `0` means background immediately.
 */
export declare function resolveAutoBackgroundWaitMs(thresholdMs: number, timeoutMs: number | undefined): number;
/** Non-settled outcomes of {@link raceJobSettlement}. */
export type JobWaitInterrupt = {
    kind: "running";
} | {
    kind: "steer";
} | {
    kind: "aborted";
};
/**
 * Race a managed job's settlement against the auto-background threshold, the
 * caller's abort signal, and the turn's steering signal. Returns the job's own
 * completion when it settles first; otherwise reports why the wait ended:
 * "running" = threshold elapsed (background it), "steer" = a queued message
 * arrived mid-wait, "aborted" = the caller cancelled.
 */
export declare function raceJobSettlement<C>(completion: Promise<C>, thresholdMs: number, signal?: AbortSignal, steeringSignal?: AbortSignal): Promise<C | JobWaitInterrupt>;
