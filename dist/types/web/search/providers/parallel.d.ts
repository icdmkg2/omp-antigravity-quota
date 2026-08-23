import { type AuthStorage, type FetchImpl } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import { type StructuredQuery } from "../query.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
export declare function searchParallel(params: {
    query: string;
    num_results?: number;
    recency?: SearchParams["recency"];
    signal?: AbortSignal;
    timeoutMs?: number;
    fetch?: FetchImpl;
    parsedQuery?: StructuredQuery;
}, authStorage: AuthStorage, sessionId?: string): Promise<SearchResponse>;
export declare class ParallelProvider extends SearchProvider {
    readonly id = "parallel";
    readonly label = "Parallel";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
