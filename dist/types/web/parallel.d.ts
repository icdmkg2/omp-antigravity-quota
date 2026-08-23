import { type FetchImpl } from "@oh-my-pi/pi-ai";
import type { AgentStorage } from "../session/agent-storage.js";
export declare const PARALLEL_SEARCH_URL = "https://api.parallel.ai/v1beta/search";
export declare const PARALLEL_BETA_HEADER = "search-extract-2025-10-10";
export interface ParallelUsageItem {
    name?: string;
    count?: number;
}
export interface ParallelSearchSource {
    title: string;
    url: string;
    snippet?: string;
    publishedDate?: string;
    excerpts: string[];
}
export interface ParallelSearchResult {
    requestId: string;
    sources: ParallelSearchSource[];
    warnings: string[];
    usage: ParallelUsageItem[];
}
export interface ParallelExtractDocument {
    url: string;
    title?: string;
    publishedDate?: string;
    excerpts: string[];
    fullContent?: string;
}
export interface ParallelExtractErrorEntry {
    url: string;
    errorType?: string;
    httpStatusCode?: number;
    content?: string;
}
export interface ParallelExtractResult {
    requestId: string;
    results: ParallelExtractDocument[];
    errors: ParallelExtractErrorEntry[];
    warnings: string[];
    usage: ParallelUsageItem[];
}
export interface ParallelSearchOptions {
    mode?: "fast" | "research";
    maxCharsPerResult?: number;
    signal?: AbortSignal;
    fetch?: FetchImpl;
}
export interface ParallelExtractOptions {
    objective?: string;
    searchQueries?: string[];
    excerpts?: boolean;
    fullContent?: boolean;
    signal?: AbortSignal;
    fetch?: FetchImpl;
}
export declare class ParallelApiError extends Error {
    readonly statusCode?: number;
    constructor(message: string, statusCode?: number);
}
export declare function parseParallelErrorResponse(statusCode: number, responseText: string): ParallelApiError;
export declare function parseParallelJsonResponse(response: Response, operation: "search" | "extract"): Promise<unknown>;
export declare function parseParallelSearchPayload(payload: unknown, options?: {
    parseMetadata?: boolean;
}): ParallelSearchResult;
export declare function findParallelApiKey(storage: AgentStorage | null | undefined): string | null;
export declare function getParallelExtractContent(document: ParallelExtractDocument): string;
export declare function searchWithParallel(objective: string, queries: string[], options: ParallelSearchOptions, storage: AgentStorage | null | undefined): Promise<ParallelSearchResult>;
export declare function extractWithParallel(urls: string[], options: ParallelExtractOptions, storage: AgentStorage | null | undefined): Promise<ParallelExtractResult>;
