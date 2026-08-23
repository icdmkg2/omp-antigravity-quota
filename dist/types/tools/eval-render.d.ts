/**
 * TUI rendering for the eval tool.
 *
 * Split out from `eval.ts` so the renderer can be imported by `renderers.ts`
 * without dragging the eval *runtime* (JS/Python/Ruby/Julia backends ->
 * agent bridge -> task executor -> sdk -> extension loader -> root barrel)
 * into the renderer module graph. That transitive chain re-enters
 * `renderers.ts` while `eval.ts` is still initializing, which previously
 * crashed module load with a TDZ `Cannot access 'evalToolRenderer' before
 * initialization`.
 */
import type { Component } from "@oh-my-pi/pi-tui";
import type { EvalStatusEvent, EvalToolDetails } from "../eval/types.js";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import { type Theme } from "../modes/theme/theme.js";
export declare const EVAL_DEFAULT_PREVIEW_LINES = 10;
interface EvalRenderCellArg {
    language?: string;
    code?: string;
    title?: string;
}
interface EvalRenderArgs {
    language?: string;
    code?: string;
    title?: string;
    cells?: EvalRenderCellArg[];
    __partialJson?: string;
}
interface EvalRenderContext {
    output?: string;
    expanded?: boolean;
    previewLines?: number;
    timeout?: number;
}
/**
 * Append or replace a status event. `agent` events are progress snapshots keyed
 * by `id`, so they coalesce in place (preserving first-seen order); every other
 * op is a discrete action and simply appends. Keeps the persisted event list
 * bounded even when a subagent emits hundreds of throttled progress ticks.
 */
export declare function upsertStatusEvent(events: EvalStatusEvent[], event: EvalStatusEvent): void;
export declare const evalToolRenderer: {
    animatedPendingPreview: boolean;
    animatedPartialResult: boolean;
    renderCall(args: EvalRenderArgs, options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: EvalToolDetails;
    }, options: RenderResultOptions & {
        renderContext?: EvalRenderContext;
    }, uiTheme: Theme, _args?: EvalRenderArgs): Component;
    mergeCallAndResult: boolean;
    inline: boolean;
};
export {};
