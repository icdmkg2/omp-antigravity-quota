import { type Component, type Focusable } from "@oh-my-pi/pi-tui";
export interface MoveOverlayResult {
    directory: string;
}
/** Resolve a user-typed path (`~`, absolute, or relative to `cwd`) to an absolute path. */
export declare function resolveMovePath(input: string, cwd: string): string;
/** If `input` resolves to an existing directory, return it; otherwise `null`. */
export declare function resolveExistingDirectory(input: string, cwd: string): string | null;
/**
 * Overlay component for `/move`: a single-line path input with a live-filtered
 * list of matching directories. Tab accepts the highlighted suggestion; Enter
 * confirms the current input (or the highlighted suggestion if the input is
 * empty); Escape cancels.
 */
export declare class MoveOverlay implements Component, Focusable {
    #private;
    constructor(cwd: string, done: (result: MoveOverlayResult | undefined) => void);
    get focused(): boolean;
    set focused(value: boolean);
    handleInput(data: string): void;
    render(width: number): readonly string[];
    invalidate(): void;
}
