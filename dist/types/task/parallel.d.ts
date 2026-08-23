/**
 * Parallel execution with concurrency control.
 */
/** Result of parallel execution */
export interface ParallelResult<R> {
    /** Results array - undefined entries indicate tasks that were skipped due to abort */
    results: (R | undefined)[];
    /** Whether execution was aborted before all tasks completed */
    aborted: boolean;
}
/**
 * Execute items with a concurrency limit using a worker pool pattern.
 * Results are returned in the same order as input items.
 *
 * On abort: returns partial results with `aborted: true`. Completed tasks are preserved,
 * in-progress tasks will complete with their abort handling, skipped tasks are `undefined`.
 *
 * On error: fails fast - does not wait for other workers to complete.
 *
 * @param items - Items to process
 * @param concurrency - Maximum concurrent operations
 * @param fn - Async function to execute for each item; receives a worker signal that fires on abort or fail-fast so in-flight siblings can cancel
 * @param signal - Optional abort signal to stop scheduling new work
 */
export declare function mapWithConcurrencyLimit<T, R>(items: T[], concurrency: number, fn: (item: T, index: number, signal: AbortSignal) => Promise<R>, signal?: AbortSignal): Promise<ParallelResult<R>>;
/** Result of a concurrency-limited operation that waits for every launched item. */
export interface ParallelSettledResult<R> {
    /** Settled results in original input order; absent entries were never launched after cancellation. */
    results: (PromiseSettledResult<R> | undefined)[];
    /** Whether cancellation prevented scheduling all items. */
    aborted: boolean;
}
/**
 * Execute items with a concurrency limit without failing fast. Rejections are
 * captured at their input position and already launched siblings always settle
 * before this function returns. Cancellation stops new launches but preserves
 * the settled state of every item that began.
 */
export declare function mapWithConcurrencyLimitAllSettled<T, R>(items: T[], concurrency: number, fn: (item: T, index: number, signal: AbortSignal) => Promise<R>, signal?: AbortSignal): Promise<ParallelSettledResult<R>>;
/**
 * Simple counting semaphore for limiting concurrency across independently-scheduled async work.
 *
 * `max <= 0` (or any non-finite input) means unbounded — every `acquire()` resolves
 * immediately — matching `task.maxConcurrency = 0`'s "Unlimited" semantics in the
 * settings UI ([#3305](https://github.com/can1357/oh-my-pi/issues/3305)).
 */
export declare function normalizeConcurrencyLimit(max: number): number;
export declare class Semaphore {
    #private;
    constructor(max: number);
    /**
     * Resolves when a slot is available. Pass an `AbortSignal` so callers that
     * stop waiting (parent task cancelled, wall-clock budget elapsed) also stop
     * occupying a queue slot — otherwise a later `release()` would resolve the
     * abandoned waiter, permanently shrinking effective concurrency for the
     * remaining lifetime of the process (issue #3464 review feedback).
     */
    acquire(signal?: AbortSignal): Promise<void>;
    release(): void;
    /**
     * Adjust the maximum concurrency in place. Raising the ceiling immediately
     * admits queued waiters that now fit; lowering it lets in-flight holders
     * drain naturally (new acquires keep blocking until `#current` falls below
     * the new max). Resizing the single shared instance — instead of replacing
     * it — keeps in-flight slots counted, so a runtime or mixed limit change can
     * never push concurrency past the cap (issue #3464 review feedback).
     */
    resize(max: number): void;
}
