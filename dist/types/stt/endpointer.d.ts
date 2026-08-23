/**
 * Energy-based speech endpointer for live transcription.
 *
 * The on-device ASR models we ship are non-streaming: the sherpa-onnx Parakeet
 * recognizer and the transformers.js Whisper pipelines both decode a complete
 * waveform in one shot. To transcribe *while the user is still speaking*, this
 * splits the continuous 16 kHz mono float stream into speech segments at natural
 * pauses — each segment is decoded and committed as it finalizes, and the
 * in-progress segment is re-decoded periodically for a volatile live preview.
 *
 * Segmentation is pure short-time-energy VAD with an adaptive noise floor, so it
 * needs no extra model and is engine-agnostic (it runs the same way whether the
 * downstream model is sherpa or transformers). It is deliberately simple and
 * fully deterministic so it can be unit-tested with synthetic signals.
 */
/** Tunable thresholds for {@link StreamEndpointer}. All durations in ms. */
export interface EndpointerConfig {
    /** Input sample rate (the recorder always delivers 16 kHz mono). */
    sampleRate: number;
    /** Short-time analysis frame size. */
    frameMs: number;
    /** Trailing silence inside a segment that finalizes (commits) it. */
    endSilenceMs: number;
    /** Shortest speech run that is committed; shorter runs are discarded as noise. */
    minSpeechMs: number;
    /** Hard cap on segment length so long pause-free speech still commits periodically. */
    maxSegmentMs: number;
    /** Audio retained before onset so the first phoneme of a segment is never clipped. */
    preRollMs: number;
    /** Cadence of volatile partial emissions for the in-progress segment. */
    partialIntervalMs: number;
    /** Speech threshold is `max(minThreshold, noiseFloor * energyRatio)`. */
    energyRatio: number;
    /** EMA weight tracking the ambient noise floor on non-speech frames. */
    floorAttack: number;
    /** Absolute RMS floor so a near-silent room never trips speech detection. */
    minThreshold: number;
}
export declare const DEFAULT_ENDPOINTER_CONFIG: EndpointerConfig;
/**
 * Emitted by {@link StreamEndpointer.push} / {@link StreamEndpointer.flush}.
 * `partial` is the volatile in-progress segment (decode and show as preview,
 * never commit); `segment` is a finalized run (decode and commit once).
 */
export type EndpointerEvent = {
    kind: "partial";
    audio: Float32Array;
} | {
    kind: "segment";
    audio: Float32Array;
};
export declare class StreamEndpointer {
    #private;
    constructor(config?: Partial<EndpointerConfig>);
    /** Feed newly-captured samples; returns ordered partial/segment events. */
    push(samples: Float32Array): EndpointerEvent[];
    /** End the stream; returns a trailing committed segment if one is pending. */
    flush(): EndpointerEvent[];
}
