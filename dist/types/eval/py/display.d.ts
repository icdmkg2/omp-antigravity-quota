/** Status event emitted by prelude helpers for TUI rendering. */
export interface PythonStatusEvent {
    /** Operation name (e.g., "find", "read", "write") */
    op: string;
    /** Additional data fields (count, path, pattern, etc.) */
    [key: string]: unknown;
}
export type KernelDisplayOutput = {
    type: "json";
    data: unknown;
} | {
    type: "image";
    data: string;
    mimeType: string;
} | {
    type: "markdown";
} | {
    type: "status";
    event: PythonStatusEvent;
};
/** Render a MIME bundle into text + structured outputs. */
export declare function renderKernelDisplay(content: Record<string, unknown>): Promise<{
    text: string;
    outputs: KernelDisplayOutput[];
}>;
