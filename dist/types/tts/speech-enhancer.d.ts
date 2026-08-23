import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
/** Session-scoped dependencies; mirrors the auto-thinking classifier's deps. */
export interface SpeechEnhancerDeps {
    settings: Settings;
    registry: ModelRegistry;
    sessionId: string;
    metadataResolver?: (provider: string) => Record<string, unknown> | undefined;
}
/**
 * Rewrites one markdown block into spoken prose via the tiny/smol role.
 * Constructed per session by the event controller and handed to the vocalizer.
 */
export declare class SpeechEnhancer {
    #private;
    constructor(deps: SpeechEnhancerDeps);
    /**
     * Rewrite `block` for speech. Returns the spoken text (empty string when
     * the model judged the block unspeakable — pure code/markup), or null when
     * the rewrite failed, timed out, or no model/key resolved; the caller then
     * falls back to mechanical normalization.
     */
    rewrite(block: string, signal?: AbortSignal): Promise<string | null>;
}
/**
 * Fence-aware paragraph accumulator over raw streaming deltas. One instance
 * per utterance.
 */
export declare class BlockAccumulator {
    #private;
    /** Feed a delta; returns the blocks it completed, in order. */
    push(delta: string): string[];
    /**
     * Message end: drain everything. An unterminated code fence is dropped from
     * its opening line onward (a truncated block is never worth speaking); the
     * prose before it still comes out.
     */
    flush(): string | null;
    /**
     * Generation stalled: drain the pending partial block — unless we are
     * inside a code fence, where the only thing buffered is code and speaking
     * or rewriting half a fence would re-introduce vocalized code. Fence state
     * is preserved so the eventual closing fence still matches.
     */
    flushPartial(): string | null;
}
