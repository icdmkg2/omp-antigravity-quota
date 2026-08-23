/**
 * Exa Web Search Provider
 *
 * High-quality neural search via Exa Search API.
 * Returns structured search results with optional content extraction.
 * Requests per-result summaries via `contents.summary` and synthesizes
 * them into a combined `answer` string on the SearchResponse.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
/** Reset Exa request pacing state for isolated provider tests. */
export declare function resetExaSearchThrottleForTest(): void;
type ExaSearchType = "neural" | "fast" | "auto" | "deep";
type ExaSearchParamType = ExaSearchType | "keyword";
export interface ExaSearchParams {
    query: string;
    num_results?: number;
    type?: ExaSearchParamType;
    include_domains?: string[];
    exclude_domains?: string[];
    start_published_date?: string;
    end_published_date?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
    /**
     * Credential source. Resolved before falling back to `EXA_API_KEY` so
     * Exa works when the key is stored via the broker/auth pipeline.
     */
    authStorage?: AuthStorage;
    sessionId?: string;
}
interface ExaSearchResult {
    title?: string | null;
    url?: string | null;
    author?: string | null;
    publishedDate?: string | null;
    text?: string | null;
    highlights?: string[] | null;
    summary?: string | null;
}
export declare function normalizeSearchType(type: ExaSearchParamType | undefined): ExaSearchType;
/**
 * Synthesize an answer string from per-result summaries returned by Exa.
 * Returns `undefined` when no non-empty summaries are available so callers
 * can leave `SearchResponse.answer` unset (matching other providers).
 */
export declare function synthesizeAnswer(results: ExaSearchResult[]): string | undefined;
/** Build the request body for `callExaSearch`. Exported for testing. */
export declare function buildExaRequestBody(params: ExaSearchParams): Record<string, unknown>;
/** Execute Exa web search */
export declare function searchExa(params: ExaSearchParams): Promise<SearchResponse>;
/** Search provider for Exa. */
export declare class ExaProvider extends SearchProvider {
    #private;
    readonly id = "exa";
    readonly label = "Exa";
    isAvailable(authStorage: AuthStorage): boolean;
    /**
     * Exa ships an unauthenticated public MCP fallback, so an explicit
     * selection (programmatic or via `providers.webSearch: exa`) routes
     * through MCP even when no credential is configured. The auto chain
     * still uses {@link isAvailable} so an unrelated configured provider
     * keeps priority over the public fallback.
     */
    isExplicitlyAvailable(_authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
export {};
