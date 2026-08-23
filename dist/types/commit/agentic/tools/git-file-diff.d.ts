import type { CommitAgentState } from "../../../commit/agentic/state.js";
import type { CustomTool } from "../../../extensibility/custom-tools/types.js";
export declare function getFilePriority(filename: string): number;
declare const gitFileDiffSchema: import("@oh-my-pi/omptype").FluentType<{
    files: string[];
    staged?: boolean | undefined;
}, {
    files: string[];
    staged?: boolean | undefined;
}>;
export declare function createGitFileDiffTool(cwd: string, state: CommitAgentState): CustomTool<typeof gitFileDiffSchema>;
export {};
