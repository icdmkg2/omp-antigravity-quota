import type { InteractiveModeContext } from "../types.js";
export interface RunStartupSplashOptions {
    readonly durationMs?: number;
    readonly tickMs?: number;
    readonly now?: () => number;
}
export declare function runStartupSplash(ctx: InteractiveModeContext, options?: RunStartupSplashOptions): Promise<void>;
