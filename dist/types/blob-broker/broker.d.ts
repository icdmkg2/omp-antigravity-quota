/**
 * Blob URL backends: give outgoing images an externally fetchable URL.
 *
 * `LocalBlobBackend` runs everything in-process — either a loopback HTTP
 * server behind a tunnel/direct exposure (serve mode) or a push-once uploader
 * (upload mode). The daemon-shared variant in `daemon.ts` implements the same
 * {@link BlobBackend} contract over the project blob daemon so every omp
 * process reuses one exposure and one URL per blob.
 *
 * Design invariants:
 * - **Stable, multi-use URLs.** A blob's URL is keyed by content hash for the
 *   backend's lifetime. Anthropic silently forgets images unless a resent turn
 *   is byte-identical, OpenAI's fetcher issues two GETs per image, and any
 *   provider may refetch on a cache miss — single-use tokens would break all
 *   three.
 * - **Unguessable URL is the only authorization.** 128-bit random token per
 *   blob. `User-Agent` attribution (pi-catalog fetcher registry) is telemetry,
 *   never a gate.
 * - **Fail toward inline.** Missing binary, tunnel crash, failed upload, or a
 *   provider rejection all degrade to inline base64.
 */
import type { BlobDestinationId } from "./destinations.js";
import { type ExposureKind } from "./exposure.js";
import type { BlobBrokerDoctorCheck, BlobBrokerProbeResponse, BlobBrokerPurgeRequest, BlobBrokerPurgeResponse, BlobBrokerWorkerConfig, BlobStoreStatus } from "./protocol.js";
import type { BlobPublication } from "./publication.js";
import { type LazyBlobFetcher } from "./store.js";
/** Turns blob bytes into externally fetchable publications. */
export interface BlobBackend {
    /** Whether render-on-fetch blobs are supported (serve mode only). */
    readonly supportsLazy: boolean;
    /**
     * Stable publication for the content behind `key`, or `null` when the backend
     * cannot provide one. `getBytes` is invoked only when the key is unknown —
     * persisted or already-registered blobs never decode or transfer bytes.
     */
    ensureBlob(key: string, mimeType: string, getBytes: () => Uint8Array): Promise<BlobPublication | null>;
    /** Stable publication served by invoking `fetcher` on demand; `null` when unsupported. */
    ensureLazy(key: string, mimeType: string, fetcher: LazyBlobFetcher): Promise<BlobPublication | null>;
    /** Release backend-owned stores, servers, and exposure processes. */
    stop(): void;
}
/** Whether a destination exposes the local blob server. */
export declare function isServeKind(kind: BlobDestinationId): kind is ExposureKind;
/** Whether a configured destination bypasses the local serving path. */
export declare function isUploaderKind(kind: BlobDestinationId): boolean;
/** In-process backend hosting the store, exposure, or uploader directly. */
export declare class LocalBlobBackend implements BlobBackend {
    #private;
    /** Create one local serving or configured upload backend. */
    constructor(config: BlobBrokerWorkerConfig, fetchFn?: typeof globalThis.fetch);
    /** Whether this backend can render blobs on fetch. */
    get supportsLazy(): boolean;
    /**
     * Start the local server and exposure once (serve mode); resolves to the
     * public base URL or `null` after a failure (sticky for this backend).
     */
    ensureStarted(): Promise<string | null>;
    /** Ensure eager bytes have a stable publication. */
    ensureBlob(key: string, mimeType: string, getBytes: () => Uint8Array): Promise<BlobPublication | null>;
    /** Probe for an existing (persisted or live) registration without bytes. */
    lookupBlob(key: string): Promise<BlobPublication | null>;
    /** Ensure a lazy producer has a stable publication. */
    ensureLazy(key: string, mimeType: string, fetcher: LazyBlobFetcher): Promise<BlobPublication | null>;
    /** Return current serving-store counters and fetch attribution. */
    storeStatus(): BlobStoreStatus;
    /** Perform an actual request through the public exposure health endpoint. */
    probePublicHealth(timeoutMs?: number): Promise<BlobBrokerProbeResponse>;
    /** Validate backend configuration and persistent index/disk access. */
    doctor(includeProbe?: boolean): Promise<readonly BlobBrokerDoctorCheck[]>;
    /**
     * Preview cleanup by default. Apply mode first replays each exact remote
     * delete request, then removes local-only and successfully deleted entries.
     */
    purge(request: BlobBrokerPurgeRequest): Promise<BlobBrokerPurgeResponse>;
    /** Local server origin for tests, diagnostics, and the daemon worker. */
    get localBaseUrl(): string | null;
    /** Stop serving and flush persistent registry state. */
    stop(): void;
}
