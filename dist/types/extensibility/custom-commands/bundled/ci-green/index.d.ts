import type { CustomCommand, CustomCommandAPI } from "../../../../extensibility/custom-commands/types.js";
import type { HookCommandContext } from "../../../../extensibility/hooks/types.js";
export declare class GreenCommand implements CustomCommand {
    private api;
    name: string;
    description: string;
    constructor(api: CustomCommandAPI);
    execute(_args: string[], _ctx: HookCommandContext): Promise<string>;
}
