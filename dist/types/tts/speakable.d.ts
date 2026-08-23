/**
 * Streaming markdown → speakable-segment transform for assistant speech.
 *
 * Sits between the assistant's raw streaming text deltas and the TTS engine,
 * deciding both *what* is worth speaking and *when* a piece of text is ready
 * to synthesize. Three passes:
 *
 * 1. Block pass (per character, stateful): drops fenced code blocks and table
 *    rows, strips heading/bullet/blockquote markers (numbered-list markers are
 *    spoken as "1, …"), and turns newlines into hard segment breaks.
 * 2. Segmentation (stateful): emits a segment the moment a sentence boundary
 *    appears — no next-sentence confirmation, which is what made the previous
 *    engine-side splitter stall a full sentence behind generation. The first
 *    segment cuts early at a clause boundary for fast time-to-first-audio, and
 *    over-long unpunctuated runs are force-split so no segment exceeds the
 *    synthesizer's input budget.
 * 3. Inline normalization (per segment): markdown links speak their label,
 *    bare URLs speak their host, inline-code ticks and emphasis markers are
 *    stripped, multi-directory file paths collapse to their basename, HTML
 *    tags are dropped, and whitespace is collapsed. Segments with no letters
 *    or digits left are not spoken at all.
 *
 * Pure and synchronous — the vocalizer owns timers (idle flush) and the
 * session lifecycle, so this class stays trivially unit-testable.
 */
/**
 * One per utterance. Feed raw assistant deltas through {@link push}; each call
 * returns the segments that became ready to speak. {@link flush} drains the
 * remainder at message end; {@link flushIdle} drains it when generation stalls
 * mid-sentence so speech doesn't sit on buffered text through a tool call.
 */
export declare class SpeakableStream {
    #private;
    /** Consume a raw delta; returns segments now ready to speak, in order. */
    push(delta: string): string[];
    /** Message end: drain everything left, including a trailing partial sentence. */
    flush(): string[];
    /**
     * Generation stalled (tool call, thinking block): speak what we have rather
     * than sit silent on buffered text. Keeps block state so the stream resumes
     * afterwards, and refuses stubby mid-sentence fragments — the buffer must be
     * a complete thought (trailing sentence punctuation) or at least
     * {@link MIN_SEGMENT} long, so a stall right after "The" stays silent
     * instead of turning into choppy one-word speech.
     */
    flushIdle(): string[];
}
