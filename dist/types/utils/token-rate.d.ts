type MaybeAssistantMessage = {
    role?: string;
    timestamp?: number;
    duration?: number;
    usage?: {
        output?: number;
    };
};
export declare function calculateTokensPerSecond(messages: ReadonlyArray<MaybeAssistantMessage>, isStreaming: boolean, nowMs?: number): number | null;
export {};
