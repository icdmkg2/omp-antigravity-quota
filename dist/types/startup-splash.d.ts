/** Inputs used to decide whether the optional startup splash may run for this process. */
export interface StartupSplashDecisionOptions {
    readonly configured: boolean;
    readonly isInteractive: boolean;
    readonly resuming: boolean;
    readonly quiet: boolean;
    readonly timing: boolean;
    readonly stdinIsTTY: boolean | undefined;
    readonly stdoutIsTTY: boolean | undefined;
}
/** Returns true only for explicitly enabled, normal interactive TTY startup. */
export declare function shouldShowStartupSplash(options: StartupSplashDecisionOptions): boolean;
