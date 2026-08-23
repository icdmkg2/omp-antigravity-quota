/**
 * TUI renderers for built-in tools.
 *
 * These provide rich visualization for tool calls and results in the TUI.
 */
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
/**
 * Per-renderer opt-in for a full viewport replay when the first result
 * replaces a painted pending-call render. A predicate receives the painted
 * call args and render options so the repaint stays scoped to the pending
 * shapes that actually re-anchor (an over-eager replay wipes native
 * scrollback on direct terminals).
 */
export type FirstResultViewportRepaint = boolean | ((args: unknown, options: RenderResultOptions) => boolean);
/** Semantic activity text consumed by the transcript's generic compact card. */
export interface ToolActivitySummary {
    label: string;
    detail?: string;
}
/** Live execution fields that are safe for compact transcript presentation. */
export interface ToolActivityContext {
    readonly expanded: boolean;
    readonly isPartial: boolean;
    readonly spinnerFrame?: number;
    /** Tool-specific render context (same shape `renderCall` receives), when available. */
    readonly renderContext?: Record<string, unknown>;
}
export type ToolRenderer = {
    renderCall: (args: unknown, options: RenderResultOptions, theme: Theme) => Component;
    renderResult: (result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: unknown;
        isError?: boolean;
    }, options: RenderResultOptions & {
        renderContext?: Record<string, unknown>;
    }, theme: Theme, args?: unknown) => Component;
    mergeCallAndResult?: boolean;
    /** Describes current activity without coupling a renderer to terminal layout. */
    activitySummary?: (args: unknown, context: ToolActivityContext) => ToolActivitySummary;
    /** Render without background box, inline in the response flow */
    inline?: boolean;
    /**
     * Whether the renderer's pending-call path visibly consumes
     * `options.spinnerFrame`. Used to avoid scheduling repaint ticks for live
     * partial calls whose bytes cannot change between spinner frames.
     */
    animatedPendingPreview?: boolean | ((args: unknown) => boolean);
    /**
     * Whether the renderer's partial-result path visibly consumes
     * `options.spinnerFrame`.
     */
    animatedPartialResult?: boolean | ((args: unknown) => boolean);
    /**
     * Whether replacing a pending call render with the first result requires a
     * full viewport repaint. Use for merged renderers whose pending rows can be
     * re-anchored instead of preserved by the result render.
     */
    forceFirstResultViewportRepaint?: FirstResultViewportRepaint;
    /**
     * Whether settling a provisional partial result into the final render requires
     * a full viewport repaint. Use when the result renderer changes chrome or
     * frame topology at `options.isPartial: true -> false`.
     */
    forceResultViewportRepaintOnSettle?: boolean;
};
export declare const toolRenderers: Record<string, ToolRenderer>;
