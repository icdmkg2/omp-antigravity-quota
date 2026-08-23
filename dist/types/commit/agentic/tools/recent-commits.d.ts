import type { CustomTool } from "../../../extensibility/custom-tools/types.js";
declare const recentCommitsSchema: import("@oh-my-pi/omptype").FluentType<{
    count?: number | undefined;
}, {
    count?: number | undefined;
}>;
export declare function createRecentCommitsTool(cwd: string): CustomTool<typeof recentCommitsSchema>;
export {};
