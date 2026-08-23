import type { TinyModelDtype } from "../tiny/dtype.js";
/**
 * Voice exposed by a local TTS model. Kokoro ships a fixed catalog of named
 * voices; a voice is just a stable id (e.g. `af_heart`) plus a display label.
 * Selection is purely on-device — generating with a different voice needs no
 * extra network fetch once the model weights are cached.
 */
export interface TtsLocalVoiceSpec {
    id: string;
    label: string;
}
/**
 * A local (on-device, ONNX) text-to-speech model the worker can load. `repo` is
 * the Hugging Face model id loaded through `kokoro-js`
 * (`KokoroTTS.from_pretrained`), which runs on the same `@huggingface/transformers`
 * + `onnxruntime` runtime as the rest of the tiny-model stack and bundles the
 * misaki/espeak phonemizer Kokoro needs. `dtype` is the default ONNX precision
 * (overridable via `providers.tinyModelDtype`/`PI_TINY_DTYPE`).
 */
export interface TtsLocalModelSpec {
    key: string;
    repo: string;
    dtype: TinyModelDtype;
    /** PCM sample rate the model emits; fallback only — the worker uses the value RawAudio reports. */
    sampleRate: number;
    label: string;
    description: string;
    /** First entry is the model's default voice. */
    voices: readonly TtsLocalVoiceSpec[];
}
/**
 * Curated Kokoro-82M voice catalog. Kokoro ships ~28 voices; we surface the
 * higher-graded ones across American/British × female/male so the picker stays
 * useful without listing every D/F-grade sample. `af_heart` (grade A) leads and
 * is the default voice. Grades are Kokoro's own `overallGrade` ratings.
 */
export declare const KOKORO_VOICES: readonly TtsLocalVoiceSpec[];
/** Default voice within the default model — Kokoro's flagship grade-A voice. */
export declare const DEFAULT_TTS_VOICE = "af_heart";
/** Default local TTS model used when `tts.localModel` is unset. */
export declare const DEFAULT_TTS_LOCAL_MODEL_KEY = "kokoro";
/**
 * Local TTS model registry. Kokoro-82M is the on-device SoTA tiny TTS (tops the
 * TTS Arena leaderboard); the `onnx-community` ONNX export runs through
 * `kokoro-js` on the shared transformers.js/onnxruntime worker. q8 keeps the
 * weights ~100 MB and CPU inference fast while preserving quality. One model
 * spans every voice/accent — language selection is a voice choice, not a
 * separate download.
 */
export declare const TTS_LOCAL_MODELS: readonly [{
    readonly key: "kokoro";
    readonly repo: "onnx-community/Kokoro-82M-v1.0-ONNX";
    readonly dtype: "q8";
    readonly sampleRate: 24000;
    readonly label: "Kokoro-82M";
    readonly description: "Kokoro-82M neural TTS — SoTA on-device quality, multi-voice, fully local";
    readonly voices: readonly TtsLocalVoiceSpec[];
}];
export type TtsLocalModelKey = (typeof TTS_LOCAL_MODELS)[number]["key"];
export declare const TTS_LOCAL_MODEL_VALUES: readonly ["kokoro"];
export declare const TTS_LOCAL_MODEL_OPTIONS: readonly [{
    readonly value: "kokoro";
    readonly label: "Kokoro-82M";
    readonly description: "Kokoro-82M neural TTS — SoTA on-device quality, multi-voice, fully local";
}];
/** Voice options for the `tts.localVoice` setting picker (default model's catalog). */
export declare const TTS_LOCAL_VOICE_OPTIONS: ReadonlyArray<{
    value: string;
    label: string;
}>;
/** Accepted `tts.localVoice` values (default model's catalog) for schema validation. */
export declare const TTS_LOCAL_VOICE_VALUES: readonly string[];
export declare function getTtsLocalModelSpec(key: string): TtsLocalModelSpec | undefined;
export declare function isTtsLocalModelKey(value: string): value is TtsLocalModelKey;
/** Resolve a model key (or the default) to its Hugging Face repo id. */
export declare function resolveTtsRepo(modelKey: string | undefined): string;
/**
 * Resolve a requested voice id to a concrete voice the model supports, falling
 * back to the model's default voice (first entry) when the id is unknown or the
 * legacy `"default"` sentinel. The returned id is always a valid Kokoro voice.
 */
export declare function resolveTtsVoice(modelKey: string | undefined, voice: string | undefined): string;
