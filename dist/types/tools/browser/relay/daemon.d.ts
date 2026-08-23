/** Stable broker daemon name for the relay server. */
export declare const RELAY_DAEMON_NAME = "omp.browser.relay";
/** True when the relay HTTP server answers /json/version at all (200 = extension connected, 503 = waiting for it). */
export declare function probeRelayServer(cdpUrl: string): Promise<boolean>;
/** Auto-start is only safe for endpoints this machine can own. */
export declare function isLoopbackRelayUrl(cdpUrl: string): boolean;
/**
 * Ensure a relay server answers at `cdpUrl`, starting the broker-owned daemon
 * when nothing is serving. Returns true once the HTTP endpoint responds — the
 * extension handshake (503 → 200) is the caller's wait. False when the relay
 * could not be started (broker unavailable or start rounds exhausted).
 */
export declare function ensureRelayDaemon(opts: {
    cdpUrl: string;
    signal?: AbortSignal;
}): Promise<boolean>;
