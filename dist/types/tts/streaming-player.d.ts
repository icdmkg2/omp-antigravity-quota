/** Output gain applied while the user speaks over assistant audio. */
export declare const DUCK_GAIN = 0.25;
/**
 * One native gapless playback session. Call {@link start}, enqueue mono `f32`
 * chunks with {@link write}, then {@link end} to drain or {@link stop} to abort.
 */
export declare class StreamingAudioPlayer {
    #private;
    /** Opens the default speaker at the stream's logical sample rate. */
    start(sampleRate?: number): void;
    /** Queues one mono `f32` PCM chunk without copying it in TypeScript. */
    write(pcm: Float32Array): void;
    /** Applies gain at render time, including to samples already queued natively. */
    setGain(gain: number): void;
    /** Closes input and resolves after every queued sample reaches the speaker. */
    end(): Promise<void>;
    /** Stops immediately and discards queued audio. Safe to call repeatedly. */
    stop(): void;
}
/** Creates the single-use player used by the speech vocalizer. */
export declare function createStreamingPlayer(): StreamingAudioPlayer;
