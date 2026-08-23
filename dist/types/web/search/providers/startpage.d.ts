import type { AuthStorage } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
/** Execute a Startpage web search via the homepage-token form flow. */
export declare function searchStartpage(params: SearchParams): Promise<SearchResponse>;
/** Search provider for Startpage (no API key required). */
export declare class StartpageProvider extends SearchProvider {
    readonly id = "startpage";
    readonly label = "Startpage";
    isAvailable(_authStorage: AuthStorage): boolean;
    isExplicitlyAvailable(_authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
