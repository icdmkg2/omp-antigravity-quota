/**
 * SearXNG Web Search Provider
 *
 * Calls a SearXNG instance's JSON search API and maps results into the unified
 * SearchResponse shape used by the web search tool.
 *
 * SearXNG is a free, open-source metasearch engine that aggregates results from
 * multiple sources without tracking users. It supports self-hosted instances
 * and various authentication methods (bearer token, basic auth, or none).
 *
 * Configuration via settings:
 *   searxng.endpoint      - Base URL of the SearXNG instance (e.g. https://searx.example.org)
 *   searxng.token         - Optional bearer token for authentication
 *   searxng.basicUsername - Optional RFC 7617 Basic auth username
 *   searxng.basicPassword - Optional RFC 7617 Basic auth password
 *   searxng.categories    - Optional comma-separated categories filter
 *   searxng.engines       - Optional comma-separated engine names or shortcuts
 *                           (e.g. "duckduckgo, br, sp"); shortcuts resolve via
 *                           the instance's /config endpoint
 *   searxng.language      - Optional language code (e.g. en, zh-CN)
 *
 * Environment variable fallbacks:
 *   SEARXNG_ENDPOINT       - Base URL of the SearXNG instance
 *   SEARXNG_TOKEN          - Optional bearer token
 *   SEARXNG_BASIC_USERNAME - Optional RFC 7617 Basic auth username
 *   SEARXNG_BASIC_PASSWORD - Optional RFC 7617 Basic auth password
 *
 * Bang syntax in queries is passed through: `!ddg foo` selects an engine or
 * category server-side and the bang token is stripped from the upstream query.
 * External bangs (`!!g`) are removed client-side because SearXNG answers them
 * with an HTTP redirect even for JSON requests.
 *
 * Reference: https://docs.searxng.org/dev/search_api.html
 */
import type { AuthStorage, FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { StructuredQuery } from "../query.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
/** Execute SearXNG web search. */
export declare function searchSearXNG(params: {
    query: string;
    parsedQuery?: StructuredQuery;
    num_results?: number;
    recency?: "day" | "week" | "month" | "year";
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
}): Promise<SearchResponse>;
/** Search provider for SearXNG web search. */
export declare class SearXNGProvider extends SearchProvider {
    readonly id = "searxng";
    readonly label = "SearXNG";
    isAvailable(_authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
