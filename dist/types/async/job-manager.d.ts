/** Abort reason used only when the owning session shuts down the entire manager. */
export declare const ASYNC_JOB_MANAGER_SHUTDOWN_REASON: unique symbol;
/** Kind of work a managed job runs; drives job-row badges and delivery labels. */
export type AsyncJobType = "bash" | "task" | "eval";
export interface AsyncJob {
    id: string;
    type: AsyncJobType;
    status: "running" | "completed" | "failed" | "cancelled";
    startTime: number;
    label: string;
    abortController: AbortController;
    promise: Promise<void>;
    resultText?: string;
    errorText?: string;
    /** Latest tool-render details reported by the running job. */
    latestDetails?: Record<string, unknown>;
    /**
     * Registry id of the agent that registered the job (e.g. "Main",
     * "AuthLoader"). Used by scoped cancel/list APIs so a subagent's teardown
     * does not cancel its parent's jobs. Undefined for callers that don't
     * supply an id (e.g. legacy tests, SDK consumers without an agent context).
     */
    ownerId?: string;
    /**
     * Registry id of the subagent this job runs (task/tan/vibe jobs). Lets
     * job-view code link a job row to its AgentRegistry ref even when the job
     * id differs from the agent id (vibe turn jobs, tan clones).
     */
    agentId?: string;
    /**
     * Job is registered but parked behind a caller-managed gate (e.g. a task
     * batch semaphore). Queued jobs do not count toward the running-job limit
     * until the caller invokes `markRunning()` from the run context.
     */
    queued?: boolean;
}
/** Delivery callback for a settled job's result text. */
export type AsyncJobDeliverySink = (jobId: string, text: string, job?: AsyncJob) => void | Promise<void>;
export interface AsyncJobManagerOptions {
    /**
     * Delivery sink for UNOWNED completions (jobs registered without an
     * `ownerId`). Owned deliveries route exclusively through
     * {@link AsyncJobManager.registerDeliverySink}; when the owner has no live
     * sink they are dead-lettered (dropped with a warning; the job row keeps
     * the result text until retention eviction) — never routed here, which
     * would leak one agent's result into another session.
     */
    onJobComplete?: AsyncJobDeliverySink;
    maxRunningJobs?: number;
    retentionMs?: number;
}
export interface AsyncJobDeliveryState {
    queued: number;
    delivering: boolean;
    nextRetryAt?: number;
    pendingJobIds: string[];
}
export interface AsyncJobReapResult {
    settled: boolean;
    pendingJobIds: string[];
    completion: Promise<void>;
}
export interface AsyncJobRegisterOptions {
    id?: string;
    /** Registry id of the agent that owns this job; used to scope cancelAll. */
    ownerId?: string;
    /** Registry id of the subagent this job runs; see {@link AsyncJob.agentId}. */
    agentId?: string;
    onProgress?: (text: string, details?: Record<string, unknown>) => void | Promise<void>;
    /** Register the job in queued state; see {@link AsyncJob.queued}. */
    queued?: boolean;
}
/**
 * Filter applied to job query/cancel APIs. With `ownerId`, results are
 * restricted to jobs registered by that agent (registry id from
 * `AgentRegistry`, e.g. "Main", "AuthLoader").
 */
export interface AsyncJobFilter {
    ownerId?: string;
}
export declare class AsyncJobManager {
    #private;
    /** Process-global instance shared by internal URL protocol handlers and tools. */
    static instance(): AsyncJobManager | undefined;
    /** Install or clear the process-global instance. */
    static setInstance(value: AsyncJobManager | undefined): void;
    /** Reset the process-global instance. Test-only. */
    static resetForTests(): void;
    constructor(options: AsyncJobManagerOptions);
    /** True when the running-job count has reached the configured cap. */
    get atCapacity(): boolean;
    register(type: AsyncJobType, label: string, run: (ctx: {
        jobId: string;
        signal: AbortSignal;
        reportProgress: (text: string, details?: Record<string, unknown>) => Promise<void>;
        /** Clear the queued flag once the job actually starts executing. */
        markRunning: () => void;
    }) => Promise<string>, options?: AsyncJobRegisterOptions): string;
    /**
     * Cancel a single job by id. When `filter.ownerId` is set and does not
     * match the job's owner, the call is treated as not-found (returns false)
     * so cross-agent cancellation is rejected at the manager level.
     */
    cancel(id: string, filter?: AsyncJobFilter): boolean;
    getJob(id: string): AsyncJob | undefined;
    getRunningJobs(filter?: AsyncJobFilter): AsyncJob[];
    getRecentJobs(limit?: number, filter?: AsyncJobFilter): AsyncJob[];
    getAllJobs(filter?: AsyncJobFilter): AsyncJob[];
    getDeliveryState(filter?: AsyncJobFilter): AsyncJobDeliveryState;
    hasPendingDeliveries(filter?: AsyncJobFilter): boolean;
    watchJobs(jobIds: string[]): number;
    unwatchJobs(jobIds: string[]): number;
    /**
     * Compute the next adaptive ("smart") wait (ms) for a blocking `hub` wait by
     * the given owner. Consecutive polls — those starting within
     * POLL_ESCALATION_RESET_MS of the previous poll returning — climb
     * POLL_WAIT_LADDER_MS so a tight wait loop backs off; a longer gap means the
     * agent left to do real work, so the wait resets to the floor. Pair each call
     * with `recordPollWaitEnd()` once the wait returns.
     */
    nextPollWaitMs(ownerId: string | undefined, now?: number): number;
    /**
     * Mark a blocking poll wait as finished so the idle-reset window is measured
     * from now. Polling again before POLL_ESCALATION_RESET_MS elapses keeps
     * climbing the ladder; waiting longer resets it to the floor.
     */
    recordPollWaitEnd(ownerId: string | undefined, now?: number): void;
    acknowledgeDeliveries(jobIds: string[]): number;
    /**
     * Lift a foreground-wait suppression set via `acknowledgeDeliveries`. If the
     * job already finished while suppressed (its delivery enqueue was skipped),
     * re-enqueue the completion so the result is still delivered exactly once.
     */
    resumeDeliveries(jobIds: string[]): void;
    /**
     * Cancel running jobs. With `filter.ownerId` set, cancels only jobs the
     * matching agent registered; with no filter, cancels every running job
     * (used by `dispose()` to nuke the manager's state).
     *
     * `reason` is forwarded to each job's `AbortController.abort`, so a session
     * teardown can tag its owned jobs with {@link ASYNC_JOB_MANAGER_SHUTDOWN_REASON}
     * before `dispose()` runs — the task executor reads it to park (not
     * tombstone) a subagent interrupted purely by process shutdown.
     */
    cancelAll(filter?: AsyncJobFilter, reason?: unknown): void;
    /**
     * Immediately evict completed and failed jobs matching the filter instead of
     * waiting for retention expiry, dropping every queued delivery so a prior
     * session's result can never be injected into a later transcript. Returns the
     * number of jobs evicted.
     *
     * A delivery whose sink call is already in flight (or drained onto a caller's
     * yield queue) is guarded by the owner's delivery generation, not the per-id
     * suppression marker — that marker is cleared when the id is reused.
     */
    evictCompletedJobs(filter?: AsyncJobFilter): number;
    waitForAll(): Promise<void>;
    /**
     * Route completions for jobs owned by `ownerId` to `sink`. Sessions register
     * their own sink at construction and unregister on dispose. Owned deliveries
     * with no live sink are dead-lettered — `onJobComplete` serves only unowned
     * deliveries.
     *
     * Last registration wins for an owner id; the returned unregister clears the
     * mapping only while it still points at `sink`, so a revived session's fresh
     * registration survives its parked predecessor's late cleanup.
     */
    registerDeliverySink(ownerId: string, sink: AsyncJobDeliverySink): () => void;
    /**
     * Wait until every job owned by `ownerId` has settled — its run promise
     * resolved, which for cancelled jobs means the underlying process actually
     * exited. Jobs registered while waiting (e.g. by a follow-up turn) are
     * awaited too. Returns false when `timeoutMs` elapses first.
     *
     * `excludeSuppressed` skips jobs whose delivery is suppressed (acknowledged
     * or `hub`-watched): those can never re-wake a run, so quiescence barriers
     * pass it to share one contract with the pending-async-wake predicate.
     * Teardown reaps omit it — worktree safety concerns every owner process.
     */
    waitForOwnerJobs(ownerId: string, options?: {
        timeoutMs?: number;
        excludeSuppressed?: boolean;
    }): Promise<boolean>;
    /**
     * Cancel every job owned by `ownerId`, then wait only until `deadlineAt`.
     * The returned completion keeps waiting for actual process settlement when
     * the deadline expires, so callers can move that cleanup out of the
     * user-visible Task wait without losing ownership of the live work.
     */
    cancelAndReapOwnerJobs(ownerId: string, deadlineAt: number): Promise<AsyncJobReapResult>;
    drainDeliveries(options?: {
        timeoutMs?: number;
        filter?: AsyncJobFilter;
    }): Promise<boolean>;
    dispose(options?: {
        timeoutMs?: number;
    }): Promise<boolean>;
    isDeliverySuppressed(jobId: string): boolean;
}
