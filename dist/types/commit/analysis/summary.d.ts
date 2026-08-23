import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, ApiKey, Model } from "@oh-my-pi/pi-ai";
import type { CommitSummary } from "../../commit/types.js";
export interface SummaryInput {
    model: Model<Api>;
    apiKey: ApiKey;
    thinkingLevel?: ThinkingLevel;
    commitType: string;
    scope: string | null;
    details: string[];
    stat: string;
    maxChars: number;
    userContext?: string;
}
/**
 * Generate a commit summary line for the conventional commit header.
 */
export declare function generateSummary({ model, apiKey, thinkingLevel, commitType, scope, details, stat, maxChars, userContext, }: SummaryInput): Promise<CommitSummary>;
export declare function stripTypePrefix(summary: string, commitType: string, scope: string | null): string;
