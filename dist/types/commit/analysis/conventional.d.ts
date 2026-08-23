import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, ApiKey, Model } from "@oh-my-pi/pi-ai";
import type { ConventionalAnalysis } from "../../commit/types.js";
export interface ConventionalAnalysisInput {
    model: Model<Api>;
    apiKey: ApiKey;
    thinkingLevel?: ThinkingLevel;
    contextFiles?: Array<{
        path: string;
        content: string;
    }>;
    userContext?: string;
    typesDescription?: string;
    recentCommits?: string[];
    scopeCandidates: string;
    stat: string;
    diff: string;
}
/**
 * Generate conventional analysis data from a diff and metadata.
 */
export declare function generateConventionalAnalysis({ model, apiKey, thinkingLevel, contextFiles, userContext, typesDescription, recentCommits, scopeCandidates, stat, diff, }: ConventionalAnalysisInput): Promise<ConventionalAnalysis>;
