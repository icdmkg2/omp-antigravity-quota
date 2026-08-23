/**
 * Worker entry for the project-shared blob daemon (`__omp_worker_blob_broker`).
 *
 * Hosts a {@link LocalBlobBackend} (store + exposure or uploader) plus an HTTP
 * control plane on a Unix socket. Sessions register blobs over the socket;
 * providers fetch them through the exposure. Lazy blobs resolve through a
 * loopback callback into the owning session, so nothing renders — and nothing
 * stays resident — until a provider actually asks for the bytes.
 */
import { LocalBlobBackend } from "./broker.js";
import { type BlobBrokerWorkerConfig } from "./protocol.js";
/** Stable identity for a worker config, used by clients to detect drift. */
export declare function blobBrokerConfigKey(config: BlobBrokerWorkerConfig): string;
/** Serve the control plane against a backend; exported for the smoke probe and tests. */
export declare function createControlHandler(backend: LocalBlobBackend, config: BlobBrokerWorkerConfig, baseUrl: string): (request: Request) => Promise<Response>;
/** Boot the blob daemon from worker environment variables and serve forever. */
export declare function startBlobBrokerFromEnvironment(): Promise<void>;
