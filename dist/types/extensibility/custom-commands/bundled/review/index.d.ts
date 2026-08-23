import type { CustomCommand, CustomCommandAPI } from "../../../../extensibility/custom-commands/types.js";
import type { HookCommandContext } from "../../../../extensibility/hooks/types.js";
export declare class ReviewCommand implements CustomCommand {
    private api;
    name: string;
    description: string;
    constructor(api: CustomCommandAPI);
    execute(args: string[], ctx: HookCommandContext): Promise<string | undefined>;
}
export default ReviewCommand;
