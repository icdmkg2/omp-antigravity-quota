/**
 * OpenAI Codex Web Search Provider
 *
 * Uses the configured Codex Responses transport for proxy/API-key setups and
 * the official ChatGPT backend for OAuth logins.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
export interface CodexSearchParams {
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
    query: string;
    system_prompt?: string;
    num_results?: number;
    /** Search context size: controls how much web content to include */
    search_context_size?: "low" | "medium" | "high";
}
/**
 * Executes a web search using OpenAI Codex's built-in web search tool.
 *
 * Default-model behavior:
 * - If `PI_CODEX_WEB_SEARCH_MODEL` is set, use it exactly once and surface any
 *   upstream error verbatim.
 * - Otherwise prefer ChatGPT-account-safe bundled defaults (GPT-5.6 Luna,
 *   Terra, Sol, GPT-5.5, …) and retry the next candidate only when Codex
 *   returns the known 400 "model is not supported" family. This avoids
 *   selecting `gpt-5-codex-mini` first on ChatGPT accounts, which OpenAI
 *   rejects.
 */
export declare function searchCodex(params: SearchParams): Promise<SearchResponse>;
/**
 * Checks whether Codex web search has an API key or OAuth credential.
 */
export declare function hasCodexSearch(authStorage: AuthStorage): Promise<boolean>;
/** Search provider for OpenAI Codex web search. */
export declare class CodexProvider extends SearchProvider {
    readonly id = "codex";
    readonly label = "OpenAI";
    isAvailable(authStorage: AuthStorage): Promise<boolean> | boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
