type SmitheryCliAuthSession = {
    sessionId: string;
    authUrl: string;
};
export type SmitheryCliPollResponse = {
    status: "pending" | "success" | "error";
    apiKey?: string;
    message?: string;
};
export declare function getSmitheryLoginUrl(): string;
export declare function createSmitheryCliAuthSession(): Promise<SmitheryCliAuthSession>;
export declare function pollSmitheryCliAuthSession(sessionId: string, signal?: AbortSignal): Promise<SmitheryCliPollResponse>;
export declare function getSmitheryApiKey(): Promise<string | undefined>;
export declare function saveSmitheryApiKey(apiKey: string): Promise<void>;
export declare function clearSmitheryApiKey(): Promise<boolean>;
export {};
