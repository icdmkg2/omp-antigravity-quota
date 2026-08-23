import { type Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
import type { GhToolDetails } from "./gh.js";
type GithubToolRenderArgs = {
    op?: string;
    run?: string;
    branch?: string;
    repo?: string;
    pr?: string | string[];
    query?: string;
};
export declare const githubToolRenderer: {
    renderCall(args: GithubToolRenderArgs, options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: GhToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions, uiTheme: Theme, args?: GithubToolRenderArgs): Component;
    mergeCallAndResult: boolean;
};
export {};
