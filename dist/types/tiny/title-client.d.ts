import { type RefCountedWorkerHandle, type SpawnedSubprocess } from "../subprocess/worker-client.js";
import type { TinyTitleProgressEvent, TinyTitleWorkerInbound, TinyTitleWorkerOutbound } from "./title-protocol.js";
export interface TinyTitleDownloadResult {
    ok: boolean;
    error?: string;
}
export interface TinyTitleDownloadOptions {
    signal?: AbortSignal;
    onProgress?: (event: TinyTitleProgressEvent) => void;
}
/**
 * Per-request controls for {@link TinyTitleClient.generate}.
 *
 * Carries the optional abort signal and title-system-prompt override used by
 * callers that customize automatic session-title generation.
 */
export interface TinyTitleGenerateOptions {
    signal?: AbortSignal;
    systemPrompt?: string;
}
export interface TinyModelCompletionOptions {
    maxTokens?: number;
    signal?: AbortSignal;
    systemPrompt?: string;
}
/**
 * Hidden subcommand on the main CLI that boots the tiny-model worker in the
 * spawned subprocess. Kept in sync with the dispatch in `cli.ts`.
 */
export declare const TINY_WORKER_ARG = "__omp_worker_tiny_inference";
/**
 * Decide which `PI_TINY_DEVICE` / `PI_TINY_DTYPE` vars to overlay onto the worker
 * env. A present env var wins (left untouched); otherwise the mapped persisted
 * setting is used. Returns only the keys to add — never the default sentinel.
 * Pure for testability; see {@link tinyWorkerEnv} for the spawn-time glue.
 * @internal
 */
export declare function tinyWorkerEnvOverlay(env: Record<string, string | undefined>, deviceSetting: string | undefined, dtypeSetting: string | undefined): Record<string, string>;
/**
 * Env handed to the tiny-model subprocess — and reused verbatim by the STT and
 * TTS workers, which share the same device/dtype resolution. The
 * `PI_TINY_DEVICE` / `PI_TINY_DTYPE` env vars win; otherwise the persisted
 * `providers.tinyModelDevice` / `providers.tinyModelDtype` settings are mapped
 * onto those vars so the subprocess's env-based resolution picks them up.
 * Resolved once at spawn (pipelines are cached for the lifetime of the
 * subprocess).
 */
export declare function tinyWorkerEnv(): Record<string, string>;
/**
 * Spawn the tiny-model worker as a subprocess. Exported for tests and the
 * smoke probe; production callers go through {@link spawnTinyTitleWorker}.
 */
export declare function createTinyTitleSubprocess(): SpawnedSubprocess<TinyTitleWorkerOutbound>;
export declare class TinyTitleClient {
    #private;
    constructor(spawnWorker?: () => RefCountedWorkerHandle<TinyTitleWorkerInbound, TinyTitleWorkerOutbound>);
    onProgress(listener: (event: TinyTitleProgressEvent) => void): () => void;
    /**
     * Spawn the tiny-model worker ahead of first use without loading any model.
     * Called from idle TUI startup so the first {@link generate} reuses a live,
     * unref'd subprocess instead of paying subprocess-spawn latency on the submit
     * hot path (issue #6462). No-ops for online / non-local keys and for models
     * already marked failed. A no-op `ping` round-trips the transport to fault in
     * the worker's module graph; no pending request is registered, so
     * {@link #syncWorkerRef} leaves the worker unref'd and idle sessions still exit.
     */
    prewarm(modelKey: string): void;
    generate(modelKey: string, message: string, signal?: AbortSignal): Promise<string | null>;
    generate(modelKey: string, message: string, options?: TinyTitleGenerateOptions): Promise<string | null>;
    complete(modelKey: string, prompt: string, options?: TinyModelCompletionOptions): Promise<string | null>;
    downloadModel(modelKey: string, options?: TinyTitleDownloadOptions): Promise<TinyTitleDownloadResult>;
    terminate(): Promise<void>;
}
export declare const tinyTitleClient: TinyTitleClient;
/** Alias for the shared tiny-model worker client (titles + memory completions). */
export declare const tinyModelClient: TinyTitleClient;
export declare function shutdownTinyTitleClient(): Promise<void>;
export declare function smokeTestTinyTitleWorker({ timeoutMs, }?: {
    timeoutMs?: number;
}): Promise<void>;
