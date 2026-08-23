/**
 * Z.AI Web Search Provider
 *
 * Calls Z.AI's remote MCP server (`webSearchPrime`) and adapts results into
 * the unified SearchResponse shape used by the web search tool.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
export interface ZaiSearchParams {
    query: string;
    num_results?: number;
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
    authStorage: AuthStorage;
    sessionId?: string;
}
/** Resolve Z.AI API credentials through the unified auth storage pipeline. */
export declare function findApiKey(authStorage: AuthStorage, sessionId?: string, signal?: AbortSignal): Promise<string | null>;
/** Execute Z.AI web search via remote MCP endpoint. */
export declare function searchZai(params: ZaiSearchParams): Promise<SearchResponse>;
/** Search provider for Z.AI web search MCP. */
export declare class ZaiProvider extends SearchProvider {
    readonly id = "zai";
    readonly label = "Z.AI";
    isAvailable(authStorage: AuthStorage): Promise<boolean> | boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
