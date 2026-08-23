import { type HelperBundle } from "./helpers.js";
import type { JsDisplayOutput } from "./types.js";
/**
 * Per-run callbacks. Runtime globals resolve these from AsyncLocalStorage so
 * overlapping async cells can route output/tool calls back to their own run.
 */
export interface RuntimeHooks {
    onText(chunk: string): void;
    onDisplay(output: JsDisplayOutput): void;
    callTool(name: string, args: unknown): Promise<unknown>;
}
export interface RunContext {
    runId: string;
    hooks: RuntimeHooks;
    cwd: string;
    finalExpressionSet: boolean;
    finalExpressionValue: unknown;
}
export interface RuntimeOptions {
    initialCwd: string;
    sessionId: string;
    /**
     * Extra globals installed alongside `__omp_helpers__` / prelude. Use for stable, lifetime-
     * of-the-worker bindings (e.g. browser's `page`, `browser`). Per-run scope should be set
     * via `setRunScope()` instead.
     */
    extraGlobals?: Record<string, unknown>;
    /**
     * On-disk roots the helpers substitute for internal-URL schemes (e.g.
     * `{ local: "/…/artifacts/local" }`). Stable for the worker's lifetime.
     */
    localRoots?: Record<string, string>;
}
/**
 * Shared JS runtime for the eval worker and the browser tab worker. Owns the prelude,
 * helper bag, console bridge, and indirect-eval execution. Emits text/display/tool-call
 * back through `RuntimeHooks` that the embedder supplies — wire format is the embedder's
 * concern.
 */
export declare class JsRuntime {
    #private;
    readonly helpers: HelperBundle;
    readonly sessionId: string;
    constructor(opts: RuntimeOptions);
    get cwd(): string;
    setCwd(cwd: string): void;
    /**
     * Install per-run globals. Intended for run-scoped state (browser's `tab`, `display`
     * overrides, etc.). Overwrites previous assignments — caller is responsible for any
     * cleanup it wants.
     */
    setRunScope(scope: Record<string, unknown>): void;
    run(code: string, filename: string | undefined, hooks: RuntimeHooks, options?: {
        runId?: string;
        cwd?: string;
    }): Promise<unknown>;
    displayValue(value: unknown, hooks?: RuntimeHooks | undefined): void;
    dispose(): void;
}
