import { type RefCountedWorkerHandle, type SpawnedSubprocess } from "../subprocess/worker-client.js";
import type { TtsProgressEvent, TtsWorkerInbound, TtsWorkerOutbound } from "./tts-protocol.js";
/** Decoded PCM returned by a local synthesis request. */
export interface TtsAudio {
    pcm: Float32Array;
    sampleRate: number;
}
export interface TtsSynthesizeOptions {
    voice?: string;
    signal?: AbortSignal;
}
export interface TtsDownloadOptions {
    signal?: AbortSignal;
    onProgress?: (event: TtsProgressEvent) => void;
}
export interface TtsStreamOptions {
    voice?: string;
    signal?: AbortSignal;
}
/** One synthesized segment of a streaming session, in emission order. */
export interface TtsAudioChunk {
    index: number;
    text: string;
    pcm: Float32Array;
    sampleRate: number;
}
/**
 * A live streaming-synthesis session. Feed complete speakable segments with
 * {@link push} (the worker synthesizes each push as-is) and close the input
 * with {@link end}; `chunks` yields each segment's audio as soon as it is
 * ready, then completes once the worker finishes draining the closed input.
 */
export interface TtsStreamHandle {
    push(text: string): void;
    end(): void;
    chunks: AsyncIterableIterator<TtsAudioChunk>;
}
/**
 * Hidden subcommand on the main CLI that boots the TTS worker in the spawned
 * subprocess. Kept in sync with the dispatch in `cli.ts` (Main-owned).
 */
export declare const TTS_WORKER_ARG = "__omp_worker_tts";
/**
 * Spawn the TTS worker as a subprocess. Exported for tests and the smoke probe;
 * production callers go through {@link spawnTtsWorker}.
 */
export declare function createTtsSubprocess(): SpawnedSubprocess<TtsWorkerOutbound>;
export declare class TtsClient {
    #private;
    constructor(spawnWorker?: () => RefCountedWorkerHandle<TtsWorkerInbound, TtsWorkerOutbound>);
    onProgress(listener: (event: TtsProgressEvent) => void): () => void;
    synthesize(modelKey: string, text: string, options?: TtsSynthesizeOptions): Promise<TtsAudio | null>;
    /**
     * Open a streaming-synthesis session. Complete speakable segments are fed
     * through the returned handle's `push`/`end`; audio is emitted one segment
     * at a time via `chunks`, so playback can begin before the full text is
     * known. Returns an inert handle (immediately-ended `chunks`) for unknown
     * models or an already-aborted signal, and fails the iterator if the worker
     * cannot spawn.
     */
    synthesizeStream(modelKey: string, options?: TtsStreamOptions): TtsStreamHandle;
    downloadModel(modelKey: string, options?: TtsDownloadOptions): Promise<boolean>;
    terminate(): Promise<void>;
}
export declare const ttsClient: TtsClient;
export declare function shutdownTtsClient(): Promise<void>;
export declare function smokeTestTtsWorker({ timeoutMs, }?: {
    timeoutMs?: number;
}): Promise<void>;
