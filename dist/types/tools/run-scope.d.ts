/** Associates a browser operation failure with its owning evaluated run. */
export declare function markBrowserRunRejection<T>(reason: T, owner: object): T;
/** Returns whether a rejection was marked for the specified evaluated run. */
export declare function isBrowserRunRejection(reason: unknown, owner: object): boolean;
/** Returns whether a rejection belongs to the marked browser run or its evaluated source file. */
export declare function isBrowserRunOwnedRejection(reason: unknown, owner: object, filename: string): boolean;
type FloatingRejectionHandler = (reason: unknown) => void;
/**
 * Observes native promise-combinator results derived from browser promises for
 * the duration of one evaluated run. Native `await` remains unchanged; dropped
 * user continuations from `Promise.all` and `Promise.race` are routed to the
 * owning run.
 */
export declare function withBrowserPromiseCombinatorTracking<T>(owner: object, onFloatingRejection: FloatingRejectionHandler, run: () => Promise<T>): Promise<T>;
/**
 * Observes every explicit continuation of a browser promise without replacing
 * the native promise. Browser failures remain contained; an unhandled error
 * created by user continuation code is reported to the owning run.
 */
export declare function observeBrowserRunPromise<T>(promise: Promise<T>, owner: object, onFloatingRejection: FloatingRejectionHandler): Promise<T>;
/**
 * Installs worker-realm rejection routing. Consumed browser-run failures stay in
 * the worker; unrelated failures retain the default fatal worker behavior.
 */
export declare function installBrowserWorkerRejectionGuard(consume: (reason: unknown) => boolean): () => void;
/**
 * Marks a run-scoped promise as observed without changing its behavior for awaited callers.
 *
 * Run teardown aborts can reject promises created for evaluated code after user code
 * has stopped observing them (for example fire-and-forget `wait()`/facade calls). In 16.3.0
 * those zero-consumer rejections reached the process-level `unhandledRejection` handler and
 * killed every subagent sharing the process (issues #4499/#4672). Attaching a no-op rejection
 * handler at creation makes the promise observed while returning the original promise so callers
 * that do await it still receive the rejection.
 */
export declare function markHandled<T>(promise: Promise<T>): Promise<T>;
/** Headroom subtracted from the cell budget so an in-run deadline fires before the opaque whole-cell timeout. */
export declare const CELL_BUDGET_SLACK_MS = 1000;
/** Default poll deadline for `wait(predicate)` before clamping to the cell budget. */
export declare const DEFAULT_PREDICATE_TIMEOUT_MS = 30000;
/** Options for the predicate form of the run-scoped `wait()` helper. */
export interface WaitPredicateOptions {
    /** Max time to poll before failing, in ms (default 30s, clamped to the cell budget). */
    timeout?: number;
    /** Poll interval in ms (default 100, floor 10). */
    interval?: number;
}
/**
 * Effective `wait(predicate)` deadline for a given cell budget. Always strictly below
 * the cell budget so the named `wait(predicate) timed out` error wins the race against
 * the opaque whole-cell execution timeout. `0`/`Infinity` ("disable") map to the largest
 * bounded deadline; negative/NaN garbage falls back to the default.
 */
export declare function resolvePredicateTimeout(cellTimeoutMs: number, explicit?: number): number;
/**
 * Run-scoped `wait()` helper for evaluated code (browser and computer workers), honoring
 * the owning run's cancellation signal.
 *
 * - `wait(ms)` sleeps for `ms` milliseconds.
 * - `wait(fn, { timeout?, interval? })` polls `fn` (sync or async) until it returns a
 *   truthy value and resolves with that value; throws a named `ToolError` on timeout
 *   instead of stalling into the whole-cell deadline. Predicate errors propagate.
 */
export declare function waitForRun(msOrPredicate: number | (() => unknown), signal: AbortSignal, opts?: WaitPredicateOptions): Promise<unknown>;
/** Binds a long-lived scope facade (page/tab/desktop objects) to one evaluated run's abort signal. */
export declare function bindRunFacade<T extends object>(target: T, signal: AbortSignal, rejectionOwner?: object, onFloatingRejection?: FloatingRejectionHandler): T;
export {};
