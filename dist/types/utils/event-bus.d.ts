export declare class EventBus {
    #private;
    emit(channel: string, data: unknown): void;
    on(channel: string, handler: (data: unknown) => void): () => void;
    clear(): void;
}
