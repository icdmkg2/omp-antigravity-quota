/**
 * Jina Reader Web Search Provider
 *
 * Uses the Jina Reader `s.jina.ai` endpoint to fetch search results with
 * cleaned content.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
type SearchParamsWithFetch = SearchParams & {
    fetch?: FetchImpl;
};
export interface JinaSearchParams {
    query: string;
    authStorage: AuthStorage;
    sessionId?: string;
    num_results?: number;
    /** Single bare host for Jina's `X-Site` in-site search header. */
    site?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
}
/** Execute Jina web search. */
export declare function searchJina(params: JinaSearchParams): Promise<SearchResponse>;
/** Search provider for Jina Reader. */
export declare class JinaProvider extends SearchProvider {
    readonly id = "jina";
    readonly label = "Jina";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParamsWithFetch): Promise<SearchResponse>;
}
export {};
