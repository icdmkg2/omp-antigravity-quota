export interface TtsDownloadProgress {
    stage: string;
    /** Integer 0–100 download percent when known. */
    percent?: number;
}
/**
 * Whether the selected local TTS model and the side Kokoro runtime are already
 * present. transformers.js stores `main`-revision files at
 * `<cacheDir>/<repo>/...`, so any `.onnx` weight under the repo dir means the
 * model weights can load without a network fetch; the Kokoro package runtime is
 * version-keyed separately and must also exist before setup can report ready.
 */
export declare function isTtsModelCached(modelKey: string): Promise<boolean>;
/**
 * Ensure the selected local TTS model is downloaded into the transformers.js
 * cache (and warm in the worker), streaming integer-percent Hub progress. The
 * worker resolves the request once every model file is cached. Returns `false`
 * if the worker is unavailable or the download failed.
 */
export declare function downloadTtsModel(modelKey: string, onProgress?: (progress: TtsDownloadProgress) => void, signal?: AbortSignal): Promise<boolean>;
