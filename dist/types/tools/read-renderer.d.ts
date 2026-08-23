import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import { type Theme } from "../modes/theme/theme.js";
import type { ReadToolDetails } from "./read.js";
interface ReadRenderArgs {
    path?: unknown;
    file_path?: unknown;
    offset?: number;
    limit?: number;
    raw?: boolean;
}
export declare const readToolRenderer: {
    renderCall(args: ReadRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: ReadToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions, uiTheme: Theme, args?: ReadRenderArgs): Component;
    mergeCallAndResult: boolean;
};
export {};
