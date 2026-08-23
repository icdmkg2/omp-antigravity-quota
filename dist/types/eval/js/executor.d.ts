import type { ToolSession } from "../../tools/index.js";
import { type JsDisplayOutput } from "./context-manager.js";
import type { JsStatusEvent } from "./shared/types.js";
export interface JsExecutorOptions {
    cwd?: string;
    timeoutMs?: number;
    deadlineMs?: number;
    /**
     * Runtime-work budget (ms). Used for worker cold-start headroom and
     * timeout-annotation text when the caller drives cancellation via the eval
     * watchdog `signal` instead of `deadlineMs`/`timeoutMs`. Never arms a timer.
     */
    idleTimeoutMs?: number;
    onChunk?: (chunk: string) => Promise<void> | void;
    onStatus?: (event: JsStatusEvent) => void;
    signal?: AbortSignal;
    sessionId: string;
    /** Logical owner identifier; scopes `reset` on shared contexts and retained-worker cleanup. */
    kernelOwnerId?: string;
    reset?: boolean;
    sessionFile?: string;
    artifactPath?: string;
    artifactId?: string;
    session: ToolSession;
    /** On-disk roots the helpers substitute for internal-URL schemes (e.g. `local://`). */
    localRoots?: Record<string, string>;
}
export interface JsResult {
    output: string;
    exitCode: number | undefined;
    cancelled: boolean;
    truncated: boolean;
    artifactId?: string;
    totalLines: number;
    totalBytes: number;
    outputLines: number;
    outputBytes: number;
    displayOutputs: JsDisplayOutput[];
}
export declare function executeJs(code: string, options: JsExecutorOptions): Promise<JsResult>;
