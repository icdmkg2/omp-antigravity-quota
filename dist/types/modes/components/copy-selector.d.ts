import { type Component } from "@oh-my-pi/pi-tui";
import type { CopyTarget } from "../utils/copy-targets.js";
export interface CopySelectorCallbacks {
    /** A copy target was chosen — copy its `content`. */
    onPick: (target: CopyTarget) => void;
    /** The picker was dismissed. */
    onCancel: () => void;
}
/**
 * Fullscreen `/copy` picker rendered as a `/tree`-style tree inside one
 * outlined box: a title, the tree of copy targets (recent assistant messages
 * with their code blocks nested beneath), a live preview of the highlighted
 * node, and a keybinding footer. Every node copies its `content` on Enter.
 */
export declare class CopySelectorComponent implements Component {
    #private;
    private readonly callbacks;
    constructor(roots: CopyTarget[], callbacks: CopySelectorCallbacks);
    invalidate(): void;
    handleInput(keyData: string): void;
    render(width: number): readonly string[];
}
