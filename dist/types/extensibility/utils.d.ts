import type { HookUIContext } from "./hooks/types.js";
/**
 * Resolve a file path:
 * - Absolute paths used as-is
 * - Paths starting with ~ expanded to home directory
 * - Relative paths resolved from cwd
 */
export declare function resolvePath(filePath: string, cwd: string): string;
/**
 * Create a no-op UI context for headless modes.
 */
export declare function createNoOpUIContext(): HookUIContext;
/**
 * Raised by {@link withHostGuard} when a guarded callback synchronously
 * attempts to terminate the host process. Callers catch this like any other
 * load-time failure so the extension/hook is skipped with a logged error
 * instead of taking the CLI down with it.
 */
export declare class ExtensionExitError extends Error {
    readonly alias: string;
    readonly code: number | string | undefined;
    constructor(code: number | string | undefined, alias?: string);
}
export declare function withHostGuard<T>(fn: () => Promise<T>): Promise<T>;
