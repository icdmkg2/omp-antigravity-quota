/**
 * Unified Web Search Tool
 *
 * Single tool supporting Anthropic, Perplexity, Exa, Brave, Jina, Kimi, Gemini, Codex, Tavily, Kagi, Z.AI, SearXNG, and Synthetic
 * providers with provider-specific parameters exposed conditionally.
 */
import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { AuthStorage } from "@oh-my-pi/pi-ai";
import { ModelRegistry } from "../../config/model-registry.js";
import type { CustomTool } from "../../extensibility/custom-tools/types.js";
import type { ToolSession } from "../../tools/index.js";
import { type SearchRenderDetails } from "./render.js";
import { type SearchProviderId } from "./types.js";
/** Web search tool parameters schema */
export declare const webSearchSchema: import("@oh-my-pi/omptype").FluentType<{
    limit?: number | undefined;
    max_tokens?: number | undefined;
    num_search_results?: number | undefined;
    query: string;
    recency?: "day" | "month" | "week" | "year" | undefined;
    temperature?: number | undefined;
}, {
    limit?: number | undefined;
    max_tokens?: number | undefined;
    num_search_results?: number | undefined;
    query: string;
    recency?: "day" | "month" | "week" | "year" | undefined;
    temperature?: number | undefined;
}>;
export type SearchToolParams = typeof webSearchSchema.infer;
export interface SearchQueryParams extends SearchToolParams {
    provider?: SearchProviderId | "auto";
}
/**
 * Execute a web search query for CLI/testing workflows.
 *
 * `authStorage` may be omitted; in that case we discover one via the standard
 * factory (`discoverAuthStorage`), which honours `OMP_AUTH_BROKER_URL` and
 * otherwise opens the local SQLite credential store.
 */
export declare function runSearchQuery(params: SearchQueryParams, options?: {
    authStorage?: AuthStorage;
    modelRegistry?: ModelRegistry;
    sessionId?: string;
    signal?: AbortSignal;
}): Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
    details: SearchRenderDetails;
}>;
/**
 * Web search tool implementation.
 *
 * Supports the configured web-search provider chain with automatic fallback.
 */
export declare class WebSearchTool implements AgentTool<typeof webSearchSchema, SearchRenderDetails> {
    #private;
    readonly name = "web_search";
    readonly approval: "read";
    readonly label = "Web Search";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        limit?: number | undefined;
        max_tokens?: number | undefined;
        num_search_results?: number | undefined;
        query: string;
        recency?: "day" | "month" | "week" | "year" | undefined;
        temperature?: number | undefined;
    }, {
        limit?: number | undefined;
        max_tokens?: number | undefined;
        num_search_results?: number | undefined;
        query: string;
        recency?: "day" | "month" | "week" | "year" | undefined;
        temperature?: number | undefined;
    }>;
    readonly strict = true;
    readonly loadMode = "discoverable";
    readonly summary = "Search the web for up-to-date information";
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: SearchToolParams, signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<SearchRenderDetails>, _context?: AgentToolContext): Promise<AgentToolResult<SearchRenderDetails>>;
}
/** Web search tool as CustomTool (for TUI rendering support) */
export declare const webSearchCustomTool: CustomTool<typeof webSearchSchema, SearchRenderDetails>;
export declare function getSearchTools(): CustomTool<any, any>[];
export { getSearchProvider, setExcludedSearchProviders, setSearchProviderOrder } from "./provider.js";
export type { SearchProviderId as SearchProvider, SearchResponse } from "./types.js";
export { isSearchProviderId, isSearchProviderPreference } from "./types.js";
