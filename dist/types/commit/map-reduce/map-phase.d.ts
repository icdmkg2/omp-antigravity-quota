import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, ApiKey, Model } from "@oh-my-pi/pi-ai";
import type { FileDiff, FileObservation } from "../../commit/types.js";
export interface MapPhaseInput {
    model: Model<Api>;
    apiKey: ApiKey;
    thinkingLevel?: ThinkingLevel;
    files: FileDiff[];
    config?: {
        maxFileTokens?: number;
        maxConcurrency?: number;
        timeoutMs?: number;
        maxRetries?: number;
        retryBackoffMs?: number;
    };
}
export declare function runMapPhase({ model, apiKey, thinkingLevel, files, config, }: MapPhaseInput): Promise<FileObservation[]>;
