/**
 * Exposure backends for the blob broker: make the loopback blob server
 * reachable by provider-side image fetchers.
 *
 * Every adapter resolves to a public base URL. Tunnel adapters own a child
 * process whose exit is observable via {@link ActiveExposure.exited} so the
 * broker can stop advertising URLs the moment the tunnel dies.
 */
import { type DestinationRuntimeConfig } from "./uploader-runtime.js";
/** User-selectable exposure strategy. */
export type ExposureKind = "cloudflared" | "ngrok" | "tailscale" | "ssh" | "direct" | "localhost-run" | "pinggy" | "devtunnel" | "zrok" | "bore" | "named-cloudflared";
export interface ExposureConfig {
    kind: ExposureKind;
    /**
     * Externally reachable base URL. Required for `ssh` (the remote web server
     * fronting the forwarded port); optional for `direct`, which otherwise
     * advertises the bind address itself (LAN / same-host use).
     */
    publicBaseUrl?: string;
    /** Blob server bind host. Loopback for tunnels; `0.0.0.0` for direct serving. */
    bindHost: string;
    /** `user@host[:port]` destination for the ssh reverse forward. */
    sshTarget?: string;
    /** Remote listen port of the ssh reverse forward. */
    sshRemotePort?: number;
    /** Destination-specific non-secret tunnel settings. */
    options: DestinationRuntimeConfig["options"];
    /** Destination credentials. Values must never be included in logs or errors. */
    credentials: DestinationRuntimeConfig["credentials"];
}
/** Live exposure of one local port. */
export interface ActiveExposure {
    readonly kind: ExposureKind;
    /** Public origin (no trailing slash) that reaches the local blob server. */
    readonly baseUrl: string;
    /** Resolves when the tunnel child exits; `null` for processless kinds. */
    readonly exited: Promise<void> | null;
    stop(): void;
}
/** Retry and timeout limits for an exposure edge-to-origin health probe. */
export interface ExposureHealthProbeOptions {
    /** Maximum fetch attempts before the exposure is rejected. */
    attempts?: number;
    /** Delay between attempts, in milliseconds. */
    backoffMs?: number;
    /** Per-attempt fetch timeout, in milliseconds. */
    timeoutMs?: number;
}
/** First `https://<sub>.trycloudflare.com` origin in a cloudflared log line. */
export declare function parseCloudflaredUrl(line: string): string | null;
/** Public URL from an ngrok `--log-format json` line (`started tunnel`). */
export declare function parseNgrokUrl(line: string): string | null;
/** Funnel URL from `tailscale funnel` foreground output. */
export declare function parseTailscaleUrl(line: string): string | null;
/** Registered localhost.run TLS origin from its JSON or text output. */
export declare function parseLocalhostRunUrl(line: string): string | null;
/** Public HTTPS origin printed by Pinggy's SSH endpoint. */
export declare function parsePinggyUrl(line: string): string | null;
/** Public HTTPS origin printed by `devtunnel host`. */
export declare function parseDevtunnelUrl(line: string): string | null;
/** Public frontend origin printed by `zrok share public`. */
export declare function parseZrokUrl(line: string): string | null;
/** HTTP origin constructed from the host and port reported by `bore local`. */
export declare function parseBoreUrl(line: string, fallbackHost?: string): string | null;
/**
 * Verify that a public exposure reaches the local blob origin.
 *
 * Each request is cache-busted and time-bounded. Only the broker health
 * endpoint's exact 204 response is accepted; errors expose only the sanitized
 * destination origin and final status.
 */
export declare function probeExposureHealth(baseUrl: string, fetchFn?: typeof globalThis.fetch, options?: ExposureHealthProbeOptions): Promise<void>;
/**
 * Expose `port` per `config`. Throws when the backend is missing,
 * misconfigured, or fails to come up; the caller degrades to inline base64.
 */
export declare function startExposure(config: ExposureConfig, port: number): Promise<ActiveExposure>;
