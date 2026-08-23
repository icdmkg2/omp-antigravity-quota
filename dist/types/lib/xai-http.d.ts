import type { ModelRegistry } from "../config/model-registry.js";
interface XAICredentials {
    provider: "xai-oauth" | "xai";
    apiKey: string;
    baseURL: string;
}
/** xAI provider ids supported by shared HTTP tool transport resolution. */
export type XAIHttpProvider = "xai-oauth" | "xai";
/** Resolved endpoint and configured headers for an xAI HTTP tool request. */
export interface XAIHttpTransport {
    baseURL: string;
    headers?: Record<string, string>;
}
/**
 * Resolve an xAI tool endpoint and its provider/model header overrides.
 */
export declare function resolveXAIHttpTransport(modelRegistry: ModelRegistry, provider: XAIHttpProvider, modelId?: string): XAIHttpTransport;
/**
 * Resolve xAI credentials for HTTP tool calls.
 *
 * Credential priority:
 *   1. xai-oauth — only when a *dedicated* xai-oauth source exists. Composed
 *      of two checks against the registry layer:
 *        a. `authStorage.hasNonEnvCredential("xai-oauth")` covers stored
 *           credentials (OAuth or api_key), runtime overrides (CLI
 *           `--api-key` for xai-oauth), config overrides (models.yml
 *           `providers.xai-oauth.apiKey`), and fallback resolvers.
 *        b. `$env.XAI_OAUTH_TOKEN` covers the xai-oauth-specific env var.
 *      `XAI_API_KEY` is intentionally NOT a signal here, even though the
 *      env-fallback map (`stream.ts: "xai-oauth"`) lets xai-oauth borrow it
 *      as a back-compat convenience: the borrow lets API-key-only setups
 *      satisfy the xai-oauth branch and then resolve baseUrl under
 *      xai-oauth instead of xai, silently bypassing `providers.xai.baseUrl`
 *      overrides for image/TTS traffic. The gate routes the borrow case to
 *      step 2 while preserving every dedicated xai-oauth path.
 *   2. xai (plain API key). Delegates to ModelRegistry.getApiKeyForProvider
 *      which runs AuthStorage.getApiKey's full cascade: runtime override →
 *      models.yml config override → stored api_key credential → OAuth
 *      resolution → XAI_API_KEY env var → custom fallback resolver.
 *
 * baseURL: see `resolveXAIBaseURL` above. Resolved AFTER the credential
 * decision so the scoped (provider, id) lookup is unambiguous. `modelId`
 * is optional; probes / tool-availability checks pass `undefined` and fall
 * through to env/default.
 *
 * Returns null when neither credential is available. Caller is responsible
 * for surfacing an actionable error message in that case.
 */
export declare function resolveXAIHttpCredentials(modelRegistry: ModelRegistry, modelId?: string): Promise<XAICredentials | null>;
export {};
