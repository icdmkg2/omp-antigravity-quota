/**
 * Kagi API Client
 *
 * Implements the Kagi V1 Search API (POST /api/v1/search), the public-preview
 * successor to the sunset V0 endpoint. Authentication is resolved exclusively
 * through the shared {@link AuthStorage} broker (Bearer token), and responses
 * are categorized result buckets rather than the legacy flat object array.
 */
import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
/** V1 search request body. */
export interface KagiSearchRequest {
    query: string;
    /** Workflow mode: "search" | "research". */
    workflow?: string;
    /** Number of results (1-100). */
    limit?: number;
    /** Lens identifier (e.g. "news", "reddit"). */
    lens?: string;
    /** Time-based filters as ISO date strings (YYYY-MM-DD). */
    filters?: {
        after?: string;
        before?: string;
    };
}
/** Individual V1 result item. */
export interface KagiSearchResultItem {
    url: string;
    title: string;
    snippet?: string;
    /** ISO timestamp or relative string ("2h ago"). */
    time?: string;
    /** Thumbnail image. */
    image?: {
        url: string;
        height?: number;
        width?: number;
    };
    /** Extra metadata key-value pairs. */
    props?: Record<string, unknown>;
}
/** V1 categorizes results into named buckets; only consumed buckets are typed. */
export interface KagiSearchData {
    search?: KagiSearchResultItem[];
    video?: KagiSearchResultItem[];
    news?: KagiSearchResultItem[];
    infobox?: KagiSearchResultItem[];
    adjacent_question?: KagiSearchResultItem[];
    related_search?: KagiSearchResultItem[];
    direct_answer?: KagiSearchResultItem[];
}
/** V1 error entry. */
export interface KagiErrorEntry {
    code?: number;
    url?: string;
    message?: string;
    msg?: string;
    location?: string;
}
/** V1 success response. */
export interface KagiSearchResponse {
    meta?: {
        trace?: string;
        id?: string;
        ms?: number;
    };
    data?: KagiSearchData;
    error?: KagiErrorEntry[];
}
/** V1 error response. */
export interface KagiErrorResponse {
    meta?: Record<string, unknown>;
    error?: string | KagiErrorEntry[];
    message?: string;
    detail?: string;
}
export declare class KagiApiError extends Error {
    readonly statusCode?: number;
    constructor(message: string, statusCode?: number);
}
export interface KagiSearchOptions {
    limit?: number;
    recency?: "day" | "week" | "month" | "year";
    sessionId?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
}
export interface KagiSearchSource {
    title: string;
    url: string;
    snippet?: string;
    publishedDate?: string;
}
export interface KagiSearchResult {
    requestId: string;
    sources: KagiSearchSource[];
    relatedQuestions: string[];
    answer?: string;
}
export declare function searchWithKagi(query: string, options: KagiSearchOptions | undefined, authStorage: AuthStorage): Promise<KagiSearchResult>;
