import { type Component, type OverlayFocusOwner } from "@oh-my-pi/pi-tui";
import type { InteractiveModeContext } from "../types.js";
import type { SetupScene } from "./scenes/types.js";
export declare class SetupWizardComponent implements Component, OverlayFocusOwner {
    #private;
    readonly ctx: InteractiveModeContext;
    readonly scenes: readonly SetupScene[];
    constructor(ctx: InteractiveModeContext, scenes: readonly SetupScene[]);
    run(): Promise<void>;
    dispose(): void;
    invalidate(): void;
    ownsOverlayFocusTarget(component: Component): boolean;
    handleInput(data: string): void;
    render(width: number): readonly string[];
}
