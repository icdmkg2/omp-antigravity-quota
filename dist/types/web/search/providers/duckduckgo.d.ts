import type { AuthStorage } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../../../web/search/types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
/**
 * Map a parsed `lang:` locale onto DuckDuckGo's documented `kl` values.
 *
 * Shared queries use `language-region` order while DDG generally uses
 * `region-language`. Provider-specific exceptions resolve through
 * {@link DDG_LOCALE_ALIASES}; all other values must survive the documented
 * allowlist after swapping or the caller keeps its default region.
 */
export declare function localeToKl(lang: string | undefined): string | undefined;
/** Execute a DuckDuckGo web search via the no-JS HTML frontend. */
export declare function searchDuckDuckGo(params: SearchParams): Promise<SearchResponse>;
/** Search provider for DuckDuckGo (no API key required). */
export declare class DuckDuckGoProvider extends SearchProvider {
    readonly id = "duckduckgo";
    readonly label = "DuckDuckGo";
    isAvailable(_authStorage: AuthStorage): boolean;
    isExplicitlyAvailable(_authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
