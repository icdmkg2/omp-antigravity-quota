import type { AuthStorage } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
/** Execute an Ecosia web search and parse the server-rendered result page. */
export declare function searchEcosia(params: SearchParams): Promise<SearchResponse>;
/** Search provider for Ecosia (no API key required). */
export declare class EcosiaProvider extends SearchProvider {
    readonly id = "ecosia";
    readonly label = "Ecosia";
    isAvailable(_authStorage: AuthStorage): boolean;
    isExplicitlyAvailable(_authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
