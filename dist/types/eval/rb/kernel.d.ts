import { BaseKernel, type KernelRuntimeEnv, type KernelStartOptions } from "../kernel-base.js";
import type { KernelDisplayOutput } from "../py/display.js";
import { type RubyRuntime } from "./runtime.js";
export type { KernelExecuteResult, KernelRuntimeEnv, KernelShutdownResult } from "../kernel-base.js";
export type { KernelDisplayOutput, PythonStatusEvent } from "../py/display.js";
export { renderKernelDisplay } from "../py/display.js";
export interface KernelExecuteOptions {
    id?: string;
    /** Runtime working directory applied immediately before this request executes. */
    cwd?: string;
    /** Managed runtime environment variables applied immediately before this request executes. */
    env?: KernelRuntimeEnv;
    signal?: AbortSignal;
    onChunk?: (text: string) => Promise<void> | void;
    onDisplay?: (output: KernelDisplayOutput) => Promise<void> | void;
    timeoutMs?: number;
    silent?: boolean;
    storeHistory?: boolean;
}
export interface RubyKernelAvailability {
    ok: boolean;
    rubyPath?: string;
    reason?: string;
    /** The probed-working runtime, when one was found. */
    runtime?: RubyRuntime;
}
export declare function checkRubyKernelAvailability(cwd: string, interpreter?: string): Promise<RubyKernelAvailability>;
export declare class RubyKernel extends BaseKernel<KernelExecuteOptions> {
    private constructor();
    static start(options: KernelStartOptions): Promise<RubyKernel>;
}
