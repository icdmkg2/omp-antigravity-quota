import type { AuthStorage } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
/** Execute a Google web search with fetch-first loading and a headless-browser fallback. */
export declare function searchGoogle(params: SearchParams): Promise<SearchResponse>;
/** Fetch-first Google Search provider with a headless-browser fallback; no API key is required. */
export declare class GoogleProvider extends SearchProvider {
    readonly id = "google";
    readonly label = "Google";
    isAvailable(_authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
