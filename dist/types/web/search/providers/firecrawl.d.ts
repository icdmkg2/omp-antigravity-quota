/**
 * Firecrawl Web Search Provider
 *
 * Calls Firecrawl's search API and maps web results into the unified
 * SearchResponse shape used by the web search tool.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
export interface FirecrawlSearchParams {
    query: string;
    num_results?: number;
    recency?: SearchParams["recency"];
    /** Explicit `tbs` (custom date range); takes precedence over `recency`. */
    tbs?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
}
/** Resolve Firecrawl API key through the shared auth storage pipeline. */
export declare function findApiKey(authStorage: AuthStorage, sessionId?: string, signal?: AbortSignal): Promise<string | undefined>;
/** Execute Firecrawl web search. */
export declare function searchFirecrawl(params: SearchParams): Promise<SearchResponse>;
/** Search provider for Firecrawl web search. */
export declare class FirecrawlProvider extends SearchProvider {
    readonly id = "firecrawl";
    readonly label = "Firecrawl";
    /**
     * Auto-chain admission requires either a credential or an explicitly
     * configured self-hosted endpoint. Hosted keyless mode remains explicit-only
     * so it does not displace providers the user configured.
     */
    isAvailable(authStorage: AuthStorage): boolean;
    /**
     * Firecrawl supports keyless mode, so an explicit user selection
     * (`webSearch: firecrawl`) works without any credential configured.
     */
    isExplicitlyAvailable(_authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
