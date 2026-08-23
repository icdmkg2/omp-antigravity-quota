import type { Model } from "@oh-my-pi/pi-ai";
import { type Component, type TUI } from "@oh-my-pi/pi-tui";
import type { ModelRegistry } from "../../config/model-registry.js";
import type { Settings } from "../../config/settings.js";
import { type ConfiguredThinkingLevel } from "../../thinking.js";
/** A `--models` scope entry (mirrors the session's scoped model list). */
export interface ScopedModelItem {
    model: Model;
    thinkingLevel?: string;
}
export type ModelRoleSelectionScope = "global" | "project";
export interface ModelHubCallbacks {
    /** Persist a role assignment. */
    onAssign: (model: Model, role: string, thinkingLevel: ConfiguredThinkingLevel | undefined, selector: string, scope?: ModelRoleSelectionScope) => void;
    /** Clear a configured role back to auto-selection. */
    onUnassign: (role: string, scope?: ModelRoleSelectionScope) => void;
    /** Persist a `retry.fallbackChains` entry — keyed by a role, `provider/model-id`, or `provider/*`; an empty chain clears the key. */
    onFallbackChainChange?: (role: string, chain: string[]) => void;
    /** Locked provider activation: forward to the /login flow. */
    onLoginRequest?: (providerId: string) => void;
    /** Persist a new quick-switch cycle order (the ctrl+p role cycle). */
    onCycleOrderChange?: (order: string[]) => void;
    onCancel: () => void;
}
export interface ModelHubOptions {
    /** Preselect this provider's sidebar entry (e.g. when reopening after /login). */
    initialProviderId?: string;
}
/** Test hook: forget which providers were auto-refreshed this process. */
export declare function resetProviderAutoRefreshGuard(): void;
/**
 * The fullscreen model hub component. Hosted via `ui.showOverlay(..., { fullscreen: true })`;
 * the host must call {@link ModelHubComponent.dispose} when the overlay closes.
 */
export declare class ModelHubComponent implements Component {
    #private;
    constructor(tui: TUI, settings: Settings, registry: ModelRegistry, scopedModels: ReadonlyArray<ScopedModelItem>, callbacks: ModelHubCallbacks, options?: ModelHubOptions);
    /** Cancel pending provider refresh timers and the spinner. Host calls this on overlay close. */
    dispose(): void;
    invalidate(): void;
    /** Re-sync after an asynchronous callback finishes mutating settings. */
    refreshAfterExternalMutation(): void;
    handleInput(data: string): void;
    render(width: number): string[];
}
