import type { Api, Model, ModelSpec, RemoteCompactionConfig, ThinkingConfig } from "@oh-my-pi/pi-ai/types";
import type { ModelOverride } from "./models-config-schema.js";
/** Provider override config (baseUrl, headers, apiKey, compat, transport) without custom models */
export interface ProviderOverride {
    baseUrl?: string;
    headers?: Record<string, string>;
    apiKey?: string;
    authHeader?: boolean;
    compat?: ModelSpec<Api>["compat"];
    remoteCompaction?: RemoteCompactionConfig<Api>;
    transport?: Model<Api>["transport"];
    guardrailIdentifier?: Model<Api>["guardrailIdentifier"];
    guardrailVersion?: Model<Api>["guardrailVersion"];
    guardrailTrace?: Model<Api>["guardrailTrace"];
}
/**
 * Merge a freshly discovered model with the matching bundled/configured entry
 * (or a runtime provider override when no bundled entry exists).
 *
 * `baseUrl` resolution priority:
 *   1. User-set `providerOverride.baseUrl` (explicit override in models.json)
 *   2. Discovered baseUrl (xiaomi `tp-` token-plan keys resolve to
 *      `token-plan-sgp.xiaomimimo.com` at discovery time)
 *   3. Existing bundled baseUrl (the host baked into `models.json`)
 *
 * `transport` resolution priority:
 *   1. `providerOverride.transport` (e.g. `pi-native` for auth-gateway users)
 *   2. `existing.transport` (carried over from boot-time override application)
 *   3. `model.transport` (rarely set — discovery defaults omit it)
 *
 * Without (1), the user's override would lose to discovery; without (2)
 * preferred over (3), the bundled `api.xiaomimimo.com` would shadow the
 * tp- token-plan host and produce 401s on the first stream call.
 * Without explicit transport propagation, an openrouter (or any) entry
 * marked `transport: pi-native` in models.yml silently reverts to the
 * default openai-completions transport after the background catalog
 * refresh — so the first `/model` switch after boot hits the raw OpenAI
 * chat-completions URL instead of the gateway's `/v1/pi/stream` (#2555).
 * See `xiaomi-tp-discovery-merge.test.ts` and the `refresh()` baseUrl-override
 * regression in `model-registry.test.ts`.
 */
export declare function mergeDiscoveredModel<TApi extends Api>(model: Model<TApi>, existing: Model<Api> | undefined, providerOverride?: Pick<ProviderOverride, "baseUrl" | "compat" | "headers" | "remoteCompaction" | "transport">): Model<TApi>;
export declare const AUTHORITATIVE_RUNTIME_CATALOG_PROVIDERS: Set<string>;
export declare function providersWithAuthoritativeProjectCatalog(models: readonly Model<Api>[]): Set<string>;
export declare function dropProviderModels(models: readonly Model<Api>[], providers: ReadonlySet<string>): Model<Api>[];
/**
 * Merge `incoming` entries into a copy of `base`, keyed by `provider`+`id`.
 * Matches are replaced with `combine(existing, entry)`; new entries are
 * appended as `combine(undefined, entry)`.
 */
export declare function mergeByModelKey<T extends {
    provider: string;
    id: string;
}>(base: readonly Model<Api>[], incoming: readonly T[], combine: (existing: Model<Api> | undefined, entry: T) => Model<Api>): Model<Api>[];
export declare function mergeCompat<TBase extends object, TOverride extends object>(baseCompat: TBase | null | undefined, overrideCompat: TOverride | null | undefined): (TBase & TOverride) | TBase | TOverride | undefined;
export declare function mergeRemoteCompactionConfig(baseConfig: RemoteCompactionConfig<Api> | undefined, overrideConfig: RemoteCompactionConfig<Api> | undefined): RemoteCompactionConfig<Api> | undefined;
export declare function mergeProviderRemoteCompactionConfig(modelConfig: RemoteCompactionConfig<Api> | undefined, providerConfig: RemoteCompactionConfig<Api> | undefined): RemoteCompactionConfig<Api> | undefined;
/**
 * The patchable subset of `Model` fields shared by `modelOverrides` entries,
 * custom model definitions, and parsed custom-model overlays. `undefined`
 * always means "leave the base value alone".
 */
export interface ModelPatch {
    name?: string;
    reasoning?: boolean;
    thinking?: ThinkingConfig;
    input?: ("text" | "image")[];
    imageInputDecoder?: Model<Api>["imageInputDecoder"];
    tokenizer?: Model<Api>["tokenizer"];
    supportsTools?: boolean;
    cost?: Partial<Model<Api>["cost"]>;
    contextWindow?: number;
    maxTokens?: number;
    omitMaxOutputTokens?: boolean;
    headers?: Record<string, string>;
    compat?: ModelSpec<Api>["compat"];
    contextPromotionTarget?: string;
    compactionModel?: string;
    remoteCompaction?: RemoteCompactionConfig<Api>;
    premiumMultiplier?: number;
}
/**
 * How a patch treats the base model's transport metadata (headers/compat):
 * - `merge`: fold the patch into the base's (modelOverrides semantics).
 * - `replace`: the patch owns transport wholesale — same-id custom definitions
 *   already folded provider-level headers/compat in during parsing, so bundled
 *   transport metadata must not be re-merged (see `#mergeCustomModels`).
 */
type ModelTransportPolicy = "merge" | "replace";
export declare function applyModelPatch(base: Model<Api>, patch: ModelPatch, transport: ModelTransportPolicy): Model<Api>;
export declare function applyModelOverride(model: Model<Api>, override: ModelOverride): Model<Api>;
export {};
