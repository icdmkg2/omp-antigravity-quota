import type { InteractiveModeContext } from "../types.js";
export declare class CleanseCommandController {
    #private;
    private readonly ctx;
    constructor(ctx: InteractiveModeContext);
    hasActiveRun(): boolean;
    /** Esc while running cancels the run; Esc on a settled panel dismisses it. */
    handleEscape(): boolean;
    dispose(): void;
    start(args: string): Promise<void>;
}
