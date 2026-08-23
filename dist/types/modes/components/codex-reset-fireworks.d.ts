import { type Component, type OverlayHandle, type OverlayOptions } from "@oh-my-pi/pi-tui";
/** The active Codex account fields retained between status refreshes. */
export interface CodexResetUsageSnapshot {
    /** When this usage report was observed, if supplied by the provider. */
    observedAt?: number;
    /** Weekly usage, its quota identity, and its previously scheduled reset deadline. */
    sevenDay?: {
        percent: number;
        resetsAt?: number;
        tier?: string;
        plan?: string;
    };
    savedResets?: number;
}
/** A detected Codex quota event that can trigger the fireworks presentation. */
export type CodexResetFireworksEvent = {
    kind: "unscheduled-weekly-reset";
} | {
    kind: "saved-reset-banked";
    added: number;
    available: number;
};
interface CodexResetFireworksHost {
    ui: {
        showOverlay(component: Component, options?: OverlayOptions): OverlayHandle;
        setFocus(component: Component): void;
        requestRender(): void;
        readonly terminal: {
            readonly rows: number;
        };
    };
}
/**
 * Compare consecutive reports for one Codex account. A saved-reset grant takes
 * precedence when both changes arrive in the same report. A verified decrease,
 * or a prior positive balance becoming unavailable, suppresses the weekly event
 * because the user may have redeemed a credit. Other weekly usage drops are
 * celebrated only when the provider advances the quota deadline before the
 * previously scheduled reset.
 */
export declare function detectCodexResetFireworks(previous: CodexResetUsageSnapshot, current: CodexResetUsageSnapshot): CodexResetFireworksEvent | undefined;
/** Owns the at-most-one modal celebration lifecycle for an interactive session. */
export declare class CodexResetFireworksController {
    #private;
    private readonly host;
    constructor(host: CodexResetFireworksHost);
    /** Present a celebration unless another one already owns the modal overlay. */
    show(event: CodexResetFireworksEvent): boolean;
    /** Stop the active celebration and release its overlay, if present. */
    dispose(): void;
}
export {};
