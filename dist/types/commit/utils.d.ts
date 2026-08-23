import type { AssistantMessage, ToolCall } from "@oh-my-pi/pi-ai";
import type { ChangelogCategory, ConventionalAnalysis, ConventionalDetail } from "./types.js";
export declare function extractToolCall(message: AssistantMessage, name: string): ToolCall | undefined;
export declare function extractTextContent(message: AssistantMessage): string;
export declare function parseJsonPayload(text: string): unknown;
export declare function normalizeAnalysis(parsed: {
    type: ConventionalAnalysis["type"];
    scope: string | null;
    details: Array<{
        text: string;
        changelog_category?: ChangelogCategory;
        user_visible?: boolean;
    }>;
    issue_refs: string[];
}): ConventionalAnalysis;
export declare function normalizeDetails(details: Array<{
    text: string;
    changelog_category?: ConventionalDetail["changelogCategory"];
    user_visible?: boolean;
}>): ConventionalDetail[];
