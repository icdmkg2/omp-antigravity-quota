import type { DaemonBrokerClient } from "./client.js";
import type { DaemonSnapshot } from "./protocol.js";
/** Snapshot a broker daemon, treating "unknown daemon" and broker errors as absent. */
export declare function describeQuietly(client: DaemonBrokerClient, name: string, label: string, signal?: AbortSignal): Promise<DaemonSnapshot | undefined>;
/** Block until the daemon reports ready; undefined on timeout or pre-ready exit. */
export declare function waitReady(client: DaemonBrokerClient, name: string, label: string, signal?: AbortSignal, timeoutMs?: number): Promise<DaemonSnapshot | undefined>;
/** Best-effort stop before replacing a wedged or endpoint-less daemon. */
export declare function stopQuietly(client: DaemonBrokerClient, name: string, label: string, signal?: AbortSignal): Promise<void>;
