import { Container } from "@oh-my-pi/pi-tui";
/** One file's worth of late LSP diagnostics, as carried on the transcript message. */
export interface LateDiagnosticsFile {
    path?: string;
    summary?: string;
    errored?: boolean;
    messages?: string[];
}
/**
 * Renders late LSP diagnostics (arrived after edit/write returned) in the
 * transcript, reusing the same tree renderer the edit/write tools use so the
 * styling stays consistent. Supports the global tool-output expand toggle.
 */
export declare class LateDiagnosticsMessageComponent extends Container {
    #private;
    private readonly files;
    constructor(files: LateDiagnosticsFile[]);
    setExpanded(expanded: boolean): void;
    setToolActivityVisible(visible: boolean): void;
    render(width: number): readonly string[];
    invalidate(): void;
}
