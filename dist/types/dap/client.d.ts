import type { DapCapabilities, DapClientState, DapEventMessage, DapInitializeArguments, DapRequestMessage, DapResolvedAdapter } from "./types.js";
interface DapSpawnOptions {
    adapter: DapResolvedAdapter;
    cwd: string;
    /**
     * Cap on how long the socket-mode helpers wait for the adapter to open its
     * socket (unix) or dial back into our listener (TCP). Exposed for tests;
     * production callers rely on the default.
     *
     * @internal
     */
    socketReadyTimeoutMs?: number;
}
/** Minimal write interface shared by Bun.FileSink and Bun TCP sockets. */
interface DapWriteSink {
    write(data: string | Uint8Array): number | Promise<number>;
    flush(): number | Promise<number> | undefined;
}
type DapEventHandler = (body: unknown, event: DapEventMessage) => void | Promise<void>;
type DapReverseRequestHandler = (args: unknown) => unknown | Promise<unknown>;
export declare class DapClient {
    #private;
    readonly adapter: DapResolvedAdapter;
    readonly cwd: string;
    readonly proc: DapClientState["proc"];
    /** TCP server port reused by child DAP sessions. */
    readonly port?: number;
    constructor(adapter: DapResolvedAdapter, cwd: string, proc: DapClientState["proc"], options?: {
        readable?: ReadableStream<Uint8Array>;
        writeSink?: DapWriteSink;
        socket?: {
            end(): void;
        };
        port?: number;
    });
    static spawn({ adapter, cwd, socketReadyTimeoutMs }: DapSpawnOptions): Promise<DapClient>;
    /** Connect to another session on an existing TCP DAP server. */
    static connect({ adapter, cwd, host, port, }: {
        adapter: DapResolvedAdapter;
        cwd: string;
        host: string;
        port: number;
    }): Promise<DapClient>;
    get capabilities(): DapCapabilities | undefined;
    get lastActivity(): number;
    isAlive(): boolean;
    initialize(args: DapInitializeArguments, signal?: AbortSignal, timeoutMs?: number): Promise<DapCapabilities>;
    onEvent(event: string, handler: DapEventHandler): () => void;
    onAnyEvent(handler: DapEventHandler): () => void;
    onReverseRequest(command: string, handler: DapReverseRequestHandler): () => void;
    waitForEvent<TBody>(event: string, predicate?: (body: TBody) => boolean, signal?: AbortSignal, timeoutMs?: number): Promise<TBody>;
    sendRequest<TBody = unknown>(command: string, args?: unknown, signal?: AbortSignal, timeoutMs?: number): Promise<TBody>;
    sendResponse(request: DapRequestMessage, success: boolean, body?: unknown, message?: string): Promise<void>;
    dispose(): Promise<void>;
}
/**
 * Give the adapter a chance to announce it is listening on `port` before the
 * first connect. vscode-js-debug prints `Debug server listening at HOST:PORT`
 * to stdout from inside its `listen()` callback; waiting for the port to appear
 * there means we only connect once the child genuinely owns the reserved port,
 * which closes the WSL2-mirrored ghost-accept window (issue #6055) at its root.
 *
 * Best-effort: resolves on the banner, on process exit, or on timeout — the
 * subsequent connect loop and `proc.exitCode` checks surface real failures, so
 * an adapter that never prints a banner still proceeds (just without the gate).
 * Also drains stdout for the wait's duration: in tcp mode the DAP protocol
 * flows over the socket, so nothing else consumes the adapter's stdout.
 *
 * Exported so tests can drive the gate deterministically with a synthetic stdout.
 */
export declare function waitForTcpServerListening(proc: {
    stdout: ReadableStream<Uint8Array>;
    exitCode: number | null;
}, port: number, timeoutMs: number): Promise<void>;
interface SocketTransport {
    readable: ReadableStream<Uint8Array>;
    writeSink: DapWriteSink;
    socket: {
        end(): void;
    };
}
/**
 * Connect to a unix domain socket and return DAP transport streams.
 *
 * Rejects (rather than hanging) when the connect fails — a stat-ready but dead
 * socket returns ECONNREFUSED, a socket removed between the readiness stat and
 * the connect returns ENOENT, a permission mismatch returns EACCES — and when
 * neither `open` nor an error arrives within `timeoutMs` (e.g. a TOCTOU stall).
 * `#spawnSocketUnix`'s catch then kills the detached adapter instead of leaking
 * it. Exported so tests can drive the reject path deterministically.
 */
export declare function connectSocket(options: {
    unix: string;
}, timeoutMs: number): Promise<SocketTransport>;
export {};
