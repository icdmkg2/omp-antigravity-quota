import type { CommitAgentState } from "../../../commit/agentic/state.js";
import type { CustomTool } from "../../../extensibility/custom-tools/types.js";
declare const proposeChangelogSchema: import("@oh-my-pi/omptype").FluentType<{
    entries: {
        deletions?: {
            Added?: string[] | undefined;
            "Breaking Changes"?: string[] | undefined;
            Changed?: string[] | undefined;
            Deprecated?: string[] | undefined;
            Fixed?: string[] | undefined;
            Removed?: string[] | undefined;
            Security?: string[] | undefined;
        } | undefined;
        entries: {
            Added?: string[] | undefined;
            "Breaking Changes"?: string[] | undefined;
            Changed?: string[] | undefined;
            Deprecated?: string[] | undefined;
            Fixed?: string[] | undefined;
            Removed?: string[] | undefined;
            Security?: string[] | undefined;
        };
        path: string;
    }[];
}, {
    entries: {
        deletions?: {
            Added?: string[] | undefined;
            "Breaking Changes"?: string[] | undefined;
            Changed?: string[] | undefined;
            Deprecated?: string[] | undefined;
            Fixed?: string[] | undefined;
            Removed?: string[] | undefined;
            Security?: string[] | undefined;
        } | undefined;
        entries: {
            Added?: string[] | undefined;
            "Breaking Changes"?: string[] | undefined;
            Changed?: string[] | undefined;
            Deprecated?: string[] | undefined;
            Fixed?: string[] | undefined;
            Removed?: string[] | undefined;
            Security?: string[] | undefined;
        };
        path: string;
    }[];
}>;
export declare function createProposeChangelogTool(state: CommitAgentState, changelogTargets: string[]): CustomTool<typeof proposeChangelogSchema>;
export {};
