/**
 * Inline TUI renderers for the long-term memory tools (`retain`, `recall`,
 * `reflect`).
 *
 * These keep the transcript terse — one status line plus, for `retain`, one
 * `Remember: …` line per stored item — instead of the generic JSON arg tree,
 * which exploded multi-line memory blobs into an unreadable wall. The tool
 * container is a transparent passthrough, so these renderers stay frameless:
 * a status line with a couple of dim bullets reads far cleaner than boxing a
 * one-line memory note.
 */
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
interface RetainRenderArgs {
    items?: unknown;
}
interface QueryRenderArgs {
    query?: string;
}
export declare const retainToolRenderer: {
    inline: boolean;
    mergeCallAndResult: boolean;
    renderCall(args: RetainRenderArgs, options: RenderResultOptions, theme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: {
            count?: number;
        };
        isError?: boolean;
    }, options: RenderResultOptions, theme: Theme, args?: RetainRenderArgs): Component;
};
export declare const recallToolRenderer: {
    inline: boolean;
    mergeCallAndResult: boolean;
    renderCall(args: QueryRenderArgs, _options: RenderResultOptions, theme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        isError?: boolean;
    }, options: RenderResultOptions, theme: Theme, args?: QueryRenderArgs): Component;
};
export declare const reflectToolRenderer: {
    inline: boolean;
    mergeCallAndResult: boolean;
    renderCall(args: QueryRenderArgs, _options: RenderResultOptions, theme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        isError?: boolean;
    }, options: RenderResultOptions, theme: Theme, args?: QueryRenderArgs): Component;
};
export {};
