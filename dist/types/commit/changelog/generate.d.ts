import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, ApiKey, Model } from "@oh-my-pi/pi-ai";
import type { ChangelogGenerationResult } from "../../commit/types.js";
export declare const changelogTool: {
    name: string;
    description: string;
    parameters: import("@oh-my-pi/omptype").FluentType<{
        entries: {
            Added?: string[] | undefined;
            "Breaking Changes"?: string[] | undefined;
            Changed?: string[] | undefined;
            Deprecated?: string[] | undefined;
            Fixed?: string[] | undefined;
            Removed?: string[] | undefined;
            Security?: string[] | undefined;
        };
    }, {
        entries: {
            Added?: string[] | undefined;
            "Breaking Changes"?: string[] | undefined;
            Changed?: string[] | undefined;
            Deprecated?: string[] | undefined;
            Fixed?: string[] | undefined;
            Removed?: string[] | undefined;
            Security?: string[] | undefined;
        };
    }>;
};
export interface ChangelogPromptInput {
    model: Model<Api>;
    apiKey: ApiKey;
    thinkingLevel?: ThinkingLevel;
    changelogPath: string;
    isPackageChangelog: boolean;
    existingEntries?: string;
    stat: string;
    diff: string;
}
export declare function generateChangelogEntries({ model, apiKey, thinkingLevel, changelogPath, isPackageChangelog, existingEntries, stat, diff, }: ChangelogPromptInput): Promise<ChangelogGenerationResult>;
