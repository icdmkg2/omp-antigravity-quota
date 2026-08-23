import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, ApiKey, Model } from "@oh-my-pi/pi-ai";
import type { ConventionalAnalysis, FileObservation } from "../../commit/types.js";
export interface ReducePhaseInput {
    model: Model<Api>;
    apiKey: ApiKey;
    thinkingLevel?: ThinkingLevel;
    observations: FileObservation[];
    stat: string;
    scopeCandidates: string;
    typesDescription?: string;
}
export declare function runReducePhase({ model, apiKey, thinkingLevel, observations, stat, scopeCandidates, typesDescription, }: ReducePhaseInput): Promise<ConventionalAnalysis>;
