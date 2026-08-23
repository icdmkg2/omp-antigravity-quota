/**
 * LSP Tool TUI Rendering
 *
 * Renders LSP tool calls and results in the TUI with:
 * - Syntax-highlighted hover information
 * - Color-coded diagnostics by severity
 * - Grouped references and symbols
 * - Collapsible/expandable views
 */
import type { RenderResultOptions } from "@oh-my-pi/pi-agent-core";
import { type Component, Text } from "@oh-my-pi/pi-tui";
import { type Theme } from "../modes/theme/theme.js";
import type { LspParams, LspToolDetails } from "./types.js";
export declare function renderCall(args: LspParams, _options: RenderResultOptions, theme: Theme): Text;
/**
 * Render LSP tool result with intelligent formatting based on result type.
 * Detects hover, diagnostics, references, symbols, etc. and formats accordingly.
 */
export declare function renderResult(result: {
    content: Array<{
        type: string;
        text?: string;
    }>;
    details?: LspToolDetails;
    isError?: boolean;
}, options: RenderResultOptions, theme: Theme, args?: LspParams): Component;
export declare const lspToolRenderer: {
    renderCall: typeof renderCall;
    renderResult: typeof renderResult;
    mergeCallAndResult: boolean;
    inline: boolean;
};
