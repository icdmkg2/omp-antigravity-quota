/**
 * Kimi Web Search Provider
 *
 * Uses the Kimi Code search API to retrieve web results. This is the Kimi Code
 * membership service, distinct from the Moonshot Open Platform — it requires a
 * Kimi Code Console credential (`omp /login kimi-code` or an explicit
 * `MOONSHOT_SEARCH_API_KEY` / `KIMI_SEARCH_API_KEY`), not `MOONSHOT_API_KEY`.
 * Endpoint: POST https://api.kimi.com/coding/v1/search
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import { type StructuredQuery } from "../query.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
type SearchParamsWithFetch = SearchParams & {
    fetch?: FetchImpl;
};
export interface KimiSearchParams {
    query: string;
    parsedQuery?: StructuredQuery;
    num_results?: number;
    include_content?: boolean;
    signal?: AbortSignal;
    timeoutMs?: number;
    authStorage: AuthStorage;
    sessionId?: string;
    fetch?: FetchImpl;
}
/** Execute Kimi web search. */
export declare function searchKimi(params: KimiSearchParams): Promise<SearchResponse>;
/** Search provider for Kimi web search. */
export declare class KimiProvider extends SearchProvider {
    readonly id = "kimi";
    readonly label = "Kimi";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParamsWithFetch): Promise<SearchResponse>;
}
export {};
