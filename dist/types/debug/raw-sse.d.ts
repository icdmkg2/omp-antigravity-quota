import { type Component } from "@oh-my-pi/pi-tui";
import { type RawSseDebugBuffer } from "./raw-sse-buffer.js";
/** @internal Exported for tests. */
export declare function expandPrettyDataLines(raw: readonly string[]): string[];
export interface RawSseViewerOptions {
    buffer: RawSseDebugBuffer;
    terminalRows: number;
    onExit: () => void;
    onStatus?: (message: string) => void;
    onUpdate?: () => void;
}
export declare class RawSseViewerComponent implements Component {
    #private;
    constructor(options: RawSseViewerOptions);
    dispose(): void;
    handleInput(keyData: string): void;
    invalidate(): void;
    render(width: number): readonly string[];
}
