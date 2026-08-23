import type { Transport } from "./worker-protocol.js";
export type RejectionInterceptor = (handler: (reason: unknown) => boolean) => () => void;
export type WorkerCoreOptions = {
    mode: "isolated";
    /**
     * Mirror the session cwd onto the real process cwd so cell code using
     * `process.cwd()`, relative paths, or child processes without an explicit
     * `cwd` resolves against the project. Only the dedicated subprocess may
     * pass this: `process.chdir` is unavailable in Worker threads and would
     * mutate the host's own cwd on the inline fallback.
     */
    chdir?: (cwd: string) => void;
    /** Share the subprocess host's fatal-rejection guard when one is installed. */
    interceptUnhandledRejections?: RejectionInterceptor;
} | {
    mode: "inline";
    interceptUnhandledRejections: RejectionInterceptor;
};
export declare class WorkerCore {
    #private;
    constructor(transport: Transport, options: WorkerCoreOptions);
    dispose(): void;
}
