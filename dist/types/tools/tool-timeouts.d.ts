export interface ToolTimeoutConfig {
    /** Default timeout in seconds when agent omits the field */
    default: number;
    /** Minimum allowed timeout in seconds */
    min: number;
    /** Maximum allowed timeout in seconds (per-tool ceiling) */
    max: number;
}
export declare const TOOL_TIMEOUTS: {
    readonly bash: {
        readonly default: 300;
        readonly min: 1;
        readonly max: 3600;
    };
    readonly eval: {
        readonly default: 30;
        readonly min: 1;
        readonly max: 3600;
    };
    readonly browser: {
        readonly default: 30;
        readonly min: 1;
        readonly max: 300;
    };
    readonly computer: {
        readonly default: 120;
        readonly min: 1;
        readonly max: 300;
    };
    readonly ssh: {
        readonly default: 60;
        readonly min: 1;
        readonly max: 3600;
    };
    readonly fetch: {
        readonly default: 20;
        readonly min: 1;
        readonly max: 45;
    };
    readonly lsp: {
        readonly default: 20;
        readonly min: 5;
        readonly max: 300;
    };
    readonly debug: {
        readonly default: 30;
        readonly min: 5;
        readonly max: 300;
    };
};
export type ToolWithTimeout = keyof typeof TOOL_TIMEOUTS;
/**
 * Clamp a raw timeout to the allowed range for a tool.
 *
 * When `rawTimeout` is undefined the tool's `default` is used. A positive
 * `maxTimeout` (the `tools.maxTimeout` global ceiling) caps the *resolved*
 * value — including the default-fallback path — before the per-tool `min`/`max`
 * floor and ceiling apply, so a configured global cap governs calls where the
 * agent omits `timeout`, not only explicitly-passed values. `maxTimeout <= 0`
 * means no global cap.
 */
export declare function clampTimeout(tool: ToolWithTimeout, rawTimeout?: number, maxTimeout?: number): number;
