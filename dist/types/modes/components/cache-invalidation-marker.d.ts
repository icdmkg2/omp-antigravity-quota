import type { Usage } from "@oh-my-pi/pi-ai";
import type { Component } from "@oh-my-pi/pi-tui";
/** A prompt-cache invalidation detected from a turn's usage. */
export interface CacheInvalidation {
    /** Prompt tokens the cold turn had to (re)process instead of reading from cache. */
    reprocessedTokens: number;
}
/**
 * Decide whether `current` turn lost a *working* prompt cache that `prev` was
 * reusing.
 *
 * The provider reports a warm prefix as `cacheRead`; a model/thinking/tool/
 * system-prompt change (or a history rewrite) breaks the prefix, so the next
 * request reads nothing from cache and re-pays for the whole prompt. We flag
 * only the transition where a demonstrably warm cache goes cold: the previous
 * turn must have actually READ a meaningful prefix back, and this turn's
 * `cacheRead` collapsed to zero while it still reprocessed a non-trivial prompt.
 *
 * Requiring a prior warm read is deliberate. A turn that merely WROTE the prefix
 * (`cacheRead` 0) has not proven the cache is live — that is the session's first
 * request, or a re-write after expiry — so a following cold turn there is
 * expected, not an invalidation the user caused (e.g. a long-running first tool
 * call outliving the provider's 5-minute cache TTL surfaced a spurious "cache
 * miss" right under the opening message). It also collapses a run of consecutive
 * cold turns to the single marker at the moment the cache actually broke, instead
 * of repeating the banner on every turn while it re-warms.
 *
 * Returns `undefined` (no marker) for the first turn, turns whose predecessor
 * never read a warm prefix, tiny contexts, turns that reused any cache, and —
 * crucially — turns on providers with *implicit* best-effort caching. Only an
 * explicit, prefix-controlled cache (Anthropic / Bedrock `cache_control`)
 * re-creates the prefix on a cold turn (`cacheWrite > 0`); implicit caches
 * (Google / OpenAI / Fireworks) report `cacheWrite: 0` and drop `cacheRead` to
 * zero intermittently as routine propagation noise that self-heals the next
 * turn, so flagging it would be a false positive.
 */
export declare function detectCacheInvalidation(prev: Usage | undefined, current: Usage): CacheInvalidation | undefined;
/**
 * Slim left-aligned divider rendered above an assistant turn whose request lost
 * the prompt cache. Mirrors the compaction divider's banner styling but spans
 * only a short rule plus label (not the full width) and carries no expandable
 * detail:
 *
 *   ────────── ⊘ cache miss · 50.9k tokens
 */
export declare class CacheInvalidationMarkerComponent implements Component {
    #private;
    private readonly info;
    constructor(info: CacheInvalidation);
    invalidate(): void;
    render(width: number): readonly string[];
}
