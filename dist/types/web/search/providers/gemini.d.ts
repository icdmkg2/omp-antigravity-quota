/**
 * Google Gemini Web Search Provider
 *
 * Uses Gemini's Google Search grounding via Cloud Code Assist API.
 * Auth is resolved through `AuthStorage.getOAuthAccess(...)` for both
 * `google-gemini-cli` (stable prod) and `google-antigravity` (daily sandbox)
 * — the broker is the sole refresh authority, so this module never opens a
 * sibling SQLite store and never POSTs the broker sentinel to a Google token
 * endpoint.
 */
import { type AuthStorage, type FetchImpl, type OAuthAccess } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import { type StructuredQuery } from "../query.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
declare const GEMINI_PROVIDERS: readonly ["google-gemini-cli", "google-antigravity"];
type GeminiProviderId = (typeof GEMINI_PROVIDERS)[number];
interface GeminiToolParams {
    google_search?: Record<string, unknown>;
    code_execution?: Record<string, unknown>;
    url_context?: Record<string, unknown>;
}
export interface GeminiSearchParams extends GeminiToolParams {
    query: string;
    /** Pre-parsed structured query; falls back to parsing `query` when omitted. */
    parsedQuery?: StructuredQuery;
    system_prompt?: string;
    num_results?: number;
    /** Maximum output tokens. */
    max_output_tokens?: number;
    /** Sampling temperature (0–1). Lower = more focused/factual. */
    temperature?: number;
    signal?: AbortSignal;
    timeoutMs?: number;
    authStorage: AuthStorage;
    sessionId?: string;
    fetch?: FetchImpl;
    antigravityEndpointMode?: "auto" | "production" | "sandbox";
    geminiModel?: string;
}
export declare function buildGeminiRequestTools(params: GeminiToolParams): Array<Record<string, Record<string, unknown>>>;
/** First configured Gemini OAuth provider plus its pre-resolved access. */
interface GeminiAuthSeed {
    provider: GeminiProviderId;
    access: OAuthAccess;
    projectId: string;
}
/**
 * Walks the configured Gemini OAuth providers in deterministic order and
 * returns the first one that yields a usable access token + projectId via
 * {@link AuthStorage.getOAuthAccess}. AuthStorage handles refresh + broker
 * routing internally; this helper never touches refresh tokens directly.
 * The resolved access seeds `withOAuthAccess` so the happy path resolves once.
 */
export declare function findGeminiAuth(authStorage: AuthStorage, sessionId: string | undefined, signal: AbortSignal | undefined): Promise<GeminiAuthSeed | null>;
/**
 * Executes a web search using Google Gemini with Google Search grounding.
 */
export declare function searchGemini(params: GeminiSearchParams): Promise<SearchResponse>;
/** Search provider for Google Gemini web search. */
export declare class GeminiProvider extends SearchProvider {
    readonly id = "gemini";
    readonly label = "Gemini";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
export {};
