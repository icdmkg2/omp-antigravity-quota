/**
 * Broker-owned, in-process-testable multiplexer for shared language-server children.
 */
export declare class LspMuxServer {
    #private;
    /** Called after the mux has had no connected sessions for its idle grace period. */
    onIdle?: () => void;
    /** Number of currently connected mux links, including unbound ping links. */
    get sessionCount(): number;
    /** Keys of currently live shared language-server children. */
    get serverKeys(): string[];
    /** Listen for Content-Length framed mux links at a Unix socket or named pipe. */
    listen(endpoint: string): Promise<void>;
    /** Gracefully close all children, links, and the listening endpoint. */
    shutdown(): Promise<void>;
}
/** Start the detached LSP mux selected by the CLI worker host environment. */
export declare function startLspMuxFromEnvironment(): Promise<void>;
