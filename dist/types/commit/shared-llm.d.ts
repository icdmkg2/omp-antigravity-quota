import type { AssistantMessage } from "@oh-my-pi/pi-ai";
import type { ConventionalAnalysis } from "./types.js";
export declare const conventionalAnalysisParameters: import("@oh-my-pi/omptype").FluentType<{
    details: {
        changelog_category?: "Added" | "Breaking Changes" | "Changed" | "Deprecated" | "Fixed" | "Removed" | "Security" | undefined;
        text: string;
        user_visible?: boolean | undefined;
    }[];
    issue_refs: string[];
    scope: string | null;
    type: "build" | "chore" | "ci" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "style" | "test";
}, {
    details: {
        changelog_category?: "Added" | "Breaking Changes" | "Changed" | "Deprecated" | "Fixed" | "Removed" | "Security" | undefined;
        text: string;
        user_visible?: boolean | undefined;
    }[];
    issue_refs: string[];
    scope: string | null;
    type: "build" | "chore" | "ci" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "style" | "test";
}>;
export interface ConventionalAnalysisTool {
    name: "create_conventional_analysis";
    description: string;
    parameters: typeof conventionalAnalysisParameters;
}
/**
 * Build a `create_conventional_analysis` tool descriptor. Phase-specific
 * `description` text is the only thing that varies between callers.
 */
export declare function createConventionalAnalysisTool(description: string): ConventionalAnalysisTool;
/**
 * Extract a {@link ConventionalAnalysis} from an assistant response, preferring
 * a structured tool call and falling back to JSON embedded in text content.
 */
export declare function parseConventionalAnalysisResponse(message: AssistantMessage, tool: ConventionalAnalysisTool): ConventionalAnalysis;
