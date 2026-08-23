/**
 * Session-facing image URL service.
 *
 * Owns policy and session state — provider gating, quarantine, the lazy-frame
 * producer registry, and the render-callback server — and delegates URL
 * minting to a {@link BlobBackend}: the project-shared blob daemon when
 * reachable, an in-process backend otherwise. Every failure at any layer
 * degrades to inline base64.
 */
import type { Context, ImageContent, Model } from "@oh-my-pi/pi-ai";
import * as snapcompact from "@oh-my-pi/snapcompact";
import type { Settings } from "../config/settings.js";
import { type BlobBackend } from "./broker.js";
import type { BlobBrokerWorkerConfig } from "./protocol.js";
import { type ProviderFileCredentialResolver, ProviderFileManager } from "./provider-files.js";
import type { BlobPublication } from "./publication.js";
import { BlobBrokerSavingsJournal } from "./savings.js";
import type { LazyBlobFetcher } from "./store.js";
/**
 * Render-on-fetch hook handed to the snapcompact inline transformer: returns
 * URL-bearing placeholder frames for `text`, or `null` when lazy frames are
 * unavailable (no backend, uploader mode) and the caller must render eagerly.
 */
export interface SnapcompactFrameSink {
    framesFor(text: string, shape: snapcompact.Shape, maxFrames?: number): Promise<ImageContent[] | null>;
}
/**
 * Ordered backend chain that advances when a destination cannot publish.
 *
 * Each ensure call starts at the first backend so healthy persisted
 * publications remain stable while unavailable destinations can be skipped.
 */
export declare class FallbackBlobBackend implements BlobBackend {
    readonly backends: readonly BlobBackend[];
    readonly supportsLazy: boolean;
    constructor(backends: readonly BlobBackend[]);
    ensureBlob(key: string, mimeType: string, getBytes: () => Uint8Array): Promise<BlobPublication | null>;
    ensureLazy(key: string, mimeType: string, fetcher: LazyBlobFetcher): Promise<BlobPublication | null>;
    stop(): void;
}
/** Coordinates image URL decoration for one session process. */
export declare class ImageUrlService {
    #private;
    constructor(projectDir: string, configs: readonly BlobBrokerWorkerConfig[], options?: {
        daemon?: boolean;
        providerFiles?: ProviderFileManager;
        providerFilePosition?: number;
        savingsJournal?: BlobBrokerSavingsJournal;
    });
    /** Kick off daemon/exposure startup in the background to hide latency. */
    prewarm(): void;
    /**
     * Decorate images in configured backend order. The first source that can
     * represent an image wins; provider-native upload failures continue into
     * the following URL destinations without changing the session context.
     */
    decorateContext(context: Context, model: Model): Promise<Context>;
    /**
     * Lazy snapcompact frames: URL-bearing placeholders whose PNG renders only
     * when a provider fetches them. `null` in uploader mode or when no backend
     * is reachable — the transformer then renders eagerly as before.
     */
    get frameSink(): SnapcompactFrameSink;
    /**
     * Undo URL decoration for an inline retry: strip URLs and materialize
     * lazy placeholders (empty `data`) through their session-side producers.
     */
    inlineContext(context: Context): Promise<Context>;
    /**
     * Advance one rejected image source. Provider-file rejection starts the
     * URL chain from its beginning. URL rejection resumes strictly after the
     * destination that produced the failed publication, then falls back inline.
     */
    fallbackContext(context: Context, model: Model): Promise<Context>;
    /** Stop decorating for `provider`; used when inline retry proved URLs were the failure. */
    quarantine(provider: string, reason: string): void;
    isQuarantined(provider: string): boolean;
    stop(): void;
}
/** Deterministic durable provider-file cache path for one project. */
export declare function providerFileCachePath(settings: Settings, projectDir: string): string;
/** Resolve configured URL destinations without constructing their runtimes. */
export declare function resolveBlobBrokerConfigs(settings: Settings, projectDir: string): BlobBrokerWorkerConfig[];
/** Resolve the settings group into a service; `undefined` when disabled. */
export declare function createImageUrlServiceFromSettings(settings: Settings, projectDir: string, resolveCredential: ProviderFileCredentialResolver): ImageUrlService | undefined;
