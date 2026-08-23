import type { Component } from "@oh-my-pi/pi-tui";
import type { InteractiveModeContext } from "../../modes/types.js";
import type { ForeignSessionSource } from "../../session/foreign-session-store.js";
import type { SessionObserverRegistry } from "../session-observer-registry.js";
export declare class SelectorController {
    #private;
    private ctx;
    constructor(ctx: InteractiveModeContext);
    /**
     * Restore keyboard focus to whatever currently owns the editor slot. The
     * slot can hold the editor itself or a hook selector/input/editor pushed
     * in by `ExtensionUiController` — e.g. an approval prompt that fired while
     * a fullscreen overlay was up. `overlayHandle.hide()` restores focus to
     * the component focused when the overlay opened, which is stale in that
     * case (the editor was swapped out): keys land on a hidden editor and the
     * visible prompt receives nothing (issue #3349). Call this after the
     * overlay hides to re-target focus at the visible slot owner.
     */
    focusActiveEditorArea(): void;
    /**
     * Shows a selector component in place of the editor.
     * @param create Factory that receives a `done` callback and returns the component and focus target
     */
    showSelector(create: (done: () => void) => {
        component: Component;
        focus: Component;
    }): void;
    showSettingsSelector(): void;
    showAdvisorConfigure(): void;
    showHistorySearch(): void;
    /**
     * Show the Extension Control Center dashboard.
     * Replaces /status with a unified view of all providers and extensions.
     */
    showExtensionsDashboard(): Promise<void>;
    /**
     * Fullscreen agents hub on the alternate screen (the /models idiom): scope
     * sidebar, agent rows, and chip strips that dive into the model browser.
     */
    showAgentsDashboard(): Promise<void>;
    /**
     * Handle setting changes from the settings selector.
     * Most settings are saved directly via SettingsManager in the definitions.
     * This handles side effects and session-specific settings.
     */
    handleSettingChange(id: string, value: unknown): void;
    showModelSelector(options?: {
        temporaryOnly?: boolean;
    }): void;
    showPluginSelector(mode?: "install" | "uninstall"): Promise<void>;
    showUserMessageSelector(): void;
    showCopySelector(): void;
    showTreeSelector(): void;
    showSessionSelector(source?: ForeignSessionSource): Promise<void>;
    handleResumeSession(sessionPath: string, options?: {
        settingsFlushed?: boolean;
    }): Promise<boolean>;
    handleSessionDeleteCommand(): Promise<void>;
    showOAuthSelector(mode: "login" | "logout", providerId?: string): Promise<void>;
    showSessionPinSelector(): Promise<void>;
    showResetUsageSelector(): Promise<void>;
    showDebugSelector(): Promise<void>;
    showAgentHub(observers: SessionObserverRegistry, options?: {
        requireContent?: boolean;
        armCloseTap?: boolean;
    }): void;
}
