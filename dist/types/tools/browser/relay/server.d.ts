/**
 * HTTP + WebSocket server for the browser relay.
 *
 * Impersonates Chrome's CDP discovery endpoint so the omp browser tool (and
 * any puppeteer client) can connect with a plain `browserURL`:
 * - `GET /json/version` → 200 with `webSocketDebuggerUrl` once the extension
 *   is connected, 503 before that (clients like `waitForCdp` keep polling).
 * - `GET /json` / `/json/list` → attachable page targets (debugging aid).
 * - `WS /cdp` → downstream CDP clients (puppeteer).
 * - `WS /ext` → the Chrome extension (token-gated when configured).
 *
 * Binds loopback only: anything that can reach this port can drive the
 * user's logged-in browser.
 */
import { RelayBridge } from "./bridge.js";
/** Options for {@link startRelayServer}. */
export interface RelayServerOptions {
    port: number;
    /** Shared secret the extension must present as `?token=`; unset disables the check. */
    token?: string;
    /** Group tabs the agent actively drives under one per-window Chrome tab group (default on); `false` disables. */
    group?: boolean | {
        title: string;
        color: string;
    };
    log?: (message: string, data?: Record<string, unknown>) => void;
}
/** A running relay server. */
export interface RelayServer {
    bridge: RelayBridge;
    port: number;
    stop(): void;
}
/** Start the relay server on 127.0.0.1. Throws if the port is taken. */
export declare function startRelayServer(opts: RelayServerOptions): RelayServer;
