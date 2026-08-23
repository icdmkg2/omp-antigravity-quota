import { type RefCountedWorkerHandle, type SpawnedSubprocess } from "../subprocess/worker-client.js";
import type { SttProgressEvent, SttWorkerInbound, SttWorkerOutbound } from "./asr-protocol.js";
import type { SttModelKey } from "./models.js";
export interface SttTranscribeOptions {
    language?: string;
    signal?: AbortSignal;
}
export interface SttDownloadOptions {
    signal?: AbortSignal;
    onProgress?: (event: SttProgressEvent) => void;
}
export interface SttDownloadResult {
    ok: boolean;
    error?: string;
}
/** Live streaming session handle returned by {@link SttClient.startStream}. */
export interface SttStreamHandle {
    /** Feed 16 kHz mono float samples as the recorder produces them. */
    pushAudio(audio: Float32Array): void;
    /** Flush the trailing segment and resolve with the full joined transcript. */
    stop(): Promise<string>;
    /** Tear the session down without a final flush (resolves `stop()` with ""). */
    cancel(): void;
}
export interface SttStreamOptions {
    language?: string;
    signal?: AbortSignal;
    /** Volatile transcript of the in-progress segment, refreshed as audio arrives. */
    onPartial?: (text: string) => void;
    /** A finalized segment, emitted once when the endpointer commits it. */
    onSegment?: (text: string, index: number) => void;
}
/**
 * Hidden subcommand on the main CLI that boots the speech-recognition worker in
 * the spawned subprocess. Kept in sync with the dispatch in `cli.ts`.
 */
export declare const STT_WORKER_ARG = "__omp_worker_stt";
/**
 * Spawn the speech worker as a subprocess. Exported for tests and the smoke
 * probe; production callers go through {@link spawnSttWorker}.
 */
export declare function createSttSubprocess(): SpawnedSubprocess<SttWorkerOutbound>;
export declare class SttClient {
    #private;
    constructor(spawnWorker?: () => RefCountedWorkerHandle<SttWorkerInbound, SttWorkerOutbound>);
    onProgress(listener: (event: SttProgressEvent) => void): () => void;
    /**
     * Transcribe 16 kHz mono audio on the warm worker. Rejects with the worker
     * error on failure and with an `AbortError` when the signal fires (the warm
     * worker keeps the model loaded across calls — the model is never reloaded).
     */
    transcribe(modelKey: SttModelKey, audio: Float32Array, options?: SttTranscribeOptions): Promise<string>;
    /**
     * Open a live streaming session on the warm worker. Audio fed through the
     * returned handle is segmented by the worker's endpointer: `onSegment` fires
     * once per committed segment and `onPartial` for the volatile in-progress
     * preview. `stop()` resolves with the full joined transcript; `cancel()` (or
     * an aborted signal) tears the session down and resolves `stop()` with "".
     */
    startStream(modelKey: SttModelKey, options?: SttStreamOptions): SttStreamHandle;
    downloadModel(modelKey: SttModelKey, options?: SttDownloadOptions): Promise<SttDownloadResult>;
    terminate(): Promise<void>;
}
export declare const sttClient: SttClient;
export declare function shutdownSttClient(): Promise<void>;
export declare function smokeTestSttWorker({ timeoutMs, }?: {
    timeoutMs?: number;
}): Promise<void>;
