import type { Api, Model } from "@oh-my-pi/pi-ai/types";
import { type OpenAICodexAccount } from "@oh-my-pi/pi-catalog/provider-models";
import type { AuthStorage, OAuthCredential } from "../session/auth-storage.js";
export declare const STARTUP_MODEL_CACHE_PROVIDER_IDS: readonly string[];
/**
 * Hard bound for extension-provided fetchDynamicModels to prevent indefinite hangs
 * during runtime provider discovery. Uses a cancellable manual timer (not AbortSignal.timeout)
 * so a successful fast path does not leave an armed timeout signal for concurrent GC.
 */
export declare const RUNTIME_DYNAMIC_MODEL_FETCH_TIMEOUT_MS = 15000;
export declare const BUILT_IN_DISCOVERY_CACHE_TTL_MS: number;
export declare const BUILT_IN_DISCOVERY_NON_AUTHORITATIVE_RETRY_MS: number;
export declare const kNoAuth = "N/A";
export declare function isAuthenticated(apiKey: string | undefined | null): apiKey is string;
export declare function isDiscoveryBearerApiKey(apiKey: string | undefined | null): apiKey is string;
/**
 * Wraps an extension-provided fetchDynamicModels call with a hard timeout.
 * Uses a cancellable manual timer (not AbortSignal.timeout) so that a fast
 * successful path does not leave an armed timeout signal for concurrent GC.
 * The inner fetcher does not receive a signal (extension contract has none).
 */
export declare function withRuntimeDynamicModelsTimeout<T>(timeoutMs: number, run: () => Promise<T>): Promise<T>;
export interface BuiltInDiscoveryResult {
    models: Model<Api>[];
    authoritativeProviders: Set<string>;
}
export type ProviderDiscoveryStatus = "idle" | "ok" | "empty" | "cached" | "unavailable" | "unauthenticated";
export interface ProviderDiscoveryState {
    provider: string;
    status: ProviderDiscoveryStatus;
    optional: boolean;
    stale: boolean;
    fetchedAt?: number;
    models: string[];
    error?: string;
}
export declare function extractGoogleOAuthToken(value: string | undefined): string | undefined;
/**
 * Pull the GCP project id out of a Google structured discovery key
 * (`{ token, projectId, ... }` or `{ token, project_id, ... }`). Runtime/config API-key overrides and
 * refreshed OAuth credentials carry the project inline; raw bare tokens do
 * not. Returns `undefined` when the value is not structured or omits the id.
 */
export declare function extractGoogleOAuthProjectId(value: string | undefined): string | undefined;
export declare function getOAuthCredentialsForProvider(authStorage: AuthStorage, provider: string): OAuthCredential[];
/**
 * Resolve every configured Codex OAuth account for catalog discovery, refreshing
 * each credential exactly once. Codex `/models` is account-scoped, so discovery
 * must fetch per account and union the results; resolving a single access token
 * (as before) hid models available only through a sibling account (#6265).
 *
 * Returns `null` when any stored account fails to resolve (e.g. a transient
 * refresh failure): the Codex manager is authoritative, so unioning only the
 * accounts that resolved would cache a partial catalog and hide the failed
 * account's models for the cache TTL. Aborting keeps the previous/bundled
 * catalog instead.
 */
export declare function resolveCodexDiscoveryAccounts(authStorage: AuthStorage, resolvedAccessToken: string): Promise<OpenAICodexAccount[] | null>;
