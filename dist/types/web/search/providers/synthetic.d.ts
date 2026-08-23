/**
 * Synthetic Web Search Provider
 *
 * Uses Synthetic's zero-data-retention web search API for coding agents.
 * Endpoint: POST https://api.synthetic.new/v2/search
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
type SearchParamsWithFetch = SearchParams & {
    fetch?: FetchImpl;
};
/** Resolve Synthetic API key through the shared auth storage pipeline. */
export declare function findApiKey(authStorage: AuthStorage, sessionId?: string, signal?: AbortSignal): Promise<string | undefined>;
/** Execute Synthetic web search. */
export declare function searchSynthetic(params: SearchParamsWithFetch): Promise<SearchResponse>;
/** Search provider for Synthetic. */
export declare class SyntheticProvider extends SearchProvider {
    readonly id = "synthetic";
    readonly label = "Synthetic";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParamsWithFetch): Promise<SearchResponse>;
}
export {};
