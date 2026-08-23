import type { AuthStorage } from "@oh-my-pi/pi-ai";
import type { SearchResponse } from "../types.js";
import type { SearchParams } from "./base.js";
import { SearchProvider } from "./base.js";
/** Deadline overrides — test seam; production callers use the defaults. */
export interface PublicWebDeadlines {
    softMs?: number;
    hardMs?: number;
}
/**
 * Execute a web search against every credential-free engine in parallel and
 * consolidate the results: URLs are deduplicated across engines, ranked by
 * cross-engine consensus (how many engines returned them), then by best
 * per-engine rank.
 *
 * The fan-out races three exits and returns at the earliest: every engine
 * settled; the soft deadline elapsed with at least one success in hand; the
 * hard deadline elapsed regardless. If the soft deadline fires before any
 * engine has delivered, the aggregate keeps waiting (up to the hard cap) for
 * the first success, so a slow field degrades to fewer engines rather than
 * an empty answer. Stragglers are aborted once the race resolves. Individual
 * engine failures (bot challenges, timeouts) are tolerated; the call fails
 * only when every engine fails.
 */
export declare function searchPublicWeb(params: SearchParams, deadlines?: PublicWebDeadlines): Promise<SearchResponse>;
/**
 * Aggregate meta-provider over every credential-free engine. Explicit-only:
 * the auto chain already walks the individual engines sequentially, so
 * fanning out to all of them is a deliberate user choice, not a fallback.
 */
export declare class PublicWebProvider extends SearchProvider {
    readonly id = "public";
    readonly label = "Public Web";
    isAvailable(_authStorage: AuthStorage): boolean;
    isExplicitlyAvailable(_authStorage: AuthStorage): boolean;
    search(params: SearchParams): Promise<SearchResponse>;
}
