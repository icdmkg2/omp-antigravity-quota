import type { InteractiveModeContext } from "../types.js";
export declare class TanCommandController {
    private readonly ctx;
    constructor(ctx: InteractiveModeContext);
    start(work: string): Promise<void>;
}
