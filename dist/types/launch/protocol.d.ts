/**
 * Cross-process daemon broker protocol shared by the tool, client, and broker.
 */
/** Hidden CLI selector used to re-enter the daemon broker worker. */
export declare const DAEMON_BROKER_WORKER_ARG = "__omp_worker_daemon_broker";
/** Fixed dimensions negotiated with every supervised PTY. */
export declare const DAEMON_PTY_COLUMNS = 120;
export declare const DAEMON_PTY_ROWS = 40;
/** Environment key carrying the broker's canonical project or synthetic global scope directory. */
export declare const DAEMON_PROJECT_DIR_ENV = "OMP_DAEMON_PROJECT_DIR";
/** Environment key carrying the broker's private runtime directory. */
export declare const DAEMON_RUNTIME_DIR_ENV = "OMP_DAEMON_RUNTIME_DIR";
/** Optional environment key overriding last-client shutdown grace. */
export declare const DAEMON_IDLE_GRACE_ENV = "OMP_DAEMON_IDLE_GRACE_MS";
/** Stable lifecycle states exposed by the launch tool. */
export type DaemonState = "starting" | "running" | "ready" | "restarting" | "stopping" | "exited" | "failed";
/** Restart behavior applied after an unexpected daemon exit. */
export type DaemonRestartPolicy = "no" | "on-failure" | "always";
/** Readiness conditions; every configured condition must pass. */
export interface DaemonReadySpec {
    log?: string;
    port?: number;
    host?: string;
    timeoutMs: number;
}
/** Immutable launch specification retained for restart and inspection. */
export interface DaemonSpec {
    name: string;
    application: string;
    args: string[];
    env: Record<string, string>;
    cwd: string;
    pty: boolean;
    ready?: DaemonReadySpec;
    restart: DaemonRestartPolicy;
    persist: boolean;
    detached: boolean;
}
/** Serializable daemon state visible to every client in one broker scope. */
export interface DaemonSnapshot {
    name: string;
    id: string;
    state: DaemonState;
    pid?: number;
    createdAt: number;
    startedAt: number;
    readyAt?: number;
    exitedAt?: number;
    exitCode?: number;
    exitReason?: string;
    restartCount: number;
    outputBytes: number;
    owner?: string;
    readyMatch?: string;
    /** Readiness conditions still unmet while `state` is `starting`; absent once ready or without a ready spec. */
    readyPending?: ("log" | "port")[];
    persist: boolean;
    detached: boolean;
}
/** Signals accepted by daemon input operations. */
export type DaemonSignal = "SIGINT" | "SIGTERM" | "SIGHUP" | "SIGQUIT" | "SIGKILL";
/** Typed broker operation sent over the authenticated socket. */
export type DaemonOperation = {
    op: "ping";
} | {
    op: "start";
    spec: DaemonSpec;
    owner?: string;
} | {
    op: "list";
} | {
    op: "logs";
    name: string;
    lines: number;
    head: boolean;
    grep?: string;
    follow: boolean;
    cursor?: number;
    /** Ask an upgraded broker to replay PTY output; absent preserves legacy raw-text responses. */
    renderTerminalRows?: boolean;
    timeoutMs: number;
} | {
    op: "wait";
    name: string;
    for: "ready" | "exit";
    pattern?: string;
    timeoutMs: number;
} | {
    op: "send";
    name: string;
    data?: string;
    signal?: DaemonSignal;
} | {
    op: "stop";
    name: string;
    timeoutMs: number;
} | {
    op: "restart";
    name: string;
} | {
    op: "describe";
    name: string;
} | {
    op: "shutdown";
};
/** Typed broker result decoded before it reaches tool code. */
export type DaemonRpcResult = {
    op: "ping";
    projectDir: string;
} | {
    op: "start";
    daemon: DaemonSnapshot;
    readyTimedOut: boolean;
} | {
    op: "list";
    daemons: DaemonSnapshot[];
} | {
    op: "logs";
    name: string;
    text: string;
    /** Virtual PTY rows reconstructed by the broker for terminal display. */
    terminalRows?: string[];
    /** Raw PTY bytes returned by legacy brokers and to clients that did not request rendered rows. */
    terminalText?: string;
    cursor: number;
    timedOut: boolean;
    state: DaemonState;
} | {
    op: "wait";
    daemon: DaemonSnapshot;
    matched?: string;
    timedOut: boolean;
} | {
    op: "send";
    daemon: DaemonSnapshot;
} | {
    op: "stop";
    daemon: DaemonSnapshot;
} | {
    op: "restart";
    daemon: DaemonSnapshot;
} | {
    op: "describe";
    daemon: DaemonSnapshot;
    spec: DaemonSpec;
} | {
    op: "shutdown";
};
/** Authenticated request envelope used by socket clients. */
export interface DaemonWireRequest {
    id: string;
    token: string;
    owners?: string[];
    detachedOwners?: string[];
    completionEvents?: boolean;
    completionAcks?: string[];
    completionUnsubscribes?: string[];
    completionReplays?: string[];
    completionSubscriptionId?: string;
    operation: DaemonOperation;
}
/** Response envelope kept raw until matched with its pending operation. */
export type DaemonWireResponse = {
    id: string;
    ok: true;
    result: unknown;
} | {
    id: string;
    ok: false;
    error: string;
};
/** Unsolicited terminal completion sent to the socket that owns a daemon. */
export interface DaemonCompletionNotification {
    event: "daemon-completed";
    completionId: string;
    owner: string;
    daemon: DaemonSnapshot;
}
export type DaemonWireMessage = DaemonWireResponse | DaemonCompletionNotification;
/** Decode and validate a daemon launch specification. */
export declare function parseDaemonSpec(value: unknown): DaemonSpec;
/** Decode and validate one daemon snapshot. */
export declare function parseDaemonSnapshot(value: unknown): DaemonSnapshot;
/** Decode a socket request before the broker acts on it. */
export declare function parseDaemonWireRequest(value: unknown): DaemonWireRequest;
/** Decode a socket response envelope before resolving a pending call. */
export declare function parseDaemonWireResponse(value: unknown): DaemonWireResponse;
/** Decode one broker response or unsolicited completion notification. */
export declare function parseDaemonWireMessage(value: unknown): DaemonWireMessage;
/** Decode a broker result using its pending operation as the discriminator. */
export declare function parseDaemonRpcResult(operation: DaemonOperation, value: unknown): DaemonRpcResult;
