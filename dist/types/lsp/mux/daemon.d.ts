import type { LspTransport } from "../types.js";
/**
 * Open a broker-shared transport for one language server, ensuring the mux
 * daemon first. Returns null (after a debug log) when the shared path is
 * unavailable so the caller falls back to a process-local spawn.
 */
export declare function connectSharedLspTransport(opts: {
    command: string;
    args: string[];
    cwd: string;
    env?: Record<string, string>;
    signal?: AbortSignal;
}): Promise<LspTransport | null>;
/** Exercise worker-host mux startup and the ping handshake for distribution smoke tests. */
export declare function smokeTestLspMux(): Promise<void>;
