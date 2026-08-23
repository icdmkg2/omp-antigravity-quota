/**
 * Pure content utilities for the Hindsight backend.
 *
 * Ports the semantics of the upstream OpenCode plugin
 * (vectorize-io/hindsight @ hindsight-integrations/opencode/src/content.ts):
 *   - tag stripping for anti-feedback (a recalled <memories> block must
 *     never end up retained as a new memory)
 *   - recall query composition + truncation under a character budget
 *   - retention transcript framing
 */
export interface HindsightMessage {
    role: string;
    content: string;
}
export interface RecallResultLike {
    text: string;
    type?: string | null;
    mentioned_at?: string | null;
}
/**
 * Strip `<memories>`, `<mental_models>`, and legacy memory blocks.
 *
 * Both `<memories>` (per-turn recall) and `<mental_models>` (curated semantic
 * memory) are injected into the system prompt. If either leaks into the
 * retention transcript, every retain becomes a tighter feedback loop —
 * paraphrased memories feed the next consolidation, which feeds the next
 * mental-model refresh, which feeds the next retain. Always strip before
 * retaining.
 */
export declare function stripMemoryTags(content: string): string;
/**
 * True when `content` carries at least one letter or digit. Used by retain
 * and recall paths to drop placeholder assistant turns ("." / "..." / pure
 * whitespace) that would otherwise pollute the bank and waste tokens on
 * embeddings with no semantic content.
 */
export declare function hasSubstantiveContent(content: string): boolean;
/** Format recall results into a bullet list for context injection. */
export declare function formatMemories(results: RecallResultLike[]): string;
/** Format current UTC time for the recall preamble. */
export declare function formatCurrentTime(now?: Date): string;
/**
 * Slice messages to the last N turns, where a turn boundary is a user message.
 * Returns the trailing tail starting at the (N-th from the end) user message.
 */
export declare function sliceLastTurnsByUserBoundary(messages: HindsightMessage[], turns: number): HindsightMessage[];
/**
 * Compose a recall query from the latest user prompt plus optional prior context.
 *
 * When `recallContextTurns <= 1` the query is just the trimmed latest prompt.
 * Otherwise we prepend a `Prior context:` block built from the trailing
 * `recallContextTurns` user-bounded turns (memory tags stripped, latest prompt
 * suppressed to avoid duplicating it inside the context block).
 */
export declare function composeRecallQuery(latestQuery: string, messages: HindsightMessage[], recallContextTurns: number): string;
/**
 * Truncate a composed recall query to `maxChars`.
 *
 * Always preserves the latest user message. Drops oldest context lines first
 * and degrades gracefully when even the latest message exceeds the budget.
 */
export declare function truncateRecallQuery(query: string, latestQuery: string, maxChars: number): string;
export interface RetentionTranscript {
    transcript: string | null;
    messageCount: number;
}
/** Remove retention framing lines from a stored coding-agent episode transcript. */
export declare function stripRetentionProtocolMarkers(content: string): string;
export declare function prepareRetentionTranscript(messages: HindsightMessage[], retainFullWindow?: boolean): RetentionTranscript;
/** Format all retention messages without protocol markers for embedding, FTS, and recall display. */
export declare function prepareEmbeddableRetentionTranscript(messages: HindsightMessage[]): RetentionTranscript;
/** Format only user-authored messages for memory fact/entity extraction. */
export declare function prepareUserRetentionTranscript(messages: HindsightMessage[]): RetentionTranscript;
