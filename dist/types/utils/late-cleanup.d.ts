/** Keep timed-out cleanup reachable until its resources really settle. */
export declare function trackLateCleanup(work: Promise<void>, context: Record<string, unknown>): void;
