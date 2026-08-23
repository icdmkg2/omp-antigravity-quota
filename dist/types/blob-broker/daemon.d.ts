/**
 * Client half of the project-shared blob daemon.
 *
 * `connectDaemonBlobBackend` ensures the blob daemon is running under the
 * daemon broker (same lifecycle as the shared Chromium and LSP mux: started on
 * first use, stopped when the last omp process in the project exits), then
 * speaks the HTTP-over-Unix-socket control plane from `protocol.ts`. Every
 * failure returns `null` so callers fall back to an in-process backend.
 */
import type { BlobBackend } from "./broker.js";
import { type BlobBrokerDoctorRequest, type BlobBrokerDoctorResponse, type BlobBrokerProbeRequest, type BlobBrokerProbeResponse, type BlobBrokerPurgeRequest, type BlobBrokerPurgeResponse, type BlobBrokerStatus, type BlobBrokerWorkerConfig } from "./protocol.js";
import type { LazyBlobFetcher } from "./store.js";
/** Session-side callback registry the daemon renders lazy blobs through. */
export interface RenderCallbackHost {
    /** Start (once) and describe the loopback callback server. */
    ensure(): Promise<{
        port: number;
        token: string;
    } | null>;
    /** Register the fetcher answering callbacks for `key`. */
    register(key: string, fetcher: LazyBlobFetcher): void;
}
/** Query a running blob daemon without starting one; `null` means stopped. */
export declare function queryBlobBrokerStatus(projectDir: string): Promise<BlobBrokerStatus | null>;
/** Run diagnostics on a running blob daemon; `null` means stopped. */
export declare function queryBlobBrokerDoctor(projectDir: string, request?: BlobBrokerDoctorRequest): Promise<BlobBrokerDoctorResponse | null>;
/**
 * Ensure the configured daemon is active, then issue an actual public health
 * request through its exposure. `null` means the daemon could not be started.
 */
export declare function queryBlobBrokerProbe(projectDir: string, config: BlobBrokerWorkerConfig, request?: BlobBrokerProbeRequest): Promise<BlobBrokerProbeResponse | null>;
/** Preview or apply cleanup on a running daemon; `null` means stopped. */
export declare function queryBlobBrokerPurge(projectDir: string, request?: BlobBrokerPurgeRequest): Promise<BlobBrokerPurgeResponse | null>;
/**
 * Connect the project-shared blob daemon, starting it when necessary.
 * Returns `null` (after a debug log) when the shared path is unavailable —
 * including on Windows, where the control plane's Unix socket cannot bind —
 * so the caller falls back to an in-process backend.
 */
export declare function connectDaemonBlobBackend(projectDir: string, config: BlobBrokerWorkerConfig, callbacks: RenderCallbackHost): Promise<BlobBackend | null>;
/** Exercise worker-host blob daemon startup and the /info probe for distribution smoke tests. */
export declare function smokeTestBlobBroker(): Promise<void>;
