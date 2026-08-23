/**
 * Compact session-model picker (alt+p / `/switch`): a bottom-anchored
 * floating overlay hosting just a {@link ModelBrowser} — no provider sidebar.
 * Model entries switch the current session only; a search beginning with `@`
 * exposes the configured ctrl+p quick roles.
 */
import type { Model } from "@oh-my-pi/pi-ai";
import type { Component, TUI } from "@oh-my-pi/pi-tui";
import type { ModelRegistry } from "../../config/model-registry.js";
import type { Settings } from "../../config/settings.js";
import type { ResolvedRoleModel } from "../../session/agent-session.js";
import type { ScopedModelItem } from "./model-hub.js";
export interface ModelPickerCallbacks {
    /**
     * A model was chosen for a session-only switch. `selector` is `provider/id`.
     * `overContext` is true when the session transcript exceeds the model's
     * context window — the host must compact before switching.
     */
    onPick: (model: Model, selector: string, meta: {
        overContext: boolean;
    }) => void;
    /** A configured ctrl+p quick role was chosen. */
    onPickRole?: (entry: ResolvedRoleModel) => void;
    /** The picker was dismissed. */
    onCancel: () => void;
}
export interface ModelPickerOptions {
    /** Session token count; models with smaller context windows are grayed and compact-first on pick. */
    currentContextTokens?: number;
    /** `provider/id` of the session's active model; highlighted and preselected. */
    currentSelector?: string;
    /** Resolved role models in the same order used by the ctrl+p quick-role cycle. */
    quickRoles?: ReadonlyArray<ResolvedRoleModel>;
    /** Complete ctrl+p order, including unavailable roles, to preserve segment colors. */
    quickRoleOrder?: ReadonlyArray<string>;
    /** Active quick role, highlighted when the search begins with `@`. */
    currentQuickRole?: string;
}
/**
 * The alt+p picker component. Hosted as a non-fullscreen bottom-anchored
 * overlay (`ui.showOverlay(..., { anchor: "bottom-center" })`); keyboard-only,
 * since mouse tracking is reserved for fullscreen overlays.
 */
export declare class ModelPickerComponent implements Component {
    #private;
    constructor(tui: TUI, settings: Settings, registry: ModelRegistry, scopedModels: ReadonlyArray<ScopedModelItem>, callbacks: ModelPickerCallbacks, options?: ModelPickerOptions);
    invalidate(): void;
    handleInput(data: string): void;
    render(width: number): string[];
}
