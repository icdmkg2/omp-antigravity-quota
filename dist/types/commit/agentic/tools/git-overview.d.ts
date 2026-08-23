import type { CommitAgentState } from "../../../commit/agentic/state.js";
import type { CustomTool } from "../../../extensibility/custom-tools/types.js";
declare const gitOverviewSchema: import("@oh-my-pi/omptype").FluentType<{
    include_untracked?: boolean | undefined;
    staged?: boolean | undefined;
}, {
    include_untracked?: boolean | undefined;
    staged?: boolean | undefined;
}>;
export declare function createGitOverviewTool(cwd: string, state: CommitAgentState): CustomTool<typeof gitOverviewSchema>;
export {};
