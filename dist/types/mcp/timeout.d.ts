export declare function resolveMCPTimeoutMs(configTimeout?: number): number;
export declare function isMCPTimeoutEnabled(timeoutMs: number): boolean;
export declare function describeMCPTimeout(timeoutMs: number): string;
export declare function getNeverAbortSignal(): AbortSignal;
export declare function createMCPTimeout(timeoutMs: number, signal?: AbortSignal): {
    signal?: AbortSignal;
    clear: () => void;
    isTimeoutAbort: (error: unknown) => boolean;
    /** True when this operation's own timer fired (regardless of what error a consumer saw). */
    timedOut: () => boolean;
};
