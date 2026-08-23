import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
/** Inputs rendered by the fallback card used when a tool has no bespoke renderer. */
export interface DefaultToolRenderInput {
    /** Human-readable tool label. */
    label: string;
    /** Tool arguments, shown inline when collapsed and as a tree when expanded. */
    args: unknown;
    /** Settled or streaming result; omitted while only the call is available. */
    result?: {
        output: string;
        isError?: boolean;
        /** Synthetic placeholder for a call skipped mid-batch to service steering/peer
         * input — the tool never ran, so it renders neutral (info) rather than as an error. */
        skipped?: boolean;
    };
    /** Current expansion and lifecycle state. */
    options: RenderResultOptions;
}
/** Format one generic tool call/result card at the available content width. */
export declare function formatDefaultToolExecution(input: DefaultToolRenderInput, contentWidth: number, uiTheme: Theme): string;
/** Render the generic fallback as the state-tinted card used by direct custom tools. */
export declare function renderDefaultToolExecution(input: DefaultToolRenderInput, uiTheme: Theme): Component;
