import { type Component, type ResizeScrollbackMode, type Terminal, type TerminalFramePlan, type TerminalFrameProvider, TUI, type TUIOptions, type ViewportSize } from "@oh-my-pi/pi-tui";
import { CustomEditor } from "./components/custom-editor.js";
import { type LspServerInfo, type RecentSession, WelcomeComponent } from "./components/welcome.js";
/** Live settings that affect the composer before and after session adoption. */
export interface ComposerPreferences {
    readonly quiet: boolean;
    readonly composerShape: string;
    readonly showHardwareCursor: boolean;
    readonly maxInlineImages: number;
    readonly resizeScrollback: ResizeScrollbackMode;
    readonly imeSafeCursor: boolean;
    readonly autocompleteMaxVisible: number;
    readonly spellingTypoDetection: boolean;
    readonly spellingAutocomplete: boolean;
    readonly spellingAutocorrect: boolean;
}
/** Settings-schema-compatible defaults used when constructing a dependency-free composer. */
export declare const COMPOSER_DEFAULTS: ComposerPreferences;
/** Welcome data that can be supplied initially or patched as startup resolves it. */
export interface ComposerWelcomeUpdate {
    readonly version?: string;
    readonly modelName?: string;
    readonly providerName?: string;
    readonly recentSessions?: readonly RecentSession[];
    readonly lspServers?: readonly LspServerInfo[];
}
/** Optional dependencies and initial state for a standalone composer. */
export interface ComposerOptions {
    readonly terminal?: Terminal;
    /** Extra TUI construction options (render scheduler injection for tests and `omp render`). */
    readonly tuiOptions?: TUIOptions;
    readonly preferences?: Partial<ComposerPreferences>;
    readonly welcome?: ComposerWelcomeUpdate;
    readonly exit?: (code: number) => void;
    readonly now?: () => number;
}
/** Controls the first terminal paint for a composer that does not already own the terminal. */
export interface ComposerStartOptions {
    readonly clearScrollback?: boolean;
    readonly playWelcomeIntro?: boolean;
    /**
     * Paint without owning stdin: the tty keeps cooked-mode echo/editing so
     * typing stays visible while startup module loading blocks the event loop.
     * {@link Composer.enableInput} later switches to raw input and replays the
     * kernel-buffered keystrokes into the editor.
     */
    readonly deferInput?: boolean;
}
/**
 * Canonical interactive composer, usable before session/settings exist and updatable in place.
 * It owns the terminal, welcome header, and editor; InteractiveMode later supplies authoritative
 * data and mounts the session-aware runtime children without replacing the visible header.
 */
export declare class Composer implements TerminalFrameProvider {
    #private;
    /** Terminal renderer shared with InteractiveMode after adoption. */
    readonly ui: TUI;
    constructor(options?: ComposerOptions);
    /** Compose the bounded mutable viewport and the next ordered history append. */
    renderFrame(viewport: ViewportSize): TerminalFramePlan;
    /** Retire an accepted terminal history batch (header, then transcript prefixes). */
    acknowledgeHistory(id: number): void;
    /** Render the semantic transcript tail while the terminal borrows its resize buffer. */
    renderResizeFrame(viewport: ViewportSize): readonly string[];
    /** Re-offer the complete finalized prefix after a display reset or resize replay. */
    resetHistory(): void;
    /** Live editor whose draft survives startup and session adoption. */
    get editor(): CustomEditor;
    /** The welcome component currently mounted in the header, if quiet mode is off. */
    get welcome(): WelcomeComponent | undefined;
    /** Whether this composer already owns the terminal render/input loop. */
    get started(): boolean;
    /** Start terminal ownership and optionally begin the welcome intro. */
    start(options?: ComposerStartOptions): void;
    /** Take raw-input ownership after a deferred-input start. Idempotent. */
    enableInput(): void;
    /** Apply settings changes without replacing the editor or welcome component. */
    setPreferences(update: Partial<ComposerPreferences>): void;
    /** Patch welcome data in place as model, session, and project discovery complete. */
    updateWelcome(update: ComposerWelcomeUpdate): void;
    /** Replace optional header content around the stable welcome scene. */
    setHeaderExtras(before: readonly Component[], after: readonly Component[]): void;
    /** Update the canonical editor reference after InteractiveMode remounts a custom editor. */
    setEditor(editor: CustomEditor): void;
    /** Mount the session-aware status component into the slot below the editor. */
    setStatusComponent(component: Component): void;
    /** Mount or replace session-aware root children while preserving the header and status hosts. */
    setRuntimeChildren(children: readonly Component[]): void;
    /** Play or replay the welcome intro against the stable header render target. */
    playWelcomeIntro(): void;
    /** Transfer terminal ownership to InteractiveMode without stopping the composer. */
    transfer(): void;
    /** Stop a composer that has not transferred terminal ownership. */
    stop(): void;
}
