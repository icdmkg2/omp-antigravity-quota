import type { CommitAgentState } from "../../../commit/agentic/state.js";
import type { CustomTool } from "../../../extensibility/custom-tools/types.js";
declare const proposeCommitSchema: import("@oh-my-pi/omptype").FluentType<{
    details: {
        changelog_category?: "Added" | "Breaking Changes" | "Changed" | "Deprecated" | "Fixed" | "Removed" | "Security" | undefined;
        text: string;
        user_visible?: boolean | undefined;
    }[];
    issue_refs: string[];
    scope: string | null;
    summary: string;
    type: "build" | "chore" | "ci" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "style" | "test";
}, {
    details: {
        changelog_category?: "Added" | "Breaking Changes" | "Changed" | "Deprecated" | "Fixed" | "Removed" | "Security" | undefined;
        text: string;
        user_visible?: boolean | undefined;
    }[];
    issue_refs: string[];
    scope: string | null;
    summary: string;
    type: "build" | "chore" | "ci" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "style" | "test";
}>;
export declare function createProposeCommitTool(cwd: string, state: CommitAgentState): CustomTool<typeof proposeCommitSchema>;
export {};
