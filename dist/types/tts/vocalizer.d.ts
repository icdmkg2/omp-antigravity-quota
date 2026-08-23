import { type SpeechEnhancer } from "./speech-enhancer.js";
export interface VocalizerPlayer {
    start(sampleRate: number): void;
    write(pcm: Float32Array): void;
    setGain(gain: number): void;
    end(): Promise<void>;
    stop(): void;
}
export declare class Vocalizer {
    #private;
    constructor(createPlayer?: () => VocalizerPlayer);
    /** Wire (or drop) the per-session enhanced-rewrite service. */
    setEnhancer(enhancer: SpeechEnhancer | null): void;
    /**
     * Suppress new vocalization until the returned idempotent release function runs.
     * Existing synthesis and playback stop immediately; nested scopes release independently.
     */
    suspend(): () => void;
    /**
     * Stream a delta of assistant text into the pipeline. No-op when
     * vocalization is disabled. The synthesis session (worker, player) is only
     * opened once the first speakable segment exists, so a reply that
     * normalizes to silence (pure code, tables, URLs) costs nothing. The
     * trailing partial is flushed by {@link flush} or the idle timer. The
     * pipeline (enhanced vs mechanical) is latched per utterance.
     */
    pushDelta(text: string): void;
    /**
     * Close the current input stream (call at message/turn end). Drains the
     * trailing partial as final segments; in enhanced mode the session ends
     * only after the last in-flight rewrite has pushed, while the next
     * utterance may already be streaming.
     */
    flush(): void;
    /**
     * Speak a complete piece of text in one shot (ask questions, yield-mode final
     * message): stream it in and immediately close the input. No-op when disabled.
     */
    speak(text: string): void;
    /**
     * Interrupt and drop every utterance, killing in-flight playback, synthesis,
     * and rewrites (new turn / user message / Esc interrupt). Audio stops at once.
     */
    clear(): void;
    /**
     * True while any utterance is still audible or synthesizing — a live
     * player, an unfinished stream handle, or an in-flight rewrite is enough.
     * Callers (Esc handler) treat this as the "silence me" signal.
     */
    isSpeaking(): boolean;
    /** Lower the volume while the user is speaking (push-to-talk), so speech doesn't drown them out. */
    duck(): void;
    /** Restore full volume once the user stops speaking. */
    unduck(): void;
    /** Resolve once the playback chain has drained (tests / shutdown). */
    idle(): Promise<void>;
}
/** Process-level vocalizer shared by the event controller and the ask tool. */
export declare const vocalizer: Vocalizer;
