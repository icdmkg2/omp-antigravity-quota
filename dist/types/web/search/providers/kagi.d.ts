/**
 * Kagi Web Search Provider
 *
 * Thin wrapper that adapts shared Kagi API utilities to SearchResponse shape.
 */
import type { AuthStorage, FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { StructuredQuery } from "../query.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
type SearchParamsWithFetch = SearchParams & {
    fetch?: FetchImpl;
};
/** Execute Kagi web search. */
export declare function searchKagi(params: {
    query: string;
    num_results?: number;
    recency?: SearchParams["recency"];
    parsedQuery?: StructuredQuery;
    signal?: AbortSignal;
    timeoutMs?: number;
    authStorage: AuthStorage;
    sessionId?: string;
    fetch?: FetchImpl;
}): Promise<SearchResponse>;
/** Search provider for Kagi web search. */
export declare class KagiProvider extends SearchProvider {
    readonly id = "kagi";
    readonly label = "Kagi";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParamsWithFetch): Promise<SearchResponse>;
}
export {};
