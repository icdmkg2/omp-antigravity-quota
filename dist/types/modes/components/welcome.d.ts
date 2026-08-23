import { type Component } from "@oh-my-pi/pi-tui";
/**
 * Fixed number of session rows in the welcome box so its height stays stable
 * across recent-session updates.
 */
export declare const WELCOME_SESSION_SLOTS = 4;
/**
 * Fixed number of LSP-server rows, for the same reason. Overflow is sliced so
 * the box height is constant regardless of how many servers a project has.
 */
export declare const WELCOME_LSP_SLOTS = 4;
/** Pick a tip from `tips`, biased toward "[NEW]" tips by {@link NEW_TIP_WEIGHT};
 *  `r` is a uniform sample in [0, 1). Returns "" when `tips` is empty.
 *  Exported for tests. */
export declare function pickWeightedTip(tips: readonly string[], r: number): string;
export declare function renderWelcomeTip(tip: string, boxWidth: number, phase?: number): string[];
export interface RecentSession {
    name: string;
    timeAgo: string;
}
export interface LspServerInfo {
    name: string;
    status: "ready" | "error" | "connecting" | "available";
    fileTypes: string[];
}
/**
 * Premium welcome screen with block-based OMP logo and two-column layout.
 */
export declare class WelcomeComponent implements Component {
    #private;
    private version;
    private modelName;
    private providerName;
    private recentSessions;
    private lspServers;
    constructor(version: string, modelName: string, providerName: string, recentSessions?: RecentSession[], lspServers?: LspServerInfo[]);
    get tip(): string | undefined;
    invalidate(): void;
    /** The intro keeps the welcome block mutable; settling lets it retire to history. */
    isTranscriptBlockFinalized(): boolean;
    /**
     * Play a one-shot intro that sweeps the gradient through every phase
     * before settling on the resting frame. Safe to call multiple times —
     * subsequent calls reset and replay.
     */
    playIntro(requestRender: () => void): void;
    /**
     * Redirect a running intro's render callback to a new target when a host
     * remounts this component mid-animation.
     * Returns true while the intro is still animating; false = no-op (settled).
     */
    retargetIntro(requestRender: () => void): boolean;
    /** Stop the intro immediately and settle on the resting frame. Safe when idle. */
    stopIntro(): void;
    /** Update the version embedded in the welcome border title. */
    setVersion(version: string): void;
    setModel(modelName: string, providerName: string): void;
    setRecentSessions(sessions: RecentSession[]): void;
    setLspServers(servers: LspServerInfo[]): void;
    render(termWidth: number): readonly string[];
}
export declare const PI_LOGO: string[];
export interface ShineConfig {
    /** Overall opacity of the shine overlay, in [0, 1]. */
    strength: number;
    /** Center of the shine band along the diagonal, in [0, 1]. */
    pos: number;
}
/**
 * Resolve the gradient SGR foreground escape for a normalized position `t`
 * (0..1) along the diagonal, compositing the optional sliding shine highlight.
 * Shared by {@link gradientLogo} and the setup splash so both stay
 * color-identical (truecolor when available, 256-color ramp otherwise).
 */
export declare function gradientEscape(t: number, shine?: ShineConfig): string;
/**
 * Apply a multi-stop diagonal gradient (bottom-left → top-right) plus an
 * optional sliding shine band across multi-line art. `phase` (0..1) shifts the
 * gradient along the diagonal, wrapping at 1. When `shine` is provided, a soft
 * white highlight is composited on top, centered at `shine.pos`.
 */
export declare function gradientLogo(lines: readonly string[], phase?: number, shine?: ShineConfig): string[];
