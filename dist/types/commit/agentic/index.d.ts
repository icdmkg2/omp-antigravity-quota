import type { CommitCommandArgs } from "../../commit/types.js";
export declare function runAgenticCommit(args: CommitCommandArgs): Promise<{
    usedFallback: boolean;
}>;
