import { OverlayPanel } from "../modes/components/overlay-box.js";
import type { InteractiveModeContext } from "../modes/types.js";
/**
 * Debug selector component.
 */
export declare class DebugSelectorComponent extends OverlayPanel {
    #private;
    private ctx;
    constructor(ctx: InteractiveModeContext, onDone: () => void);
    handleInput(keyData: string): void;
}
/**
 * Show the debug selector.
 */
export declare function showDebugSelector(ctx: InteractiveModeContext, done: () => void): DebugSelectorComponent;
