/** Browser kind selecting the omp browser relay. */
export interface RelayKind {
    kind: "relay";
    cdpUrl: string;
}
/** Default endpoint of the `omp-browser-relay` CLI. */
export declare const DEFAULT_RELAY_URL = "http://127.0.0.1:9224";
export interface ResolveRelayKindOptions {
    /** `browser.relay` setting; `PI_BROWSER_RELAY=0|1` overrides it. */
    settingEnabled?: boolean;
    /** `browser.relayUrl` setting; falls back to {@link DEFAULT_RELAY_URL}. */
    url?: string;
}
/**
 * Resolve the relay browser kind, or null when relay mode is disabled.
 * Mirrors `resolveCmuxKind`: the setting opts in, the env var is the final
 * override in both directions.
 */
export declare function resolveRelayKind(options?: ResolveRelayKindOptions | null, env?: Record<string, string | undefined>): RelayKind | null;
