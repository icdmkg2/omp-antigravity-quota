/**
 * Anthropic Web Search Provider
 *
 * Uses Claude's built-in web_search_20250305 tool to search the web.
 * Returns synthesized answers with citations and source metadata.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
export interface AnthropicSearchParams {
    query: string;
    system_prompt?: string;
    num_results?: number;
    max_tokens?: number;
    temperature?: number;
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
}
/**
 * Executes a web search using Anthropic's Claude with built-in web search tool.
 * @param params - Search parameters including query and optional settings
 * @returns Search response with synthesized answer, sources, and citations
 * @throws {Error} If no Anthropic credentials are configured
 */
export declare function searchAnthropic(params: SearchParams | AnthropicSearchParams, _legacyStorage?: unknown): Promise<SearchResponse>;
/** Search provider for Anthropic Claude web search. */
export declare class AnthropicProvider extends SearchProvider {
    readonly id = "anthropic";
    readonly label = "Anthropic";
    isAvailable(authStorage: AuthStorage): Promise<boolean> | boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
