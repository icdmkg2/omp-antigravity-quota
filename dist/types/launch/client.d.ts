import { type DaemonCompletionNotification, type DaemonOperation, type DaemonRpcResult } from "./protocol.js";
/** Broker location and lifecycle overrides used by smoke tests and isolated consumers. */
export interface DaemonBrokerClientOptions {
    /** Runtime directory override; defaults to the project-scoped config path. */
    runtimeDir?: string;
    /** Last-client shutdown grace override in milliseconds. */
    idleGraceMs?: number;
}
export interface DaemonCompletionUnregisterOptions {
    /** Detach this process without deleting broker-persisted pending notifications. */
    preservePending?: boolean;
}
/** Persistent per-process connection to one project or global daemon broker. */
export interface DaemonBrokerClient {
    onCompletion(owner: string, sink: (notification: DaemonCompletionNotification) => Promise<void> | void): (options?: DaemonCompletionUnregisterOptions) => void;
    /** Canonical project directory or synthetic directory identifying a global scope. */
    readonly projectDir: string;
    request(operation: DaemonOperation, signal?: AbortSignal): Promise<DaemonRpcResult>;
    close(): void;
}
/** A request reached the broker and the broker rejected the operation. */
export declare class DaemonBrokerRejectedError extends Error {
}
/** Create an independent socket connection to one daemon broker scope. */
export declare function createDaemonBrokerClient(projectDir: string, options?: DaemonBrokerClientOptions): Promise<DaemonBrokerClient>;
/** Get the process-shared daemon broker client for one canonical project directory. */
export declare function daemonClientForProject(projectDir: string): Promise<DaemonBrokerClient>;
/** Get the process-shared client that leases one profile-independent, machine-global daemon broker. */
export declare function daemonClientForGlobal(service: string): Promise<DaemonBrokerClient>;
/** Close every project and machine-global broker connection held by this omp process. */
export declare function closeDaemonClients(): Promise<void>;
/** Exercise worker-host broker startup and authenticated RPC for distribution smoke tests. */
export declare function smokeTestDaemonBroker(): Promise<void>;
