/**
 * HTTP discovery protocols for configured and implicit providers — ollama,
 * llama.cpp, lm-studio, openai-models-list, and new-api/one-api-style proxies.
 * `ModelRegistry` owns the orchestration (status, state, caching) and calls
 * `discoverModelsByProviderType` with a `DiscoveryContext`; built-in provider
 * discovery lives in pi-catalog's provider-models.
 */
import { type ApiKey, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { Api, Model, RemoteCompactionConfig } from "@oh-my-pi/pi-ai/types";
import type { ModelSpec } from "@oh-my-pi/pi-catalog/types";
import type { ProviderDiscovery } from "./models-config-schema.js";
export declare const DISCOVERY_DEFAULT_CONTEXT_WINDOW = 128000;
export declare const DISCOVERY_DEFAULT_MAX_TOKENS = 32768;
/**
 * Pick a discovery-probe timeout for a local-engine base URL.
 *
 * The implicit `127.0.0.1` default probe keeps a tight `loopbackMs` cap so a
 * busy or foreign service on the default port never stalls startup. But that
 * cap is far too short for a host reached over the network: a user who points
 * `LLAMA_CPP_BASE_URL` / `OLLAMA_BASE_URL` / `OLLAMA_HOST` at a remote or LAN
 * machine has real round-trip latency, and a 250ms cap made that server look
 * empty (issue #7087). Anything that is not strictly loopback therefore gets
 * {@link REMOTE_DISCOVERY_TIMEOUT_MS}.
 */
export declare function discoveryProbeTimeoutMs(baseUrl: string, loopbackMs: number, customTimeoutMs?: number): number;
export declare function getImplicitOllamaBaseUrl(): string;
export declare function getOllamaContextLengthOverride(): number | undefined;
/** Routes discovered-model `maxTokens` defaults around Anthropic's 3× output divisor. */
export declare function discoveryDefaultMaxTokens(api: Api | undefined): number;
export interface DiscoveryProviderConfig {
    provider: string;
    api: Api;
    baseUrl?: string;
    headers?: Record<string, string>;
    compat?: ModelSpec<Api>["compat"];
    remoteCompaction?: RemoteCompactionConfig<Api>;
    discovery: ProviderDiscovery;
    optional?: boolean;
}
/** Registry-provided capabilities the protocol probes need; never the registry itself. */
export interface DiscoveryContext {
    /** Injected fetch implementation (tests stub this). */
    fetch: FetchImpl;
    /**
     * Resolve a provider's bearer credential for `Authorization: Bearer …`.
     * Returns undefined when no key is stored or it is a local/no-auth
     * sentinel; otherwise an {@link ApiKey} whose resolver participates in the
     * central force-refresh/rotate auth-retry policy on 401/usage-limit.
     */
    getBearerApiKeyResolver(provider: string): Promise<ApiKey | undefined>;
}
type DiscoveredModelRuntimeMetadata = {
    contextWindow?: number;
    maxTokens?: number;
    input?: ("text" | "image")[];
};
export declare function discoverModelsByProviderType(providerConfig: DiscoveryProviderConfig, ctx: DiscoveryContext): Promise<Model<Api>[]>;
export declare function discoverOllamaModels(providerConfig: DiscoveryProviderConfig, ctx: DiscoveryContext): Promise<Model<Api>[]>;
/**
 * applyLlamaCppQwenThinking rewrites a discovered or cached llama.cpp model so a
 * Qwen-family chat template (which defaults `enable_thinking: true`) can be
 * turned off. Qwen ids and the Qwen3.6-based PrismLM Ternary Bonsai GGUFs are
 * routed through chat-completions (the implicit llama.cpp provider defaults to
 * `openai-responses`, whose disable path has no Qwen encoding) with the
 * `qwen-template-false` dialect; omp emits `preserve_thinking` inside
 * `chat_template_kwargs` for Qwen, so the toggle rides there too and history
 * `<think>` blocks survive (`qwenPreserveThinking`). The runtime base URL gets a
 * `/v1` suffix because the chat-completions request would otherwise POST to the
 * native root, which does not serve it. A model with a custom transport (e.g.
 * `pi-native`, whose client appends `/v1/pi/stream`) keeps its base URL so the
 * suffix is not doubled. Non-Qwen models pass through unchanged. Applied on both
 * fresh discovery and cache load, so an upgraded cache is corrected without
 * waiting for re-discovery.
 */
export declare function applyLlamaCppQwenThinking(model: Model<Api>): Model<Api>;
export declare function discoverLlamaCppModels(providerConfig: DiscoveryProviderConfig, ctx: DiscoveryContext): Promise<Model<Api>[]>;
export declare function discoverLlamaCppModelRuntimeMetadata(model: Pick<Model<Api>, "provider" | "id" | "baseUrl" | "headers">, ctx: DiscoveryContext, customTimeoutMs?: number): Promise<DiscoveredModelRuntimeMetadata | undefined>;
/**
 * Re-probe LM Studio's native `/api/v0/models` for a single selected model so
 * its context window tracks the runtime lifecycle rather than the snapshot
 * captured at discovery time.
 *
 * A model discovered while unloaded is registered with `max_context_length`
 * (the architectural ceiling). When LM Studio JIT-loads it on first inference,
 * the running instance may serve a smaller `loaded_context_length` (user load
 * settings or context auto-fit). `getLmStudioNativeContextWindow` — invoked
 * inside `fetchLmStudioNativeModelMetadata` — prefers `loaded_context_length`
 * once `state === "loaded"`, so refreshing after selection swaps the stale
 * ceiling for the window the backend actually accepts (issue #9001). A later
 * unload re-probes back to `max_context_length`. This mirrors the llama.cpp
 * lazy-load refresh from #3310/#3311.
 *
 * `maxTokens` is carried through so the caller can re-cap output at the new
 * (possibly smaller) window; LM Studio native metadata reports no output cap
 * of its own.
 */
export declare function discoverLmStudioModelRuntimeMetadata(model: Pick<Model<Api>, "provider" | "id" | "baseUrl" | "headers" | "maxTokens">, ctx: DiscoveryContext, customTimeoutMs?: number): Promise<DiscoveredModelRuntimeMetadata | undefined>;
export declare function discoverOpenAIModelsList(providerConfig: DiscoveryProviderConfig, ctx: DiscoveryContext): Promise<Model<Api>[]>;
export declare function discoverLiteLLMModels(providerConfig: DiscoveryProviderConfig, ctx: DiscoveryContext): Promise<Model<Api>[]>;
/**
 * Discover models from an Anthropic+OpenAI-compatible reseller proxy that
 * exposes both `/v1/messages` and `/v1/chat/completions`, advertising each
 * model's wire capabilities through `supported_endpoint_types` on
 * `GET /v1/models` (new-api / one-api-style proxies).
 *
 * Routing per model:
 *   supported_endpoint_types: ["anthropic", ...] -> api: "anthropic-messages"
 *   supported_endpoint_types: ["openai"]         -> api: "openai-completions"
 *   missing / neither                            -> provider-level api fallback
 *
 * Anthropic models share the same baseUrl; the Anthropic SDK strips a
 * trailing `/v1` itself before appending `/v1/messages`, so the discovery
 * URL (which ends in `/v1`) round-trips correctly.
 */
export declare function discoverProxyModels(providerConfig: DiscoveryProviderConfig, ctx: DiscoveryContext): Promise<Model<Api>[]>;
export declare function normalizeLlamaCppBaseUrl(baseUrl?: string): string;
export declare function ensureLlamaCppV1BaseUrl(baseUrl: string): string;
export declare function normalizeLiteLLMDiscoveryBaseUrl(baseUrl?: string): string;
export declare function normalizeOpenAIModelsListBaseUrl(baseUrl?: string): string;
export {};
