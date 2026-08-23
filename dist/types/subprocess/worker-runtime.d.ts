import type { ProgressInfo } from "@huggingface/transformers";
/**
 * Child-side scaffolding shared by the ONNX inference worker bodies
 * (`stt/asr-worker`, `tiny/worker`, `tts/tts-worker`). These are the helpers
 * that run inside the spawned subprocess: error serialization, structured log
 * and progress reporting over the worker's typed transport, side-runtime
 * install (sharp stubbing + module-resolver patch), once-per-process runtime
 * memoization, and the Transformers.js runtime loader. The parent/client-side
 * complement lives in `worker-client.ts`.
 *
 * Each worker keeps its own strongly-typed transport / model-key / progress
 * event; the structural {@link WorkerLogTransport} / {@link WorkerProgressTransport}
 * interfaces below are the minimal shapes these helpers need, and every worker's
 * concrete transport satisfies them.
 */
export declare const TRANSFORMERS_PACKAGE = "@huggingface/transformers";
export declare function errorText(error: unknown): string;
export declare function errorMessage(error: unknown): string;
export type WorkerLogLevel = "debug" | "warn" | "error";
/** Minimal transport surface a worker exposes for forwarding log lines. */
export interface WorkerLogTransport {
    send(message: {
        type: "log";
        level: WorkerLogLevel;
        msg: string;
        meta?: Record<string, unknown>;
    }): void;
}
export declare function sendLog(transport: WorkerLogTransport, level: WorkerLogLevel, msg: string, meta?: Record<string, unknown>): void;
/**
 * Generic worker progress event. Each worker's protocol declares an identical
 * shape with its own `modelKey` type; this is the parameterized version the
 * shared helpers emit, structurally assignable to each protocol's event.
 */
export interface WorkerProgressEvent<K> {
    modelKey: K;
    status: "initiate" | "download" | "progress" | "progress_total" | "done" | "ready" | "error";
    name?: string;
    file?: string;
    progress?: number;
    loaded?: number;
    total?: number;
    files?: Record<string, {
        loaded: number;
        total: number;
    }>;
    task?: string;
    model?: string;
}
/** Minimal transport surface a worker exposes for emitting progress events. */
export interface WorkerProgressTransport<K> {
    send(message: {
        type: "progress";
        id: string;
        event: WorkerProgressEvent<K>;
    }): void;
}
export declare function sendProgress<K>(transport: WorkerProgressTransport<K>, id: string, modelKey: K, info: ProgressInfo): void;
/**
 * If a model is already warming/warm in `cache`, replay a `ready` progress
 * event for this request once it resolves and return the cached promise so the
 * caller can short-circuit; otherwise return `undefined`.
 */
export declare function replayCachedReady<K, M>(cache: Map<K, Promise<M>>, modelKey: K, transport: WorkerProgressTransport<K>, requestId: string, task: string, model: string): Promise<M> | undefined;
/**
 * Stub `sharp` (the speech/text pipelines are not image codecs, so the native
 * image dependency is dead weight) and patch the module resolver so a side
 * runtime's bare requires resolve against its own `node_modules`. Returns the
 * runtime's `node_modules` directory.
 */
export declare function installSharpStubResolver(runtimeDir: string): Promise<string>;
/**
 * Repairs the compiled Transformers side runtime when CUDA was requested and
 * Bun skipped `onnxruntime-node`'s NuGet sidecar install.
 */
export declare function ensureOnnxRuntimeCudaProviders(runtimeDir: string, device?: string | undefined): Promise<void>;
/**
 * Lazily resolve (and memoize) the transformers version spec. In the `catalog:`
 * case {@link resolveTransformersVersionSpec} `require`s the installed
 * `@huggingface/transformers/package.json`, so it is only ever touched on the
 * compiled-binary runtime-install path — loading a worker (smoke-test ping,
 * online path) never triggers the transformers resolve/install dance.
 */
export declare function getTransformersVersionSpec(): string;
/** The subset of the Transformers.js module surface {@link configureTransformers} touches. */
interface ConfigurableTransformers {
    env: {
        cacheDir?: string;
        allowLocalModels?: boolean;
        logLevel?: unknown;
    };
    LogLevel: {
        ERROR: unknown;
    };
}
export interface TransformersRuntimeMetadata {
    __ompRuntimeNodeModules?: string;
    __ompTransformersEntry?: string;
    __ompCudaRepairError?: string;
}
export declare function formatOnnxRuntimeCudaDiagnostics(metadata: TransformersRuntimeMetadata, requestedDevice: string, error: unknown): Promise<string | null>;
/**
 * Memoize an async runtime load so it runs at most once per process, clearing
 * the cache on failure so a later call can retry. Each worker holds one
 * instance per runtime it loads.
 */
export declare class MemoizedRuntime<T> {
    #private;
    load(build: () => Promise<T>): Promise<T>;
}
/**
 * Load the `@huggingface/transformers` runtime into `holder` (memoized): from
 * the ambient install when running from source, or from a version-keyed side
 * runtime (resolved lazily at `runtimeDir()`) when running as a compiled binary.
 * The result is cast to the caller's concrete runtime type `T`.
 */
export declare function loadTransformersRuntime<T extends ConfigurableTransformers, K>(holder: MemoizedRuntime<T>, transport: WorkerProgressTransport<K>, requestId: string, modelKey: K, runtimeDir: () => string): Promise<T>;
export {};
