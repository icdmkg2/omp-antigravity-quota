import type { InteractiveModeContext } from "../types.js";
export declare class SSHCommandController {
    #private;
    private ctx;
    constructor(ctx: InteractiveModeContext);
    /**
     * Handle /ssh command and route to subcommands
     */
    handle(text: string): Promise<void>;
}
