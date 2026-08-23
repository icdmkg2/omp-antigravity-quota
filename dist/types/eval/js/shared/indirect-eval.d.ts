/**
 * Indirect eval — runs in the host's global scope, isolating bindings declared with
 * `const`/`let` from this module's closure. Used by both the JS eval worker and the
 * browser tab worker to execute user-supplied source without `node:vm`.
 *
 * Why not vm.runInContext: Bun crashes the parent process with SIGTRAP when
 * `Worker.terminate()` fires while a worker is mid-`vm.runInContext` synchronous loop.
 * Indirect eval does not trip that bug.
 *
 * The optional `filename` is appended as a `//# sourceURL=...` pragma so V8 attributes
 * stack frames to the user cell instead of `<anonymous>`.
 */
export declare function indirectEval(source: string, filename?: string): unknown;
export declare function awaitMaybePromise<T>(value: T | Promise<T>): Promise<T>;
