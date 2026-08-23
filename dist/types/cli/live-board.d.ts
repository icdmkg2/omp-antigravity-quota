/** Braille spinner advanced once per repaint tick; shared with the interactive cleanse overlay. */
export declare const SPINNER_FRAMES: string[];
/** Output contract for the live board (satisfied by `process.stdout`). */
export interface LiveBoardOutput {
    isTTY?: boolean;
    columns?: number;
    rows?: number;
    write(text: string): boolean;
}
/** Live repaint handle returned by {@link createLiveBoard}. */
export interface LiveBoard {
    readonly interactive: boolean;
    /** Print a permanent line above the board; plain write when non-interactive. */
    log(text: string): void;
    /** Repaint immediately after a state change instead of waiting for the next tick. */
    repaint(): void;
    /** Clear the board, stop the timer, and restore the cursor. */
    close(): void;
}
/**
 * Create a live board whose content comes from `render(spinner, width)` on
 * every tick. An empty render result paints nothing and releases the cursor,
 * so an idle board never interferes with other terminal UI (e.g. pickers).
 */
export declare function createLiveBoard(render: (spinner: string, width: number) => string[], output?: LiveBoardOutput): LiveBoard;
