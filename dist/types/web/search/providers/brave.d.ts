/**
 * Brave Web Search Provider
 *
 * Calls Brave's web search REST API and maps results into the unified
 * SearchResponse shape used by the web search tool.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { StructuredQuery } from "../query.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
export interface BraveSearchParams {
    query: string;
    num_results?: number;
    recency?: "day" | "week" | "month" | "year";
    parsedQuery?: StructuredQuery;
    /** Two-letter market code, or `ALL`. */
    country?: string;
    /** Brave search language code, such as `en` or `zh-hans`. */
    search_lang?: string;
    safesearch?: "off" | "moderate" | "strict";
    authStorage: AuthStorage;
    sessionId?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
}
/** Execute Brave web search. */
export declare function searchBrave(params: BraveSearchParams): Promise<SearchResponse>;
/** Search provider for Brave web search. */
export declare class BraveProvider extends SearchProvider {
    readonly id = "brave";
    readonly label = "Brave";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
