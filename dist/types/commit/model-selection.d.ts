import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, ApiKey, Model } from "@oh-my-pi/pi-ai";
import type { ApiKeyResolverRegistry } from "../config/api-key-resolver.js";
import { type ModelLookupRegistry } from "../config/model-resolver.js";
import type { Settings } from "../config/settings.js";
export interface ResolvedCommitModel {
    model: Model<Api>;
    /**
     * Resolver for the model's bearer: re-resolves on 401 / usage-limit so the
     * whole commit pipeline (analysis, map/reduce, changelog) inherits the
     * central force-refresh + account-rotation policy.
     */
    apiKey: ApiKey;
    /**
     * Commit-time inference is stateless: session-level auto classification
     * isn't available, so an explicit `:auto` selector collapses to "no
     * override" and the model's own default level fills in.
     */
    thinkingLevel?: ThinkingLevel;
}
type CommitModelRegistry = ModelLookupRegistry & ApiKeyResolverRegistry & {
    getApiKey: (model: Model<Api>) => Promise<string | undefined>;
};
export declare function resolvePrimaryModel(override: string | undefined, settings: Settings, modelRegistry: CommitModelRegistry): Promise<ResolvedCommitModel>;
export declare function resolveSmolModel(settings: Settings, modelRegistry: CommitModelRegistry, fallbackModel: Model<Api>, fallbackApiKey: ApiKey): Promise<ResolvedCommitModel>;
export {};
