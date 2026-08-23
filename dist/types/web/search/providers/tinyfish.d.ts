/**
 * TinyFish Web Search Provider
 *
 * Calls TinyFish's search API and maps results into the unified
 * SearchResponse shape used by the web search tool.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
export interface TinyFishSearchParams {
    query: string;
    num_results?: number;
    recency?: SearchParams["recency"];
    page?: number;
    include_domains?: string[];
    exclude_domains?: string[];
    /** ISO 3166-1 alpha-2 region, e.g. `IT`. Geolocates results. */
    location?: string;
    /** ISO 639-1 language, e.g. `it`. */
    language?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
}
/** Resolve TinyFish API key through the shared auth storage pipeline. */
export declare function findApiKey(authStorage: AuthStorage, sessionId?: string, signal?: AbortSignal): Promise<string | undefined>;
/** Execute TinyFish web search. */
export declare function searchTinyFish(params: SearchParams): Promise<SearchResponse>;
/** Search provider for TinyFish web search. */
export declare class TinyFishProvider extends SearchProvider {
    readonly id = "tinyfish";
    readonly label = "TinyFish";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
