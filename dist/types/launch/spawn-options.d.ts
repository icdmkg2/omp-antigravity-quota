/** Platform-specific options for the launch broker and its non-PTY children. */
export interface DaemonSpawnOptions {
    detached: boolean;
    windowsHide?: boolean;
}
/** Keep launch processes headless without discarding an inheritable Windows console. */
export declare function resolveDaemonSpawnOptions(opts: {
    platform: NodeJS.Platform;
    hostHasInheritableConsole: boolean;
}): DaemonSpawnOptions;
