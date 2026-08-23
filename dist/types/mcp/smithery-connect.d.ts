export declare class SmitheryConnectError extends Error {
    status: number;
    constructor(message: string, status: number);
}
type SmitheryNamespace = {
    name: string;
};
type SmitheryConnectionStatus = {
    state: "connected";
} | {
    state: "auth_required";
    authorizationUrl?: string;
} | {
    state: "error";
    message: string;
} | {
    state: string;
    [key: string]: unknown;
};
export type SmitheryConnection = {
    connectionId: string;
    mcpUrl: string;
    name: string;
    status?: SmitheryConnectionStatus;
    createdAt?: string;
};
export declare function getSmitheryApiBaseUrl(): string;
export declare function listSmitheryNamespaces(apiKey: string): Promise<SmitheryNamespace[]>;
export declare function createSmitheryNamespace(apiKey: string): Promise<SmitheryNamespace>;
export declare function resolveSmitheryNamespace(apiKey: string): Promise<string>;
export declare function listSmitheryConnectionsByUrl(apiKey: string, namespace: string, mcpUrl: string): Promise<SmitheryConnection[]>;
export declare function createSmitheryConnection(apiKey: string, namespace: string, params: {
    mcpUrl: string;
    name?: string;
}): Promise<SmitheryConnection>;
export declare function getSmitheryConnection(apiKey: string, namespace: string, connectionId: string): Promise<SmitheryConnection>;
export declare function deleteSmitheryConnection(apiKey: string, namespace: string, connectionId: string): Promise<void>;
export {};
