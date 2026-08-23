import type { InteractiveModeContext } from "../types.js";
export declare class OmfgController {
    #private;
    private readonly ctx;
    constructor(ctx: InteractiveModeContext);
    hasActiveRequest(): boolean;
    handleEscape(): boolean;
    dispose(): void;
    start(complaint: string): Promise<void>;
}
