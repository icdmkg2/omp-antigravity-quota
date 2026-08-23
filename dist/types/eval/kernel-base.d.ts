import type { Subprocess } from "bun";
import { type KernelDisplayOutput } from "./py/display.js";
export type KernelRuntimeEnv = Record<string, string | null>;
export interface KernelExecuteOptions {
    id?: string;
    /** Runtime working directory applied immediately before this request executes. */
    cwd?: string;
    /** Managed runtime environment variables applied immediately before this request executes. */
    env?: Record<string, string | undefined> | Record<string, string | null>;
    signal?: AbortSignal;
    onChunk?: (text: string) => Promise<void> | void;
    onDisplay?: (output: KernelDisplayOutput) => Promise<void> | void;
    timeoutMs?: number;
    silent?: boolean;
    storeHistory?: boolean;
    allowStdin?: boolean;
}
export interface KernelExecuteResult {
    status: "ok" | "error";
    executionCount?: number;
    error?: {
        name: string;
        value: string;
        traceback: string[];
    };
    cancelled: boolean;
    timedOut: boolean;
    stdinRequested: boolean;
    /**
     * True when the kernel subprocess was killed as part of settling this
     * execution (e.g. SIGINT was ignored and we escalated to shutdown, or the
     * kernel died unexpectedly). When false, the kernel remains reusable.
     */
    kernelKilled?: boolean;
}
export interface KernelShutdownResult {
    confirmed: boolean;
}
export interface KernelShutdownOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
}
/** Per-language lifecycle configuration consumed by each kernel's `start()`. */
export interface KernelStartOptions {
    cwd: string;
    env?: Record<string, string | undefined>;
    /** Explicit interpreter path; skips discovery when set. */
    interpreter?: string;
    signal?: AbortSignal;
    deadlineMs?: number;
}
/** Per-language configuration handed to {@link BaseKernel} by each subclass. */
export interface BaseKernelOptions<TExecuteOptions extends KernelExecuteOptions = KernelExecuteOptions> {
    /** Human-readable language label used in log messages and errors. */
    languageName: string;
    /** When true, every IPC frame is logged at debug level. */
    traceIpc: boolean;
    /** Wire payload asking the runner to exit cleanly. */
    exitPayload: string;
    /** How long to wait after SIGINT before escalating to subprocess termination. */
    interruptEscalationMs: number;
    /** Default grace period applied by {@link BaseKernel.shutdown}. */
    shutdownGraceMs: number;
    /** Serializes an execution request into the runner's wire protocol. */
    buildPayload: (code: string, msgId: string, options?: TExecuteOptions) => string;
}
export type FrameType = "started" | "stdout" | "stderr" | "display" | "result" | "error" | "done";
export interface Frame {
    type: FrameType;
    id?: string;
    data?: string;
    bundle?: Record<string, unknown>;
    ename?: string;
    evalue?: string;
    traceback?: string[];
    status?: "ok" | "error";
    executionCount?: number;
    cancelled?: boolean;
}
export declare function getRemainingTimeMs(deadlineMs?: number): number | undefined;
export declare function createAbortError(name: "AbortError" | "TimeoutError", message: string): Error;
export declare function throwIfAborted(signal: AbortSignal | undefined, fallbackReason: string): void;
export declare function isTimeoutReason(reason: unknown): boolean;
/**
 * Shared subprocess-backed kernel machinery for the language runners. Each
 * language subclasses this, supplying its binary/runner via a static `start()`
 * and its wire protocol via {@link BaseKernelOptions.buildPayload}. The IPC loop
 * speaks NDJSON: the runner emits one JSON {@link Frame} per line; outbound
 * requests are serialized by `buildPayload` (which may itself be NDJSON or any
 * other line-delimited encoding).
 *
 * `TExecuteOptions` is the language's own execute-options type so each runner's
 * `buildPayload` sees its precise option shape (e.g. environment-map variants).
 */
export declare abstract class BaseKernel<TExecuteOptions extends KernelExecuteOptions = KernelExecuteOptions> {
    #private;
    readonly id: string;
    constructor(id: string, options: BaseKernelOptions<TExecuteOptions>);
    setProcess(proc: Subprocess<"pipe", "pipe", "pipe">): void;
    isAlive(): boolean;
    execute(code: string, options?: TExecuteOptions): Promise<KernelExecuteResult>;
    interrupt(): Promise<void>;
    shutdown(options?: KernelShutdownOptions): Promise<KernelShutdownResult>;
    executeWithBudget(code: string, signal: AbortSignal | undefined, timeoutMs: number, label: string): Promise<void>;
}
