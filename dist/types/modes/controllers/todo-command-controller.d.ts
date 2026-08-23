import type { InteractiveModeContext } from "../types.js";
export declare class TodoCommandController {
    #private;
    private readonly ctx;
    constructor(ctx: InteractiveModeContext);
    handleTodoCommand(args: string): Promise<void>;
}
