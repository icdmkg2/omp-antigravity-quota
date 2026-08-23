/** Marker file written into a task-isolation base dir identifying its owner. */
export declare const ISOLATION_OWNER_FILE = ".omp-isolation-owner.json";
/** Recorded owner of a task-isolation sandbox. */
export interface IsolationOwner {
    /** PID of the omp process that created and owns the sandbox. */
    pid: number;
    /** Task id the sandbox was materialised for. */
    id: string;
    /**
     * Process-instance start-time token for {@link pid}, when the OS can report
     * it. Distinguishes the owning process from an unrelated process that later
     * inherits a recycled pid, so a crashed sandbox is never pinned live.
     */
    startToken?: string;
}
/**
 * Record the current process as owner of the sandbox rooted at `baseDir`.
 *
 * Written before the isolation backend materialises `m` so a concurrent
 * `omp worktree clear` never sees an owner-less sandbox mid-creation.
 */
export declare function writeIsolationOwner(baseDir: string, id: string): Promise<void>;
/**
 * Whether a live omp process still owns the sandbox at `baseDir`.
 *
 * A missing or malformed marker means no verifiable owner — a crashed run or a
 * sandbox from before markers existed, both safe to reclaim. `process.kill(pid,
 * 0)` can fail with `EPERM` even when the process is alive, so only an explicit
 * `ESRCH` ("no such process") counts as dead; any other error is treated as
 * alive to avoid deleting a sandbox that is actually in use. When the marker
 * carries a {@link IsolationOwner.startToken}, a live pid whose current token no
 * longer matches is a recycled pid — a different process — and counts as dead.
 */
export declare function hasLiveIsolationOwner(baseDir: string): Promise<boolean>;
