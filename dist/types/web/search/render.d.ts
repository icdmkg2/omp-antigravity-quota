/**
 * Web Search TUI Rendering
 *
 * Tree-based rendering with collapsed/expanded states for web search results.
 */
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../../extensibility/custom-tools/types.js";
import { type Theme } from "../../modes/theme/theme.js";
import type { SearchResponse } from "./types.js";
export interface SearchRenderDetails {
    response: SearchResponse;
    error?: string;
}
/** Render web search result with tree-based layout */
export declare function renderSearchResult(result: {
    content: Array<{
        type: string;
        text?: string;
    }>;
    details?: SearchRenderDetails;
}, options: RenderResultOptions, theme: Theme, args?: {
    query?: string;
    maxAnswerLines?: number;
}): Component;
/** Render web search call (query preview) */
export declare function renderSearchCall(args: {
    query?: string;
    [key: string]: unknown;
}, _options: RenderResultOptions, theme: Theme): Component;
export declare const webSearchToolRenderer: {
    renderCall: typeof renderSearchCall;
    renderResult: typeof renderSearchResult;
    mergeCallAndResult: boolean;
};
