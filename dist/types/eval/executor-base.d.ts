import type { ToolSession } from "../tools/index.js";
import type { JsStatusEvent } from "./js/shared/types.js";
import type { KernelDisplayOutput } from "./py/display.js";
/**
 * Constructor for a language executor's cancellation error. Each backend
 * subclasses {@link Error} and carries a `timedOut` flag distinguishing a
 * deadline expiry from a plain abort.
 */
export type CancelledErrorClass = new (timedOut: boolean) => Error & {
    timedOut: boolean;
};
/** Managed-env values a kernel patch may carry (`null` clears, `undefined` skips). */
export type KernelEnvPatch = Record<string, string | null | undefined>;
/**
 * Options every kernel-backed language executor shares. Per-language option
 * interfaces structurally extend this; the base executor only reads these.
 */
export interface KernelExecutorBaseOptions {
    cwd?: string;
    timeoutMs?: number;
    deadlineMs?: number;
    idleTimeoutMs?: number;
    onChunk?: (chunk: string) => Promise<void> | void;
    signal?: AbortSignal;
    onStatus?: (event: JsStatusEvent) => void;
    emitStatus?: (event: JsStatusEvent) => void;
    toolSession?: ToolSession;
    bridgeSessionId?: string;
    artifactId?: string;
    artifactPath?: string;
}
/** Normalised execution result produced by {@link executeWithKernelBase}. */
export interface KernelExecutionResult {
    output: string;
    exitCode: number | undefined;
    cancelled: boolean;
    truncated: boolean;
    artifactId: string | undefined;
    totalLines: number;
    totalBytes: number;
    outputLines: number;
    outputBytes: number;
    displayOutputs: KernelDisplayOutput[];
    stdinRequested: boolean;
}
/** Minimal kernel surface the base executor drives, satisfied by every backend kernel. */
export interface GenericKernel<TEnv> {
    execute(code: string, options: {
        cwd?: string;
        env?: TEnv;
        id: string;
        signal?: AbortSignal;
        onChunk: (text: string) => Promise<void> | void;
        onDisplay: (output: KernelDisplayOutput) => Promise<void> | void;
    }): Promise<{
        status: "ok" | "error";
        cancelled: boolean;
        timedOut: boolean;
        kernelKilled?: boolean;
        stdinRequested?: boolean;
    }>;
}
export declare function getExecutionDeadlineMs(options?: {
    deadlineMs?: number;
    timeoutMs?: number;
}): number | undefined;
export declare function getRemainingTimeoutMs(deadlineMs?: number): number | undefined;
export declare function isCancellationError(error: unknown, cancelledErrorClass: CancelledErrorClass): boolean;
export declare function isTimedOutCancellation(error: unknown, cancelledErrorClass: CancelledErrorClass, signal?: AbortSignal): boolean;
export declare function waitForPromiseWithCancellation<T>(promise: Promise<T>, options: {
    signal?: AbortSignal;
    deadlineMs?: number;
}, cancelledErrorClass: CancelledErrorClass, timedOutResolver?: (error: unknown, signal?: AbortSignal) => boolean): Promise<T>;
export declare function createCancelledKernelResult(output: string): KernelExecutionResult;
export declare const MANAGED_KERNEL_ENV_KEYS: readonly ["PI_SESSION_FILE", "PI_ARTIFACTS_DIR", "PI_TOOL_BRIDGE_URL", "PI_TOOL_BRIDGE_TOKEN", "PI_TOOL_BRIDGE_SESSION", "PI_EVAL_LOCAL_ROOTS"];
interface ManagedKernelEnvOptions {
    sessionFile?: string;
    artifactsDir?: string;
    bridgeSessionId?: string;
    bridge?: {
        url: string;
        token: string;
    };
    localRoots?: Record<string, string>;
}
interface ManagedKernelEnvPolicy {
    sparse?: boolean;
}
export declare function buildManagedKernelEnvPatch(options: ManagedKernelEnvOptions): Record<string, string | null>;
export declare function buildManagedKernelEnvPatch(options: ManagedKernelEnvOptions, policy: {
    sparse: true;
}): Record<string, string | undefined>;
export declare function buildManagedKernelEnv(options: ManagedKernelEnvOptions, policy?: ManagedKernelEnvPolicy): Record<string, string> | undefined;
export declare function attachSessionOwner(session: {
    ownerIds: Set<string>;
    hasFallbackOwner: boolean;
}, sessionId: string, ownerId: string | undefined): void;
/** Owner registry shared by every language's live/starting session records. */
export interface SessionOwners {
    ownerIds: Set<string>;
    hasFallbackOwner: boolean;
}
/**
 * Resolve the session key an owner's eval cell runs on, forking `reset` away
 * from shared kernels.
 *
 * Eval sessions are shared across agents by design (subagents inherit the
 * parent's eval session id), so honoring `reset` on a co-owned kernel would
 * destroy every other agent's state — including cells executing at that
 * moment. When the requester does not exclusively own the live base session,
 * its reset resolves to a deterministic per-owner fork key: the requester
 * starts a fresh private kernel while co-owners keep the shared one. Once
 * forked, the owner keeps resolving to its fork, and per-owner dispose reaps
 * the fork since the requester is its only registered owner.
 */
export declare function resolveOwnerScopedSessionKey(options: {
    baseKey: string;
    ownerId: string | undefined;
    reset: boolean;
    /** True when a live or starting session exists under `key`. */
    hasSession: (key: string) => boolean;
    /** Owner registry for the session under `key`, when inspectable. */
    getOwners: (key: string) => SessionOwners | undefined;
}): string;
export interface ExecuteWithKernelBaseParams<TOptions extends KernelExecutorBaseOptions, TEnv extends KernelEnvPatch = Record<string, string | null>> {
    kernel: GenericKernel<TEnv>;
    code: string;
    options: TOptions | undefined;
    /** Prefix for the per-execution run id (e.g. `"py"`, `"rb"`, `"jl"`). */
    runIdPrefix: string;
    /** Human-readable language label used in the failure log line. */
    errorLogLabel: string;
    /**
     * Julia surfaces eval-timeout control events through its normal status path,
     * so they must NOT be filtered out the way the JS-status backends do.
     */
    isJulia?: boolean;
    cancelledErrorClass: CancelledErrorClass;
    buildKernelEnvPatch: (options: TOptions) => TEnv;
    formatKernelTimeoutAnnotation: (executionTimeoutMs: number | undefined, kernelKilled: boolean) => string;
    formatTimeoutAnnotation: (executionTimeoutMs: number | undefined) => string | undefined;
    /**
     * Override how the wall-clock deadline is derived from options. Defaults to
     * {@link getExecutionDeadlineMs}; Julia passes the pre-computed `deadlineMs`
     * straight through instead of re-deriving from `timeoutMs`.
     */
    resolveDeadlineMs?: (options: TOptions | undefined) => number | undefined;
}
export declare function executeWithKernelBase<TOptions extends KernelExecutorBaseOptions, TEnv extends KernelEnvPatch = Record<string, string | null>>(params: ExecuteWithKernelBaseParams<TOptions, TEnv>): Promise<KernelExecutionResult>;
export {};
