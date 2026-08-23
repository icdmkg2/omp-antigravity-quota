import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
interface InspectImageRenderArgs {
    path?: string;
    question?: string;
}
interface InspectImageRendererDetails {
    model: string;
    imagePath: string;
    mimeType: string;
}
interface InspectImageRendererResult {
    content: Array<{
        type: string;
        text?: string;
    }>;
    details?: InspectImageRendererDetails;
    isError?: boolean;
}
export declare const inspectImageToolRenderer: {
    renderCall(args: InspectImageRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: InspectImageRendererResult, options: RenderResultOptions, uiTheme: Theme, args?: InspectImageRenderArgs): Component;
    mergeCallAndResult: boolean;
};
export {};
