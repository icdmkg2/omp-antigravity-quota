/**
 * Watchdog for eval cell work.
 *
 * A cell's `timeout` bounds time while the Python kernel or JS VM is in control.
 * Host-side bridge calls can {@link pause} the watchdog so delegated
 * `agent()`/`parallel()`/`completion()` work is ignored completely, then {@link resume}
 * starts a fresh timeout window once the runtime gets control back.
 *
 * Pause is reference-counted because `parallel()` can have multiple bridge calls
 * in flight at once.
 */
export declare class IdleTimeout {
    #private;
    constructor(idleMs: number);
    /** Aborts with a `TimeoutError` reason once the active timeout window is exhausted. */
    get signal(): AbortSignal;
    /** Configured active timeout window in milliseconds. */
    get idleMs(): number;
    /** Suspend timeout accounting while control is delegated to host-side work. */
    pause(): void;
    /** Resume timeout accounting with a fresh timeout window. */
    resume(): void;
    /** Stop the watchdog. Safe to call multiple times. */
    dispose(): void;
    [Symbol.dispose](): void;
}
