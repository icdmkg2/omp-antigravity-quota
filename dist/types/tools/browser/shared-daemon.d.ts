/** Broker-owned browser endpoint one omp process can attach to. */
export interface SharedBrowserEndpoint {
    wsEndpoint: string;
    daemonName: string;
    /** Canonical project directory owning the broker (used to address later stop requests). */
    projectDir: string;
}
/** Stable broker daemon name for the shared automation browser. */
export declare function sharedBrowserDaemonName(headless: boolean): string;
/**
 * Ensure the project-shared automation Chromium is running and reachable,
 * launching it under the daemon broker when needed. Idempotent across
 * processes: losers of the start race adopt the winner's endpoint on the next
 * describe round. Returns null when the shared path is unavailable (no
 * resolvable Chromium, broker failure, or a daemon that never becomes
 * reachable); callers fall back to a process-local launch.
 */
export declare function ensureSharedBrowser(opts: {
    projectDir: string;
    headless: boolean;
    viewport?: {
        width: number;
        height: number;
    };
    signal?: AbortSignal;
}): Promise<SharedBrowserEndpoint | null>;
