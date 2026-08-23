import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, ApiKey, Model } from "@oh-my-pi/pi-ai";
export interface ChangelogFlowInput {
    cwd: string;
    model: Model<Api>;
    apiKey: ApiKey;
    thinkingLevel?: ThinkingLevel;
    stagedFiles: string[];
    dryRun: boolean;
    maxDiffChars?: number;
    onProgress?: (message: string) => void;
}
export interface ChangelogProposalInput {
    cwd: string;
    proposals: Array<{
        path: string;
        entries: Record<string, string[]>;
        deletions?: Record<string, string[]>;
    }>;
    dryRun: boolean;
    onProgress?: (message: string) => void;
}
/**
 * Update CHANGELOG.md entries for staged changes.
 */
export declare function runChangelogFlow({ cwd, model, apiKey, thinkingLevel, stagedFiles, dryRun, maxDiffChars, onProgress, }: ChangelogFlowInput): Promise<string[]>;
/**
 * Apply changelog entries provided by the commit agent.
 */
export declare function applyChangelogProposals({ cwd, proposals, dryRun, onProgress, }: ChangelogProposalInput): Promise<string[]>;
