import type { Api, Model, ModelSpec, RemoteCompactionConfig } from "@oh-my-pi/pi-ai/types";
import { type HeaderSource } from "./model-config-values.js";
import { type ModelPatch } from "./model-patch.js";
import type { ModelOverride, ProviderAuthMode } from "./models-config-schema.js";
export interface CustomModelDefinitionLike extends ModelPatch {
    id: string;
    api?: Api;
    baseUrl?: string;
    cost?: Model<Api>["cost"];
}
export interface CustomModelBuildOptions {
    useDefaults: boolean;
}
export interface CustomModelOverlay extends ModelPatch {
    id: string;
    provider: string;
    api: Api;
    baseUrl: string;
    cost?: Model<Api>["cost"];
    isOAuth?: boolean;
}
export declare function mergeAuthHeaderSources(sources: readonly HeaderSource[], authHeader: boolean | undefined, apiKeyConfig: string | undefined): Record<string, string> | undefined;
export declare function buildCustomModelOverlay(providerName: string, providerBaseUrl: string, providerApi: Api | undefined, providerHeaders: Record<string, string> | undefined, providerApiKey: string | undefined, authHeader: boolean | undefined, providerCompat: ModelSpec<Api>["compat"] | undefined, providerAuth: ProviderAuthMode | undefined, providerRemoteCompaction: RemoteCompactionConfig<Api> | undefined, modelDef: CustomModelDefinitionLike): CustomModelOverlay | undefined;
export declare function finalizeCustomModel(model: CustomModelOverlay, options: CustomModelBuildOptions): Model<Api>;
export declare function normalizeSuppressedSelector(selector: string, hasLiveModel?: (provider: string, id: string) => boolean): string;
/**
 * Look up a model's override, falling back to entries keyed by retired
 * effort-tier variant ids (models.yml authored before collapsing). A raw key
 * only re-binds when no live model holds that id.
 */
export declare function resolveModelOverrideWithAliases(overrides: Map<string, ModelOverride>, model: Model<Api>, hasLiveModel: (provider: string, id: string) => boolean): ModelOverride | undefined;
