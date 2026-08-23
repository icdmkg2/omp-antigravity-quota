import type { Component, HistoryBatch } from "@oh-my-pi/pi-tui";
import { Container } from "@oh-my-pi/pi-tui";
/** Shared animation time supplied by the constrained transcript root. */
export interface AnimationFrame {
    readonly tick: number;
    readonly now: number;
}
/** Lets an active block adapt its presentation to its allocated viewport rows. */
export interface TranscriptPresentationTarget {
    setTranscriptAllocation?(rows: number, frame: AnimationFrame): void;
}
/**
 * Block lifecycle:
 * - `active`: still mutating; renders live and counts against tool admission.
 * - `settled`: finalized but retained in the mutable viewport, re-rendering at
 *   the current width every frame (so resizes reflow it) until capacity
 *   pressure retires it.
 * - `committed`: appended to terminal history; immutable and never re-rendered.
 */
type BlockState = "active" | "settled" | "committed";
/** Strip leading/trailing all-blank rows; the viewport allocator measures blocks by this trimmed height. */
export declare function trimBlankEdges(rows: readonly string[]): readonly string[];
/** Owns transcript order, live capacity, and ordered immutable retirement. */
export declare class TranscriptContainer extends Container {
    #private;
    addChild(component: Component): void;
    removeChild(component: Component): void;
    clear(): void;
    setToolActivityVisible(visible: boolean): void;
    /** Whether a transient block may be discarded without leaving tape history. */
    canRemoveBlock(component: Component): boolean;
    /** Lifecycle state per block in transcript order (diagnostics and tests). */
    blockStates(): readonly BlockState[];
    /** Whether visible active capacity and live-block memory permit another admission. */
    canAdmit(rows: number): boolean;
    /** Rebuild retirement state before replaying the complete transcript history. */
    resetRetirement(): void;
    /** Total rows the live (non-committed, non-offered) tail occupies at `width`. */
    liveRowCount(width: number): number;
    /** Render the live tail, constrained to the supplied transcript height. */
    renderViewport(width: number, rows: number, frame: AnimationFrame): readonly string[];
    /**
     * Offer the settled prefix that must retire for the live tail to fit
     * `capacity` rows. Blocks stay live (re-rendering at the current width)
     * while room remains; the offer stands until the terminal acknowledges it.
     */
    peekFinalizedBatch(width: number, capacity: number): HistoryBatch | undefined;
    /** Retire exactly the history batch most recently offered by this container. */
    acknowledgeFinalizedBatch(id: number): void;
    /** Full semantic render used by exports and non-terminal commands. */
    render(width: number): readonly string[];
}
/** Groups sibling rows into one semantic transcript block. */
export declare class TranscriptBlock extends Container {
}
export {};
