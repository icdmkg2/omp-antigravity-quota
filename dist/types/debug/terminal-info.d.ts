/** Live values the debug view reads off the running TUI, not the static capability table. */
export interface TerminalRuntimeState {
    columns: number;
    rows: number;
    /** Whether DEC 2026 synchronized-output wrappers are currently emitted. */
    synchronizedOutput: boolean;
}
export interface TerminalStateInfo {
    detectedId: string;
    columns: number;
    rows: number;
    cellWidthPx: number;
    cellHeightPx: number;
    trueColor: boolean;
    imageProtocol: string;
    notifyProtocol: string;
    osc99Confirmed: boolean;
    hyperlinks: boolean;
    deccara: boolean;
    screenToScrollback: boolean;
    synchronizedOutput: boolean;
    multiplexer: string | null;
    env: {
        TERM?: string;
        TERM_PROGRAM?: string;
        TERM_PROGRAM_VERSION?: string;
        COLORTERM?: string;
    };
}
/** Snapshot the active terminal capabilities and the live runtime geometry. */
export declare function collectTerminalState(runtime: TerminalRuntimeState): TerminalStateInfo;
/** Format terminal state for display in the debug menu. */
export declare function formatTerminalState(info: TerminalStateInfo): string;
