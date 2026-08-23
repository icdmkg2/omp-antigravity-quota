import { type SpawnedSubprocess, type WorkerHandle } from "../subprocess/worker-client.js";
import type { MnemopiEmbedModelId, MnemopiEmbedWorkerInbound, MnemopiEmbedWorkerOutbound } from "./embed-protocol.js";
/**
 * Parent-side handle for the mnemopi embeddings subprocess. The runtime
 * implementation is a Bun child process so `onnxruntime-node`'s NAPI
 * constructor + finalizer never run inside the main agent address space —
 * those destructors segfault Bun on Windows when mnemopi's local embedding
 * provider loads fastembed in the main process (issue #3031; the mnemopi
 * sibling of the tiny-model fix from #1606 / #1607).
 */
export type MnemopiEmbedWorkerHandle = WorkerHandle<MnemopiEmbedWorkerInbound, MnemopiEmbedWorkerOutbound>;
/**
 * Hidden subcommand on the main CLI that boots the mnemopi embeddings worker
 * in the spawned subprocess. Kept in sync with the dispatch in `cli.ts`.
 */
export declare const MNEMOPI_EMBED_WORKER_ARG = "__omp_worker_mnemopi_embed";
/**
 * Spawn the mnemopi embeddings worker as a subprocess. Exported for tests and
 * the smoke probe; production callers go through {@link spawnMnemopiEmbedWorker}.
 * The child inherits the parent env — fastembed honours `HF_HUB_*`,
 * `HTTPS_PROXY`, etc., and our `loadFastembed()` reads the same `OMP_*`
 * runtime-install knobs the parent uses.
 */
export declare function createMnemopiEmbedSubprocess(): SpawnedSubprocess<MnemopiEmbedWorkerOutbound>;
/**
 * Per-model wrapper produced by {@link MnemopiEmbedClient.initialize}.
 * `embed()` round-trips one batch of texts through the worker subprocess and
 * yields the resulting vectors in a single asynchronous batch — fastembed's
 * own iterator was emitting batches that we collect on the child side anyway,
 * and serializing per-batch over IPC would not improve throughput.
 */
export interface MnemopiSubprocessEmbeddingModel {
    embed(texts: string[], batchSize?: number): AsyncIterable<number[][]>;
}
export declare class MnemopiEmbedClient {
    #private;
    constructor(spawnWorker?: () => MnemopiEmbedWorkerHandle, requestTimeoutMs?: number);
    /**
     * Load the named fastembed model inside the subprocess. Resolves to a
     * thin wrapper whose `embed()` round-trips through the same worker, or
     * `null` when the worker cannot init the model (missing peer, native
     * load failure, etc.). Multiple calls with the same model reuse the
     * single in-flight worker; calling with a different model loads it on
     * the child without restarting the process.
     */
    initialize(model: MnemopiEmbedModelId, cacheDir: string | undefined): Promise<MnemopiSubprocessEmbeddingModel | null>;
    terminate(): Promise<void>;
}
export declare const mnemopiEmbedClient: MnemopiEmbedClient;
export declare function shutdownMnemopiEmbedClient(): Promise<void>;
export declare function smokeTestMnemopiEmbedWorker({ timeoutMs, }?: {
    timeoutMs?: number;
}): Promise<void>;
