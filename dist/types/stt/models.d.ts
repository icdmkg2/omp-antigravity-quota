import type { TinyModelDtype } from "../tiny/dtype.js";
/**
 * On-device speech-to-text model registry. Each tier maps a stable settings key
 * onto a locally-runnable ASR model and the engine that loads it:
 *
 * - `transformers` — a transformers.js / ONNX Whisper repo, loaded by the
 *   `@huggingface/transformers` `automatic-speech-recognition` pipeline.
 * - `sherpa` — a sherpa-onnx (Next-gen Kaldi) offline model, loaded by the
 *   native `sherpa-onnx-node` addon. Used for NVIDIA Parakeet, the Open ASR
 *   Leaderboard accuracy/speed leader.
 *
 * The worker resolves the spec by key and loads the model lazily (kept warm
 * afterwards). Both engines run inside the hard-killed subprocess worker.
 */
/** ASR runtime that loads a given tier's model. */
export type SttEngine = "transformers" | "sherpa";
interface SttModelBase {
    /** Stable key persisted in `stt.modelName` and sent over the worker protocol. */
    key: string;
    engine: SttEngine;
    /** Hugging Face repo id (transformers.js ONNX repo, or sherpa-onnx model repo). */
    repo: string;
    /** English-only checkpoint: rejects a configured source `language`. */
    englishOnly: boolean;
    label: string;
    description: string;
    /** Approximate on-disk download size for the shipped weights (UI hint). */
    sizeHint: string;
}
/** A Whisper-family tier loaded via the transformers.js ASR pipeline. */
export interface TransformersSttModelSpec extends SttModelBase {
    engine: "transformers";
    /** ONNX precision used unless overridden by `PI_TINY_DTYPE` / `providers.tinyModelDtype`. */
    dtype: TinyModelDtype;
}
/** A sherpa-onnx offline tier (e.g. NeMo Parakeet transducer) loaded natively. */
export interface SherpaSttModelSpec extends SttModelBase {
    engine: "sherpa";
    /** sherpa-onnx offline model family (e.g. `nemo_transducer`). */
    modelType: string;
    /** Model files (relative to the repo root) fetched into the local cache. */
    files: {
        encoder: string;
        decoder: string;
        joiner: string;
        tokens: string;
    };
}
export type SttModelSpec = TransformersSttModelSpec | SherpaSttModelSpec;
/**
 * Speech model tiers, ordered light → SoTA. Defaults to {@link DEFAULT_STT_MODEL_KEY}.
 * `fast`/`balanced`/`turbo` are multilingual Whisper checkpoints on transformers.js;
 * `parakeet` is NVIDIA Parakeet TDT 0.6B v3 on sherpa-onnx — the Open ASR
 * Leaderboard leader (lower WER and far higher throughput than Whisper).
 */
export declare const STT_MODELS: readonly [{
    readonly key: "fast";
    readonly engine: "transformers";
    readonly repo: "onnx-community/whisper-base";
    readonly dtype: "q8";
    readonly englishOnly: false;
    readonly label: "Fast (Whisper base)";
    readonly description: "Whisper base, multilingual. Smallest + fastest; lowest accuracy. Best for low-resource machines.";
    readonly sizeHint: "~60 MB";
}, {
    readonly key: "balanced";
    readonly engine: "transformers";
    readonly repo: "onnx-community/whisper-small";
    readonly dtype: "q8";
    readonly englishOnly: false;
    readonly label: "Balanced (Whisper small)";
    readonly description: "Whisper small, multilingual. More accurate than Fast, still light on CPU/RAM.";
    readonly sizeHint: "~190 MB";
}, {
    readonly key: "turbo";
    readonly engine: "transformers";
    readonly repo: "onnx-community/whisper-large-v3-turbo";
    readonly dtype: "q4";
    readonly englishOnly: false;
    readonly label: "Turbo (Whisper large-v3)";
    readonly description: "Whisper large-v3-turbo, 99 languages. Widest language coverage; large download, slower.";
    readonly sizeHint: "~600 MB";
}, {
    readonly key: "parakeet";
    readonly engine: "sherpa";
    readonly repo: "csukuangfj/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8";
    readonly modelType: "nemo_transducer";
    readonly files: {
        readonly encoder: "encoder.int8.onnx";
        readonly decoder: "decoder.int8.onnx";
        readonly joiner: "joiner.int8.onnx";
        readonly tokens: "tokens.txt";
    };
    readonly englishOnly: false;
    readonly label: "Parakeet TDT v3 (SoTA)";
    readonly description: "NVIDIA Parakeet TDT 0.6B v3, 25 languages. Open ASR Leaderboard leader — best accuracy and far fastest decoding. Default.";
    readonly sizeHint: "~680 MB";
}];
/**
 * SoTA default — NVIDIA Parakeet TDT 0.6B v3 (sherpa-onnx). Tops the Open ASR
 * Leaderboard on accuracy while decoding ~20× faster than Whisper large-v3.
 */
export declare const DEFAULT_STT_MODEL_KEY = "parakeet";
export type SttModelKey = (typeof STT_MODELS)[number]["key"];
/** A concrete entry from {@link STT_MODELS}; `key` is the literal tier union. */
export type SttModel = (typeof STT_MODELS)[number];
export declare const STT_MODEL_VALUES: readonly ["fast", "balanced", "turbo", "parakeet"];
export declare const STT_MODEL_OPTIONS: {
    value: "balanced" | "fast" | "parakeet" | "turbo";
    label: "Balanced (Whisper small)" | "Fast (Whisper base)" | "Parakeet TDT v3 (SoTA)" | "Turbo (Whisper large-v3)";
    description: "NVIDIA Parakeet TDT 0.6B v3, 25 languages. Open ASR Leaderboard leader — best accuracy and far fastest decoding. Default." | "Whisper base, multilingual. Smallest + fastest; lowest accuracy. Best for low-resource machines." | "Whisper large-v3-turbo, 99 languages. Widest language coverage; large download, slower." | "Whisper small, multilingual. More accurate than Fast, still light on CPU/RAM.";
}[];
export declare function isSttModelKey(value: string): value is SttModelKey;
export declare function getSttModelSpec(key: string): SttModel | undefined;
/**
 * Resolve a (possibly stale or legacy) `stt.modelName` value onto a concrete
 * spec, falling back to the SoTA default when the key is unknown.
 */
export declare function resolveSttModelSpec(key: string | undefined): SttModel;
export {};
