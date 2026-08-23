import type { DesktopCapabilities } from "@oh-my-pi/pi-natives";
import type { ToolSession } from "../index.js";
import { type ComputerRunOk, type ComputerSessionSnapshot, type ComputerWorkerInbound, type ComputerWorkerOutbound } from "./protocol.js";
/** Runs desktop scripts and owns their persistent worker session. */
export interface ComputerController {
    run(code: string, timeoutMs: number, snapshot: ComputerSessionSnapshot, signal?: AbortSignal): Promise<ComputerRunOk>;
    capabilities(): Promise<DesktopCapabilities | undefined>;
    close(): Promise<void>;
}
/** Minimal Bun worker lifecycle surface used by the supervisor. */
export interface ComputerWorkerHandle {
    send(message: ComputerWorkerInbound): void;
    onMessage(handler: (message: ComputerWorkerOutbound) => void): () => void;
    onError(handler: (error: Error) => void): () => void;
    terminate(): Promise<void>;
}
/** Startup and shutdown deadlines for a computer worker. */
export interface ComputerSupervisorTimeouts {
    startMs: number;
    closeMs: number;
}
/** Dispatches a tool call requested from desktop JavaScript. */
export type ComputerSessionToolCaller = (name: string, args: unknown, options: {
    session: ToolSession;
    signal?: AbortSignal;
    emitStatus?: () => void;
}) => Promise<unknown>;
/** Creates an isolated computer worker handle. */
export type ComputerWorkerFactory = () => ComputerWorkerHandle;
/** Spawns the computer worker through the active CLI host when available. */
export declare function spawnComputerWorker(): ComputerWorkerHandle;
/** Supervises one lazy, crash-isolated computer worker per agent session. */
export declare class ComputerSupervisor implements ComputerController {
    #private;
    constructor(session: ToolSession, createWorker?: ComputerWorkerFactory, timeouts?: ComputerSupervisorTimeouts, callSessionTool?: ComputerSessionToolCaller);
    capabilities(): Promise<DesktopCapabilities | undefined>;
    run(code: string, timeoutMs: number, snapshot: ComputerSessionSnapshot, signal?: AbortSignal): Promise<ComputerRunOk>;
    close(): Promise<void>;
}
/** Registers a controller for owner-scoped session cleanup. */
export declare function registerComputerController(ownerId: string | undefined, controller: ComputerController): () => void;
/** Closes every computer session owned by an agent session. */
export declare function releaseComputerSessionsForOwner(ownerId: string | undefined): Promise<void>;
/** Verifies computer worker startup, messaging, and bounded shutdown. */
export declare function smokeTestComputerWorker(timeoutMs?: number, createWorker?: ComputerWorkerFactory): Promise<void>;
