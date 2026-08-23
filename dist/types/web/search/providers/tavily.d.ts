/**
 * Tavily Web Search Provider
 *
 * Uses Tavily's agent-focused search API to return structured results with an
 * optional synthesized answer.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
export interface TavilySearchParams {
    query: string;
    num_results?: number;
    recency?: "day" | "week" | "month" | "year";
    /** `site:` hosts mapped to Tavily's `include_domains`. */
    include_domains?: string[];
    /** `-site:` hosts mapped to Tavily's `exclude_domains`. */
    exclude_domains?: string[];
    /** `after:` inclusive lower bound, ISO `YYYY-MM-DD`, mapped to `start_date`. */
    start_date?: string;
    /** `before:` upper bound, ISO `YYYY-MM-DD`, mapped to `end_date`. */
    end_date?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
}
/** Find Tavily API key through AuthStorage's unified refresh pipeline. */
export declare function findApiKey(authStorage: AuthStorage, sessionId: string | undefined, signal: AbortSignal | undefined): Promise<string | null>;
/** Exported for testing. Builds the Tavily request body from unified params. */
export declare function buildRequestBody(params: TavilySearchParams): Record<string, unknown>;
/** Execute Tavily web search. */
export declare function searchTavily(params: SearchParams): Promise<SearchResponse>;
/** Search provider for Tavily web search. */
export declare class TavilyProvider extends SearchProvider {
    readonly id = "tavily";
    readonly label = "Tavily";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
