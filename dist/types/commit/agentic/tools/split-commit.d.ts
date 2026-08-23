import type { CommitAgentState } from "../../../commit/agentic/state.js";
import type { CustomTool } from "../../../extensibility/custom-tools/types.js";
declare const splitCommitSchema: import("@oh-my-pi/omptype").FluentType<{
    commits: {
        changes: {
            hunks: {
                indices: number[];
                type: "indices";
            } | {
                end: number;
                start: number;
                type: "lines";
            } | {
                type: "all";
            };
            path: string;
        }[];
        dependencies?: number[] | undefined;
        details?: {
            changelog_category?: "Added" | "Breaking Changes" | "Changed" | "Deprecated" | "Fixed" | "Removed" | "Security" | undefined;
            text: string;
            user_visible?: boolean | undefined;
        }[] | undefined;
        issue_refs?: string[] | undefined;
        rationale?: string | undefined;
        scope: string | null;
        summary: string;
        type: "build" | "chore" | "ci" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "style" | "test";
    }[];
}, {
    commits: {
        changes: {
            hunks: {
                type: "all";
            } | {
                indices: number[];
                type: "indices";
            } | {
                end: number;
                start: number;
                type: "lines";
            };
            path: string;
        }[];
        dependencies?: number[] | undefined;
        details?: {
            changelog_category?: "Added" | "Breaking Changes" | "Changed" | "Deprecated" | "Fixed" | "Removed" | "Security" | undefined;
            text: string;
            user_visible?: boolean | undefined;
        }[] | undefined;
        issue_refs?: string[] | undefined;
        rationale?: string | undefined;
        scope: string | null;
        summary: string;
        type: "build" | "chore" | "ci" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "style" | "test";
    }[];
}>;
export declare function createSplitCommitTool(cwd: string, state: CommitAgentState, changelogTargets: string[]): CustomTool<typeof splitCommitSchema>;
export {};
