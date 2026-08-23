type CmuxErrorPayload = {
    code?: unknown;
    message?: unknown;
    details?: unknown;
};
export declare function formatCmuxError(error: CmuxErrorPayload | undefined): string;
export declare class CmuxSocketClient {
    #private;
    constructor(opts: {
        socketPath: string;
        password?: string;
        relayId?: string;
        relayToken?: string;
    });
    connect(): Promise<void>;
    request(method: string, params: Record<string, unknown>, opts?: {
        timeoutMs?: number;
    }): Promise<Record<string, unknown>>;
    close(): void;
}
export {};
