import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, ApiKey, Model } from "@oh-my-pi/pi-ai";
import type { ConventionalAnalysis } from "../../commit/types.js";
export interface MapReduceSettings {
    enabled?: boolean;
    minFiles?: number;
    maxFileTokens?: number;
    maxConcurrency?: number;
    timeoutMs?: number;
}
export interface MapReduceInput {
    model: Model<Api>;
    apiKey: ApiKey;
    thinkingLevel?: ThinkingLevel;
    smolModel: Model<Api>;
    smolApiKey: ApiKey;
    smolThinkingLevel?: ThinkingLevel;
    diff: string;
    stat: string;
    scopeCandidates: string;
    typesDescription?: string;
    settings?: MapReduceSettings;
}
export declare function shouldUseMapReduce(diff: string, settings?: MapReduceSettings): boolean;
/**
 * Run map-reduce analysis for large diffs using smol + primary models.
 */
export declare function runMapReduceAnalysis(input: MapReduceInput): Promise<ConventionalAnalysis>;
