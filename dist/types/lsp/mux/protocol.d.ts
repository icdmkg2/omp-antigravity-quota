/** Hidden CLI selector used to re-enter the LSP mux worker. */
export declare const LSP_MUX_WORKER_ARG = "__omp_worker_lsp_mux";
/** Environment key carrying the socket endpoint the mux must listen on. */
export declare const LSP_MUX_SOCKET_ENV = "OMP_LSP_MUX_SOCKET";
/** Environment key carrying the canonical project directory the mux serves. */
export declare const LSP_MUX_PROJECT_DIR_ENV = "OMP_LSP_MUX_PROJECT_DIR";
/** Stable broker daemon name for the shared LSP mux. */
export declare const LSP_MUX_DAEMON_NAME = "omp.lsp.mux";
/** Broker readiness regex matched against the banner printed by the worker. */
export declare const LSP_MUX_READY_PATTERN: string;
/** Banner printed on stdout once the mux socket accepts connections. */
export declare function lspMuxReadyBanner(endpoint: string): string;
/** Resolve the Unix socket or Windows named pipe for one project scope. */
export declare function lspMuxEndpoint(projectDir: string, runtimeDir: string): string;
/**
 * First (and only pre-LSP) request on a fresh connection: binds the link to
 * an idle server instance or spawns one. Params: {@link MuxConnectParams},
 * result: {@link MuxConnectResult}. After the response the link carries
 * ordinary LSP traffic for that server.
 */
export declare const MUX_CONNECT_METHOD = "omp/muxConnect";
/**
 * Liveness probe answered with {@link MUX_PING_RESULT} without binding the
 * link to a server. Used by the smoke probe and the ensure loop.
 */
export declare const MUX_PING_METHOD = "omp/muxPing";
export declare const MUX_PING_RESULT = "pong";
/**
 * Notification on a bound link: kill that link's server process. Sent by
 * `lsp reload` when the generic reload path decides the server is wedged —
 * a plain per-session `shutdown`/`exit` is intercepted by the mux so the
 * process can linger for reuse.
 */
export declare const MUX_RESTART_METHOD = "omp/muxRestartServer";
/** Handshake parameters identifying a reusable server process. */
export interface MuxConnectParams {
    /** Executable to spawn (the client's `resolvedCommand ?? command`). */
    command: string;
    /** Arguments passed verbatim to the executable. */
    args: string[];
    /** Workspace root the server runs in; part of the server identity key. */
    cwd: string;
    /** Extra environment overlaid on the mux daemon's own env for the spawn. */
    env?: Record<string, string>;
}
/** Handshake result. */
export interface MuxConnectResult {
    /** Server identity key inside the mux; covers command, args, cwd, and env. */
    key: string;
    /** True when this handshake spawned the server process. */
    spawned: boolean;
    /** Pid of the server process assigned to this link. */
    pid?: number;
}
/**
 * Server identity key used by the mux registry.
 *
 * Every input that changes what the spawned process actually *is* belongs in
 * this key: the registry spawns `[command, ...args]` in `cwd` with
 * `{ ...Bun.env, ...env }`, so two links that agree on command and cwd but
 * differ in args or env are not interchangeable. Keying on command and cwd
 * alone let an idle server started with one argument set be handed to a link
 * that asked for another, silently serving the wrong configuration from a
 * process the client believed it had configured.
 *
 * Env keys are sorted so object insertion order never splits one identity in
 * two, and the parts are JSON-encoded so no separator can be forged from a
 * value (`["--log-level", "4"]` stays distinct from `["--log-level 4"]`).
 * The canonical identity is SHA-256 hashed because the key is returned over
 * the handshake and included in mux logs; raw environment values can contain
 * credentials and must not leak through either surface.
 */
export declare function muxServerKey(params: MuxConnectParams): string;
