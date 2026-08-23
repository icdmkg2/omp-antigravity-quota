import type { AuthStorage } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
/** Execute a Mojeek web search against the standard HTML results page. */
export declare function searchMojeek(params: SearchParams): Promise<SearchResponse>;
/** Search provider for Mojeek (independent index, no API key required). */
export declare class MojeekProvider extends SearchProvider {
    readonly id = "mojeek";
    readonly label = "Mojeek";
    isAvailable(_authStorage: AuthStorage): boolean;
    isExplicitlyAvailable(_authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
