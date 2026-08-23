/**
 * TUI renderer for the browser tool.
 *
 * Mirrors the `eval` tool look: each `run` invocation is shown as a JS code
 * cell with status icon, optional output, and expand/collapse handling. `open`
 * and `close` actions render as compact status lines.
 */
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../../extensibility/custom-tools/types.js";
import type { Theme } from "../../modes/theme/theme.js";
import type { BrowserToolDetails } from "../browser.js";
interface BrowserRenderArgs {
    action?: "open" | "close" | "run";
    name?: string;
    url?: string;
    code?: string;
    all?: boolean;
    kill?: boolean;
    app?: {
        path?: string;
        cdp_url?: string;
        relay?: boolean;
        target?: string;
        cmux?: boolean;
        surface?: string;
    };
    viewport?: {
        width: number;
        height: number;
        scale?: number;
    };
    timeout?: number;
}
interface BrowserRenderContext {
    expanded?: boolean;
    previewLines?: number;
}
export declare const browserToolRenderer: {
    animatedPendingPreview: (args: unknown) => boolean;
    animatedPartialResult: (args: unknown) => boolean;
    renderCall(args: BrowserRenderArgs, options: RenderResultOptions, theme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: BrowserToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions & {
        renderContext?: BrowserRenderContext;
    }, theme: Theme, args?: BrowserRenderArgs): Component;
    mergeCallAndResult: boolean;
    inline: boolean;
};
export {};
