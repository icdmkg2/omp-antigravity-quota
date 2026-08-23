import type { Clipboard, SnapshotStore } from "@oh-my-pi/hashline";
import type { AgentTool } from "@oh-my-pi/pi-agent-core";
import { type Component, Container, type TUI } from "@oh-my-pi/pi-tui";
import { type AnimationFrame } from "./transcript-container.js";
/** Minimal TUI surface ToolExecutionComponent uses to schedule repaints and share image budget. */
export interface ToolExecutionUi {
    requestRender(): void;
    requestComponentRender(component: Component): void;
    resetDisplay(): void;
    imageBudget?: TUI["imageBudget"];
}
export interface ToolExecutionOptions {
    snapshots?: SnapshotStore;
    /** Session-persistent edit clipboard register, forked per preview frame. */
    clipboard?: Clipboard;
    showImages?: boolean;
    /** Allow the name-keyed renderer registry only when the active tool is the built-in implementation. */
    useBuiltInRenderer?: boolean;
    editFuzzyThreshold?: number;
    editAllowFuzzy?: boolean;
}
export interface ToolExecutionHandle extends Component {
    updateArgs(args: any, toolCallId?: string): void;
    updateResult(result: {
        content: Array<{
            type: string;
            text?: string;
            data?: string;
            mimeType?: string;
        }>;
        details?: any;
        isError?: boolean;
    }, isPartial?: boolean, toolCallId?: string): void;
    setArgsComplete(toolCallId?: string): void;
    setExecutionStarted(toolCallId?: string): void;
    setExpanded(expanded: boolean): void;
    setToolActivityVisible(visible: boolean): void;
    /** Mark the call parked: it returned, but stays tracked for async job frames. */
    parkAsBackground(): void;
    /** Seal the block as final history and stop its animations. */
    seal(): void;
}
/** Redraw live tool blocks at the spinner's glyph-advance rate. Rendering more
 * often produced identical frames — the previous 30fps cadence emitted ~2.4
 * paints per glyph step, and although the terminal I/O layer dedupes those, the
 * compose pipeline still ran end-to-end per frame (issue #4353). Matching the
 * render tick to the glyph tick halves the paints during tool execution with no
 * visible change. */
export declare const SPINNER_RENDER_INTERVAL_MS = 80;
/** Advance the spinner glyph at its classic ~12.5fps step (mirrors `Loader`). */
export declare const SPINNER_GLYPH_ADVANCE_MS = 80;
/** Phase-locked spinner glyph index shared by every live tool block so parallel
 * spinners advance in lockstep instead of each tracking its own start time. */
export declare function sharedSpinnerFrame(frameCount: number, now?: number): number;
/** Stop the shared spinner ticker and drop every registered live block.
 *  Called on interactive-mode teardown so a stray live block cannot keep the
 *  process-wide 80ms interval alive past shutdown (lingering event-loop
 *  handles pin the process; cf. `postmortem.quit`). Test files that assert on
 *  ticker arming also use this to start from a clean slate. */
export declare function stopSharedSpinnerTicker(): void;
/**
 * Component that renders a tool call with its result (updateable)
 */
export declare class ToolExecutionComponent extends Container {
    #private;
    constructor(toolName: string, args: any, options: ToolExecutionOptions | undefined, tool: AgentTool | undefined, ui: ToolExecutionUi, cwd?: string, _toolCallId?: string);
    updateArgs(args: any, _toolCallId?: string): void;
    /**
     * Signal that args are complete (tool is about to execute).
     * This triggers an immediate final diff computation for edit-like tools.
     */
    setArgsComplete(_toolCallId?: string): void;
    /**
     * Signal that this specific call has begun executing (`tool_execution_start`).
     * Distinct from {@link setArgsComplete}: exclusive writes are marked complete
     * at `message_end` but stay queued until this fires for that call.
     */
    setExecutionStarted(_toolCallId?: string): void;
    /**
     * Await the streaming diff recompute kicked off by the most recent
     * `updateArgs`/`setArgsComplete`. The recompute reads the file and re-runs the
     * whole-file Myers diff off the render path, signalling completion only via a
     * throttled `requestRender`. Tests await this to sample a *settled* preview
     * deterministically instead of racing the spinner's render ticks.
     */
    whenPreviewSettled(): Promise<void>;
    updateResult(result: {
        content: Array<{
            type: string;
            text?: string;
            data?: string;
            mimeType?: string;
        }>;
        details?: any;
        isError?: boolean;
    }, isPartial?: boolean, _toolCallId?: string): void;
    /**
     * Advance to the shared spinner glyph and repaint just this block. Driven by
     * the single shared spinner ticker (see `registerSpinnerBlock`); the tick is
     * component-scoped so the TUI reuses every other root subtree (issue #4377).
     */
    tickSpinner(frame: number): void;
    /**
     * Whether this block is ready to retire as immutable history. Partial
     * results, including detached background tasks, remain active and mutable
     * until they settle. Hidden blocks render no rows and cannot gate history.
     */
    isTranscriptBlockFinalized(): boolean;
    getTranscriptBlockVersion(): number;
    /** Mark the call parked: it returned, but stays tracked for async job frames. */
    parkAsBackground(): void;
    /**
     * Mark the tool terminal even though no result arrived (the turn aborted or
     * abandoned it) and stop animating so the container can retire it.
     */
    seal(): void;
    /**
     * Whether this block is a supersedable result snapshot that has not been
     * sealed. Displacement is best-effort: the snapshot finalizes like any other
     * block, so under capacity pressure it may retire to native scrollback
     * first — then the follow-up call appends a fresh snapshot instead of
     * removing this one (see {@link TranscriptContainer.canRemoveBlock}).
     */
    isDisplaceableBlock(): boolean;
    canBeDisplacedBy(nextToolName: string | undefined): boolean;
    /**
     * Stop spinner animation and cleanup resources.
     */
    stopAnimation(): void;
    setExpanded(expanded: boolean): void;
    /** Apply the transcript allocator's current viewport reservation. */
    setTranscriptAllocation(rows: number, frame: AnimationFrame): void;
    setToolActivityVisible(visible: boolean): void;
    setShowImages(show: boolean): void;
    invalidate(): void;
    render(width: number): readonly string[];
}
