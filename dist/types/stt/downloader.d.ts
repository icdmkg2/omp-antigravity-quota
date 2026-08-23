import type { SttProgressStatus } from "./asr-protocol.js";
export interface DownloadProgress {
    stage: string;
    percent?: number;
}
export interface EnsureOptions {
    modelName?: string;
    signal?: AbortSignal;
    onProgress?: (progress: DownloadProgress) => void;
}
/**
 * Real-progress event for a speech-model download, surfaced to UI callers.
 * `percent` is an integer 0–100 aggregated across all model files (encoder +
 * decoder shards), so it advances monotonically toward completion.
 */
export interface SttDownloadProgress {
    status: SttProgressStatus;
    /** Integer 0–100 aggregated across files. */
    percent: number;
    /** Bytes downloaded so far across all files. */
    loaded: number;
    /** Total bytes across all files seen so far. */
    total: number;
    /** The file currently downloading, when known. */
    file?: string;
    repo: string;
    label: string;
}
/**
 * Whether the selected model is fully present in the local cache. For
 * transformers.js Whisper tiers a complete download leaves `config.json` plus
 * matching `encoder*.onnx` and `decoder*.onnx` shards under `onnx/` (a partial
 * fetch with only one shard, or a bare `config.json`, reads as not-cached); for
 * sherpa-onnx tiers every model file (encoder/decoder/joiner + tokens) must be
 * present (`.part` sidecars from an interrupted fetch are ignored).
 */
export declare function isSttModelCached(key: string): Promise<boolean>;
/**
 * Download (or warm from cache) the selected ONNX Whisper model via the speech
 * worker, resolving once the model is fully present and loaded. Streams real
 * Hub progress with an aggregated integer percent. Rejects if the worker cannot
 * obtain the model. Safe to call non-interactively.
 */
export declare function downloadSttModel(key: string, onProgress?: (progress: SttDownloadProgress) => void, options?: {
    signal?: AbortSignal;
}): Promise<void>;
export declare function ensureSTTDependencies(options?: EnsureOptions): Promise<void>;
