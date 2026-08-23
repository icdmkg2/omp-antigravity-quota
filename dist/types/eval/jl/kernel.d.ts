import { BaseKernel, type KernelStartOptions } from "../kernel-base.js";
import type { KernelDisplayOutput } from "../py/display.js";
import { type JuliaRuntime } from "./runtime.js";
export type { KernelExecuteResult, KernelRuntimeEnv } from "../kernel-base.js";
export { renderKernelDisplay } from "../py/display.js";
export type { KernelDisplayOutput };
export interface KernelExecuteOptions {
    id?: string;
    cwd?: string;
    env?: Record<string, string | undefined>;
    silent?: boolean;
    storeHistory?: boolean;
    timeoutMs?: number;
    signal?: AbortSignal;
    onChunk?: (text: string) => void | Promise<void>;
    onDisplay?: (output: KernelDisplayOutput) => void | Promise<void>;
}
export interface JuliaKernelAvailability {
    ok: boolean;
    juliaPath?: string;
    runtime?: JuliaRuntime;
    reason?: string;
}
export declare function checkJuliaKernelAvailability(cwd: string, interpreter?: string): Promise<JuliaKernelAvailability>;
export declare class JuliaKernel extends BaseKernel<KernelExecuteOptions> {
    private constructor();
    static start(options: KernelStartOptions): Promise<JuliaKernel>;
}
