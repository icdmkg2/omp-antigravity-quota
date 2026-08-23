/**
 * Fullscreen `/advisor configure` overlay: a mouse- and keyboard-driven editor
 * for the `WATCHDOG.yml` advisor roster at project or user level.
 *
 * It paints the entire alternate screen from row 0 (so SGR mouse rows index
 * directly into the rendered frame) using the shared {@link ./overlay-box} chrome.
 * The list screen is a two-pane split (the `/extensions` idiom): a clickable
 * advisor/action sidebar on the left, and a scrollable preview of the highlighted
 * advisor's model / tools / instructions on the right, filling the free space.
 *
 * Each screen is backed by a proven primitive — {@link SelectList} (list / detail
 * / tools / thinking), {@link Input} (name), {@link ModelSelectorComponent} (the
 * same rich `/model` picker, in direct-select mode), and {@link HookEditorComponent}
 * (multiline instructions; Ctrl+G opens `$EDITOR`). The overlay edits an in-memory
 * {@link WatchdogConfigDoc} and only touches disk + the live advisors via the host
 * `save` callback.
 */
import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Model, UsageReport } from "@oh-my-pi/pi-ai";
import { type Component, type TUI } from "@oh-my-pi/pi-tui";
import { type AdvisorConfigScope, type WatchdogConfigDoc } from "../../advisor/index.js";
import type { ModelRegistry } from "../../config/model-registry.js";
import type { Settings } from "../../config/settings.js";
import type { PerAdvisorStat } from "../../session/agent-session.js";
import type { OAuthAccountIdentity } from "../../session/auth-storage.js";
/** Host callbacks: all disk + live-runtime effects flow through these. */
export interface AdvisorConfigCallbacks {
    /** Load a scope's `WATCHDOG.yml` into an editable doc (empty when absent). */
    loadDoc: (scope: AdvisorConfigScope) => Promise<WatchdogConfigDoc>;
    /** Persist the doc to the scope's file and rebuild the live advisors. */
    save: (scope: AdvisorConfigScope, doc: WatchdogConfigDoc) => Promise<void>;
    /** Tear down the overlay and restore the editor. */
    close: () => void;
    requestRender: () => void;
    /** Surface a transient status/warning line to the user. */
    notify: (message: string) => void;
    /** Live advisor usage stats; lets the preview show tokens/cost per advisor. */
    getAdvisorStats?: () => PerAdvisorStat[];
    getUsageReports?: () => Promise<UsageReport[] | null>;
    /** Resolve the active OAuth identity for quota filtering (per-advisor account stickiness). */
    resolveActiveAccount?: (provider: string, sessionId?: string) => OAuthAccountIdentity | undefined;
}
export interface AdvisorConfigDeps {
    modelRegistry: ModelRegistry;
    settings: Settings;
    scopedModels: ReadonlyArray<{
        model: Model;
        thinkingLevel?: ThinkingLevel;
    }>;
    availableToolNames: string[];
    /** Formatted advisor-role model shown on the seeded default row (e.g. "anthropic/claude-..."). */
    defaultModelLabel?: string;
}
/**
 * Fullscreen advisor-configuration overlay. Implements {@link Component} directly
 * (rather than extending Container) so it owns the whole frame and the mouse
 * geometry needed to make every row clickable.
 */
export declare class AdvisorConfigOverlayComponent implements Component {
    #private;
    constructor(tui: TUI, deps: AdvisorConfigDeps, scope: AdvisorConfigScope, doc: WatchdogConfigDoc, callbacks: AdvisorConfigCallbacks);
    render(width: number): readonly string[];
    handleInput(data: string): void;
    /** Forward enhanced-paste transports into a multiline instructions editor. */
    pasteText(text: string): void;
}
