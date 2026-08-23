import { type Component } from "@oh-my-pi/pi-tui";
import type { DebugLogSource } from "./report-bundle.js";
export declare const SESSION_BOUNDARY_WARNING = "### WARNING - Logs above are older than current session!";
export declare const LOAD_OLDER_LABEL = "### MOVE UP TO LOAD MORE...";
type DebugLogViewerModelOptions = {
    processStartMs?: number;
    processPid?: number;
    hasOlderLogs?: () => boolean;
    loadOlderLogs?: (limitDays?: number) => Promise<string>;
};
type ViewerRow = {
    kind: "warning";
} | {
    kind: "load-older";
} | {
    kind: "log";
    logIndex: number;
};
export declare function splitLogText(logText: string): string[];
export declare function buildLogCopyPayload(lines: string[]): string;
export declare class DebugLogViewerModel {
    #private;
    constructor(logText: string, options?: DebugLogViewerModelOptions);
    get logCount(): number;
    get visibleLogCount(): number;
    get rows(): readonly ViewerRow[];
    get cursorRowIndex(): number | undefined;
    get cursorLogIndex(): number | undefined;
    get filterQuery(): string;
    get cursorRowKind(): ViewerRow["kind"] | undefined;
    get expandedCount(): number;
    isProcessFilterEnabled(): boolean;
    isCursorAtFirstSelectableRow(): boolean;
    getRawLine(logIndex: number): string;
    setFilterQuery(query: string): void;
    toggleProcessFilter(): void;
    moveCursor(delta: number, extendSelection: boolean): void;
    moveCursorToRow(rowIndex: number, extendSelection: boolean): boolean;
    getSelectedLogIndices(): number[];
    getSelectedCount(): number;
    isSelected(logIndex: number): boolean;
    isExpanded(logIndex: number): boolean;
    expandSelected(): void;
    collapseSelected(): void;
    getSelectedRawLines(): string[];
    selectAllVisible(): void;
    canLoadOlder(): boolean;
    loadOlder(additionalCount?: number): Promise<boolean>;
    prependLogs(logText: string): number;
}
interface DebugLogViewerComponentOptions {
    logs: string;
    terminalRows: number;
    onExit: () => void;
    onStatus?: (message: string) => void;
    onError?: (message: string) => void;
    processStartMs?: number;
    processPid?: number;
    logSource?: DebugLogSource;
    onUpdate?: () => void;
}
export declare class DebugLogViewerComponent implements Component {
    #private;
    constructor(options: DebugLogViewerComponentOptions);
    handleInput(keyData: string): void;
    invalidate(): void;
    render(width: number): readonly string[];
}
export {};
