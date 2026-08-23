import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
interface ComputerRenderArgs {
    code?: unknown;
    read_only?: unknown;
    window?: unknown;
    actions?: unknown;
}
interface ComputerRenderResult {
    content?: Array<{
        type: string;
        text?: string;
    }>;
    details?: unknown;
    isError?: boolean;
}
/** Renders computer scripts, run state, screenshots, and failures in the TUI. */
export declare const computerToolRenderer: {
    mergeCallAndResult: boolean;
    renderCall(args: ComputerRenderArgs, options: RenderResultOptions, theme: Theme): Component;
    renderResult(result: ComputerRenderResult, options: RenderResultOptions, theme: Theme, args?: ComputerRenderArgs): Component;
};
export {};
