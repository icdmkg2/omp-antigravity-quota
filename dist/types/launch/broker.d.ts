export interface DaemonBrokerStartOptions {
    /** Base of the exponential child-restart backoff. */
    restartBackoffBaseMs?: number;
}
/** Start the detached project or global daemon broker selected by the CLI worker host. */
export declare function startDaemonBrokerFromEnvironment(options?: DaemonBrokerStartOptions): Promise<void>;
