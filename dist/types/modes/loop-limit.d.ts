export type LoopLimitConfig = {
    kind: "iterations";
    iterations: number;
} | {
    kind: "duration";
    durationMs: number;
};
export type LoopLimitRuntime = {
    kind: "iterations";
    initial: number;
    remaining: number;
} | {
    kind: "duration";
    durationMs: number;
    deadlineMs: number;
};
export interface ParsedLoopArgs {
    /** Iteration/duration budget, when the user supplied a leading limit token. */
    limit?: LoopLimitConfig;
    /** Inline loop prompt: text after the limit, or the whole argument when no limit was given. */
    prompt?: string;
}
/**
 * Parse `/loop` arguments into an optional leading limit plus an optional inline
 * prompt. A token that *looks* like a limit (starts with a digit or sign) but
 * fails to parse is a hard error; anything else is treated as prompt text, so
 * plain prose after `/loop` keeps starting an unbounded loop instead of erroring
 * (the pre-arg-parsing behavior). Returns the error message string on failure.
 */
export declare function parseLoopLimitArgs(args: string): ParsedLoopArgs | string;
export declare function createLoopLimitRuntime(config: LoopLimitConfig | undefined, nowMs?: number): LoopLimitRuntime | undefined;
export declare function consumeLoopLimitIteration(limit: LoopLimitRuntime | undefined, nowMs?: number): boolean;
export declare function isLoopDurationExpired(limit: LoopLimitRuntime | undefined, nowMs?: number): boolean;
export declare function describeLoopLimit(config: LoopLimitConfig): string;
export declare function describeLoopLimitRuntime(limit: LoopLimitRuntime): string;
