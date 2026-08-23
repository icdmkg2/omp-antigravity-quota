import type { AssistantMessage } from "@oh-my-pi/pi-ai";
import { type Component } from "@oh-my-pi/pi-tui";
import type { AssistantMessageComponent } from "../components/assistant-message.js";
export declare const STREAMING_REVEAL_FRAME_MS: number;
export declare const MIN_STEP = 3;
export declare const CATCHUP_FRAMES = 8;
/** The concrete streaming-reveal target is an {@link AssistantMessageComponent}; the
 *  Component intersection is what lets the reveal request component-scoped renders
 *  through {@link TUI.requestComponentRender} instead of forcing a full-tree walk. */
type StreamingRevealComponent = Pick<AssistantMessageComponent, "updateContent"> & Component;
type GraphemeSlicer = (index: number, text: string, units: number) => string;
type StreamingRevealControllerOptions = {
    getSmoothStreaming(): boolean;
    getHideThinkingBlock(): boolean;
    getProseOnlyThinking(): boolean;
    /** Called after each reveal tick with the component whose subtree changed;
     *  callers scope the render to that subtree (a full tree walk here at 30fps
     *  costs 5% of CPU on its own and drives the Box/Container overhead that
     *  cascades into another ~15% — see issue #4377). */
    requestRender(component: Component): void;
};
/** Memoizes per-block grapheme counts across reveal ticks. Streaming blocks only
 *  grow by appending, and an append can only alter the final grapheme cluster of
 *  the previous text, so only the suffix from that cluster needs re-segmenting. */
export declare class BlockUnitCounter {
    #private;
    count(index: number, text: string): number;
    reset(): void;
    /** Slice `text` to its first `units` graphemes. Memoized across reveal ticks:
     *  streaming blocks grow only by appending and the reveal target advances
     *  monotonically, so a previously sliced prefix is reused and only the suffix
     *  from the boundary cluster is re-segmented. Only an exact (text, units) hit
     *  skips segmentation entirely — an append can extend the boundary cluster, so
     *  the incremental path still re-segments from that cluster's start. */
    slice(index: number, text: string, units: number): string;
}
export declare function visibleUnits(message: AssistantMessage, hideThinking: boolean, proseOnly?: boolean): number;
export declare function buildDisplayMessage(target: AssistantMessage, revealed: number, hideThinking: boolean, proseOnly?: boolean, countOf?: (index: number, text: string) => number, sliceOf?: GraphemeSlicer): AssistantMessage;
export declare function nextStep(backlog: number): number;
export declare class StreamingRevealController {
    #private;
    constructor(options: StreamingRevealControllerOptions);
    begin(component: StreamingRevealComponent, message: AssistantMessage): void;
    setTarget(message: AssistantMessage): void;
    stop(): void;
    /**
     * Re-read cached visibility flags (hideThinkingBlock, proseOnlyThinking)
     * and re-render the current target. Called when the thinking level changes
     * mid-stream so the reveal controller doesn't keep rendering with stale values.
     */
    resyncVisibility(): void;
}
export {};
