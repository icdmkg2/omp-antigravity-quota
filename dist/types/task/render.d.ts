import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import { type Theme } from "../modes/theme/theme.js";
import type { TaskParams, TaskToolDetails } from "./types.js";
/** Render context threaded in from `ToolExecutionComponent.#buildRenderContext`. */
interface TaskRenderContext {
    hasResult?: boolean;
    /**
     * The block left the transcript live region (detached spawn the transcript
     * has moved past, or a sealed block): progress rows render static gray, so
     * commit-eligible rows do not repaint after entering native scrollback.
     */
    frozen?: boolean;
    /**
     * Wall clock for time-derived rows (current-tool elapsed, retry countdown).
     * The component freezes it once the block settles or any of its rows enter
     * native scrollback, so identical-input rebuilds stay byte-identical with
     * committed history. Absent: render with the live clock.
     */
    nowMs?: number;
}
type TaskRenderOptions = RenderResultOptions & {
    renderContext?: TaskRenderContext;
};
export declare function formatTaskId(id: string): string;
/** Dim `⟨agent⟩` badge for a non-default agent type; empty for the generic worker. */
export declare function agentTypeBadge(agent: string | undefined, theme: Theme): string;
/**
 * Render the tool call arguments.
 */
export declare function renderCall(args: TaskParams, options: TaskRenderOptions, theme: Theme): Component;
/**
 * Render the tool result.
 */
export declare function renderResult(result: {
    content: Array<{
        type: string;
        text?: string;
    }>;
    details?: TaskToolDetails;
    isError?: boolean;
}, options: TaskRenderOptions, theme: Theme, args?: TaskParams): Component;
export {};
