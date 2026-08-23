/**
 * Mnemopi local-embeddings worker. Loaded inside the dedicated subprocess
 * spawned by `embed-client.ts` (re-entered through the agent CLI's hidden
 * `__omp_worker_mnemopi_embed` selector). The whole point of this module is
 * that `loadFastembed()` — and therefore `onnxruntime-node`'s NAPI
 * constructor + finalizer — only ever runs in this child address space. The
 * parent `SIGKILL`s us on shutdown so the destructor that crashes Bun on
 * Windows shutdown (issue #3031, mnemopi sibling of #1606/#1607) never runs
 * in either process.
 */
import type { MnemopiEmbedTransport } from "./embed-protocol.js";
export declare function startMnemopiEmbedWorker(transport: MnemopiEmbedTransport): void;
