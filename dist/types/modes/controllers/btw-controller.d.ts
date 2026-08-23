import type { InteractiveModeContext } from "../types.js";
export declare class BtwController {
    #private;
    private readonly ctx;
    constructor(ctx: InteractiveModeContext);
    hasActiveRequest(): boolean;
    canBranch(): boolean;
    /** Whether plain `b` is currently reserved for a completed or pending branch action. */
    handlesBranchKey(): boolean;
    canCopy(): boolean;
    handleCopy(): Promise<boolean>;
    handleBranch(): Promise<boolean>;
    handleEscape(): boolean;
    dispose(): void;
    start(question: string): Promise<void>;
}
