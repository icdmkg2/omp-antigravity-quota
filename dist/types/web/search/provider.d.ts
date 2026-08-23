import type { AuthStorage } from "@oh-my-pi/pi-ai";
import type { SearchProvider } from "./providers/base.js";
import { type SearchProviderId } from "./types.js";
export type { SearchParams } from "./providers/base.js";
export { SearchProvider } from "./providers/base.js";
export { SEARCH_PROVIDER_ORDER } from "./types.js";
/** Cheap, sync metadata accessor — never triggers a provider load. */
export declare function getSearchProviderLabel(id: SearchProviderId): string;
/** Format one provider failure for the user-facing fallback summary. */
export declare function formatSearchProviderFailure(error: unknown, provider: Pick<SearchProvider, "id" | "label">): string;
/** Format the ordered provider fallback failures for terminal/tool output. */
export declare function formatSearchProviderFailures(failures: readonly {
    provider: Pick<SearchProvider, "id" | "label">;
    error: unknown;
}[]): string;
/**
 * Resolve and cache a provider instance. First call for a given id loads the
 * underlying module; subsequent calls return the cached singleton.
 */
export declare function getSearchProvider(id: SearchProviderId): Promise<SearchProvider>;
/**
 * Prioritize configured providers while retaining every unlisted provider in
 * its built-in relative order. Invalid IDs are ignored defensively. Listed
 * providers are treated as explicit selections: they resolve through
 * `isExplicitlyAvailable`, so e.g. a hand-listed Perplexity may fall back to
 * anonymous search exactly like the retired single-preference setting did.
 */
export declare function setSearchProviderOrder(providers: readonly SearchProviderId[]): void;
/** Set providers that web search should never use, including fallbacks. */
export declare function setExcludedSearchProviders(providers: readonly SearchProviderId[]): void;
/** `true` when settings exclude `id` from web search (auto chain and the Public Web fan-out). */
export declare function isSearchProviderExcluded(id: SearchProviderId): boolean;
export interface SearchProviderCandidate {
    id: SearchProviderId;
    explicit: boolean;
}
/**
 * Return provider candidates in fallback order without loading their modules.
 * `forcedProvider` (a per-request `provider` argument) is terminal-first and
 * bypasses exclusion; configured-order entries carry `explicit: true`.
 */
export declare function resolveProviderCandidates(forcedProvider?: SearchProviderId): SearchProviderCandidate[];
/**
 * Resolve the complete available provider chain.
 *
 * This compatibility helper loads every candidate. Search execution should use
 * {@link resolveProviderCandidates} so fallback modules load only when reached.
 */
export declare function resolveProviderChain(authStorage: AuthStorage, forcedProvider?: SearchProviderId): Promise<SearchProvider[]>;
