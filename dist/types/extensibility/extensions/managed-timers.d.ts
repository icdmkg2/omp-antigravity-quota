/** Callback invoked when a managed timer's callback throws or rejects. */
export type ManagedTimerErrorHandler = (event: string, error: string, stack?: string) => void;
export declare class ManagedTimers {
    #private;
    private readonly onError;
    constructor(onError: ManagedTimerErrorHandler);
    /** Schedule a repeating callback whose throws are contained. */
    setInterval(callback: (...args: unknown[]) => void, ms?: number, ...args: unknown[]): Timer;
    /** Schedule a one-shot callback whose throws are contained. Deregisters after it fires. */
    setTimeout(callback: (...args: unknown[]) => void, ms?: number, ...args: unknown[]): Timer;
    /** Clear one managed timer. Accepts an interval or timeout handle. */
    clear(timer: Timer): void;
    /** Clear every outstanding managed timer. Called on session teardown. */
    clearAll(): void;
}
