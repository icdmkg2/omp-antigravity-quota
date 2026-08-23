import type { ToolSession } from "../../tools/index.js";
import { type PyToolBridgeInfo } from "../py/tool-bridge.js";
import type { EvalDisplayOutput, EvalStatusEvent } from "../types.js";
import { JuliaKernel, type KernelExecuteOptions, type KernelExecuteResult } from "./kernel.js";
export interface JuliaExecutorOptions {
    cwd?: string;
    sessionId?: string;
    sessionFile?: string;
    artifactsDir?: string;
    localRoots?: Record<string, string>;
    interpreter?: string;
    onChunk?: (text: string) => void | Promise<void>;
    onStatus?: (event: EvalStatusEvent) => void;
    signal?: AbortSignal;
    timeoutMs?: number;
    deadlineMs?: number;
    idleTimeoutMs?: number;
    kernelOwnerId?: string;
    reset?: boolean;
    toolSession?: ToolSession;
    bridge?: PyToolBridgeInfo;
    bridgeSessionId?: string;
    artifactId?: string;
}
export interface JuliaKernelExecutor {
    execute: (code: string, options?: KernelExecuteOptions) => Promise<KernelExecuteResult>;
}
export interface JuliaResult {
    output: string;
    exitCode: number | undefined;
    cancelled: boolean;
    truncated: boolean;
    artifactId: string | undefined;
    totalLines: number;
    totalBytes: number;
    outputLines: number;
    outputBytes: number;
    displayOutputs: EvalDisplayOutput[];
    stdinRequested: boolean;
}
export declare function disposeAllJuliaKernelSessions(): Promise<void>;
export declare function disposeJuliaKernelSessionsByOwner(ownerId: string): Promise<void>;
export declare function executeJuliaWithKernel(kernel: JuliaKernel, code: string, options?: JuliaExecutorOptions): Promise<JuliaResult>;
export declare function executeJulia(code: string, options?: JuliaExecutorOptions): Promise<JuliaResult>;
