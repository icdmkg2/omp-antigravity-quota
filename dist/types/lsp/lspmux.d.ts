/**
 * lspmux integration for LSP server multiplexing.
 *
 * When lspmux is available and running, this module wraps supported LSP server
 * commands to use lspmux client mode, enabling server instance sharing across
 * multiple editor windows.
 *
 * Integration is transparent: if lspmux is unavailable, falls back to direct spawning.
 */
interface LspmuxConfig {
    instance_timeout?: number;
    gc_interval?: number;
    listen?: [string, number] | string;
    connect?: [string, number] | string;
    log_filters?: string;
    pass_environment?: string[];
}
interface LspmuxState {
    available: boolean;
    running: boolean;
    binaryPath: string | null;
    config: LspmuxConfig | null;
}
/**
 * Detect lspmux availability and state.
 * Results are cached for STATE_CACHE_TTL_MS.
 *
 * Set PI_DISABLE_LSPMUX=1 to disable.
 */
export declare function detectLspmux(): Promise<LspmuxState>;
/**
 * Check if a server command is supported by lspmux.
 */
export declare function isLspmuxSupported(command: string): boolean;
export interface LspmuxWrappedCommand {
    command: string;
    args: string[];
    env?: Record<string, string>;
}
/**
 * Wrap a server command to use lspmux client mode.
 *
 * @param originalCommand - The original LSP server command (e.g., "rust-analyzer")
 * @param originalArgs - Original command arguments
 * @param state - lspmux state from detectLspmux()
 * @returns Wrapped command, args, and env vars; or original if lspmux unavailable
 */
export declare function wrapWithLspmux(originalCommand: string, originalArgs: string[] | undefined, state: LspmuxState): LspmuxWrappedCommand;
/**
 * Get lspmux-wrapped command if available, otherwise return original.
 * This is the main entry point for config.ts integration.
 *
 * @param command - Original LSP server command
 * @param args - Original command arguments
 * @returns Command and args to use (possibly wrapped with lspmux)
 */
export declare function getLspmuxCommand(command: string, args?: string[]): Promise<LspmuxWrappedCommand>;
export {};
