type ClaimedInput = {
    promise: Promise<string>;
    clear: (reason?: string) => void;
};
export declare class OAuthManualInputManager {
    #private;
    waitForInput(providerId: string): Promise<string>;
    tryWaitForInput(providerId: string): Promise<string> | undefined;
    tryClaimInput(providerId: string): ClaimedInput | undefined;
    submit(input: string): boolean;
    clear(reason?: string): void;
    hasPending(): boolean;
    get pendingProviderId(): string | undefined;
}
export {};
