import type { ToolSession } from "../../tools/index.js";
import type { JsStatusEvent } from "../js/shared/types.js";
import { type KernelDisplayOutput, type KernelExecuteOptions, type KernelExecuteResult } from "./kernel.js";
export interface RubyExecutorOptions {
    /** Working directory for command execution */
    cwd?: string;
    /** Timeout in milliseconds */
    timeoutMs?: number;
    /** Absolute wall-clock deadline in milliseconds since epoch */
    deadlineMs?: number;
    /**
     * Runtime-work budget (ms). Used only for timeout-annotation text when the
     * caller drives cancellation via the eval watchdog `signal`. Does not arm a timer.
     */
    idleTimeoutMs?: number;
    /** Callback for streaming output chunks (already sanitized) */
    onChunk?: (chunk: string) => Promise<void> | void;
    /** AbortSignal for cancellation */
    signal?: AbortSignal;
    /** Session identifier for kernel reuse */
    sessionId?: string;
    /** Logical owner identifier for retained kernel cleanup */
    kernelOwnerId?: string;
    /** Explicit interpreter path (`ruby.interpreter`). Skips discovery when set. */
    interpreter?: string;
    /** Restart the kernel before executing */
    reset?: boolean;
    /** Session file path for accessing task outputs */
    sessionFile?: string;
    /** Effective artifacts directory for the current session. */
    artifactsDir?: string;
    /** Artifact path/id for full output storage */
    artifactPath?: string;
    artifactId?: string;
    /**
     * On-disk roots the prelude helpers substitute for internal-URL schemes
     * (e.g. `{ local: "/…/artifacts/local" }`). Exported to the kernel as
     * `PI_EVAL_LOCAL_ROOTS` (JSON).
     */
    localRoots?: Record<string, string>;
    /**
     * ToolSession used to resolve host-side `tool.<name>(args)` calls. When
     * omitted, the bridge env vars are not injected and `tool.foo(...)` raises.
     */
    toolSession?: ToolSession;
    /** Callback for status events emitted by tool bridge invocations. */
    emitStatus?: (event: JsStatusEvent) => void;
    /** Live status events streamed as they are emitted. */
    onStatus?: (event: JsStatusEvent) => void;
    /** @internal Bridge session id, set by `executeRuby` before delegating. */
    bridgeSessionId?: string;
    /** @internal Bridge endpoint info, set by `executeRuby` before delegating. */
    bridge?: {
        url: string;
        token: string;
    };
}
export interface RubyKernelExecutor {
    execute: (code: string, options?: KernelExecuteOptions) => Promise<KernelExecuteResult>;
}
export interface RubyResult {
    output: string;
    exitCode: number | undefined;
    cancelled: boolean;
    truncated: boolean;
    artifactId?: string;
    totalLines: number;
    totalBytes: number;
    outputLines: number;
    outputBytes: number;
    displayOutputs: KernelDisplayOutput[];
    stdinRequested: boolean;
}
export declare function disposeAllRubyKernelSessions(): Promise<void>;
export declare function disposeRubyKernelSessionsByOwner(ownerId: string): Promise<void>;
export declare function executeRubyWithKernel(kernel: RubyKernelExecutor, code: string, options?: RubyExecutorOptions): Promise<RubyResult>;
export declare function executeRuby(code: string, options?: RubyExecutorOptions): Promise<RubyResult>;
