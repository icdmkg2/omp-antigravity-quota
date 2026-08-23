/**
 * Standardized error types for tool execution.
 *
 * Tools should throw these instead of returning error text.
 * The agent loop catches and renders them appropriately.
 */
/**
 * Base error for tool execution failures.
 * Override render() for custom LLM-facing formatting.
 */
export declare class ToolError extends Error {
    readonly context?: Record<string, unknown> | undefined;
    constructor(message: string, context?: Record<string, unknown> | undefined);
    /** Render error for LLM consumption. Override for custom formatting. */
    render(): string;
}
/**
 * Error thrown when a tool operation is aborted (e.g., via AbortSignal).
 */
export declare class ToolAbortError extends Error {
    static readonly MESSAGE = "Operation aborted";
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * Throw ToolAbortError if the signal is aborted.
 * Use this instead of signal?.throwIfAborted() to get consistent error types.
 */
export declare function throwIfAborted(signal?: AbortSignal): void;
/**
 * Render an error for LLM consumption.
 * Handles ToolError.render() and falls back to message/string.
 */
export declare function renderError(e: unknown): string;
