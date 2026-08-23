import { type AuthStorage } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
/** Execute xAI Responses API web search. */
export declare function searchXAI(params: SearchParams): Promise<SearchResponse>;
/** Search provider for xAI web search. */
export declare class XAIProvider extends SearchProvider {
    readonly id = "xai";
    readonly label = "xAI";
    isAvailable(authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
