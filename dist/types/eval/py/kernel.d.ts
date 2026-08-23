import { BaseKernel, type KernelStartOptions } from "../kernel-base.js";
import { type PythonRuntime } from "./runtime.js";
export type { KernelExecuteOptions, KernelExecuteResult, KernelRuntimeEnv, KernelShutdownOptions, KernelShutdownResult, } from "../kernel-base.js";
export type { KernelDisplayOutput, PythonStatusEvent } from "./display.js";
export { renderKernelDisplay } from "./display.js";
export interface PythonKernelAvailability {
    ok: boolean;
    pythonPath?: string;
    reason?: string;
    /** The probed-working runtime, when one was found. */
    runtime?: PythonRuntime;
}
export declare function checkPythonKernelAvailability(cwd: string, interpreter?: string, options?: {
    forceProbe?: boolean;
}): Promise<PythonKernelAvailability>;
export declare class PythonKernel extends BaseKernel {
    private constructor();
    static start(options: KernelStartOptions): Promise<PythonKernel>;
}
