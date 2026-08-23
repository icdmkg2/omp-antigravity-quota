/**
 * Task tool renderer export.
 *
 * Separated from render.ts to avoid circular dependency issues with
 * tools/renderers.ts. This module has no side effects and can be safely
 * imported without triggering the subprocessToolRegistry registration.
 */
import { renderCall, renderResult } from "./render.js";
export declare const taskToolRenderer: {
    readonly renderCall: typeof renderCall;
    readonly renderResult: typeof renderResult;
    readonly mergeCallAndResult: true;
};
