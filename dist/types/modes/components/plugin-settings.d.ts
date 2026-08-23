/**
 * Plugin settings UI components.
 *
 * Provides a hierarchical settings interface:
 * - Plugin list (npm plugins + marketplace plugins)
 *   - Plugin details (enablement, manifest settings, and marketplace metadata)
 */
import { Container } from "@oh-my-pi/pi-tui";
import { PluginManager } from "../../extensibility/plugins/manager.js";
import { type InstalledPluginSummary } from "../../extensibility/plugins/marketplace/index.js";
import type { InstalledPlugin } from "../../extensibility/plugins/types.js";
import { OverlayPanel } from "./overlay-box.js";
/**
 * Forwards a keystroke to `input`, but cancels via `onCancel` when the user presses Escape.
 *
 * Escape is decoded via `matchesKey` rather than a raw `\x1b` compare: inside the
 * fullscreen settings overlay the kitty keyboard protocol is active (ghostty/kitty),
 * where the Escape key arrives as the CSI-u sequence `\x1b[27u`, not a bare `\x1b`.
 * The literal fallbacks preserve legacy single/double-escape on terminals without it.
 */
export declare function handleInputOrEscape(data: string, input: {
    handleInput(data: string): void;
}, onCancel: () => void): void;
/**
 * One row in the unified plugin list. npm and marketplace plugins live in
 * separate registries with different shapes, so a tagged union keeps both
 * paths type-safe end-to-end (list rendering, value lookup, detail callback).
 */
export type PluginListEntry = {
    kind: "npm";
    plugin: InstalledPlugin;
} | {
    kind: "marketplace";
    plugin: InstalledPluginSummary;
};
export interface PluginListCallbacks {
    onNpmSelect: (plugin: InstalledPlugin) => void;
    onMarketplaceSelect: (plugin: InstalledPluginSummary) => void;
    onCancel: () => void;
}
/**
 * Shows installed plugins from both registries (npm + marketplace) with
 * enable/disable status, scope tag, and shadow indicator. Selecting an entry
 * fans out to the kind-specific detail callback.
 */
export declare class PluginListComponent extends OverlayPanel {
    #private;
    private readonly entries;
    constructor(entries: ReadonlyArray<PluginListEntry>, callbacks: PluginListCallbacks);
    handleInput(data: string): void;
}
export interface PluginDetailCallbacks {
    onEnabledChange: (enabled: boolean) => void;
    onFeatureChange: (feature: string, enabled: boolean) => void;
    onConfigChange: (key: string, value: unknown) => void;
    onBack: () => void;
}
/**
 * Shows detail settings for a single plugin:
 * - Enable/disable toggle
 * - Feature toggles
 * - Config settings
 */
export declare class PluginDetailComponent extends OverlayPanel {
    #private;
    private plugin;
    private readonly manager;
    private readonly callbacks;
    constructor(plugin: InstalledPlugin, manager: PluginManager, callbacks: PluginDetailCallbacks);
    handleInput(data: string): void;
}
export interface MarketplacePluginDetailCallbacks {
    onEnabledChange: (enabled: boolean) => void;
    onConfigChange: (pluginName: string, key: string, value: unknown) => void;
    /** Schedules a TUI frame after asynchronous manifest settings load. */
    requestRender?: () => void;
    onBack: () => void;
}
/**
 * Detail view for a marketplace plugin, including settings declared by its
 * runtime package and metadata from the installed-plugins registry.
 */
export declare class MarketplacePluginDetailComponent extends OverlayPanel {
    #private;
    private plugin;
    private readonly manager;
    private readonly callbacks;
    constructor(plugin: InstalledPluginSummary, manager: PluginManager, callbacks: MarketplacePluginDetailCallbacks);
    handleInput(data: string): void;
}
export interface PluginSettingsCallbacks {
    onClose: () => void;
    onPluginChanged: () => void | Promise<void>;
    /** Schedules a TUI frame after asynchronous plugin data loads. */
    requestRender?: () => void;
}
/**
 * Top-level plugin settings component.
 * Manages navigation between plugin list and plugin detail views.
 */
export declare class PluginSettingsComponent extends Container {
    #private;
    private readonly callbacks;
    constructor(cwd: string, callbacks: PluginSettingsCallbacks);
    handleInput(data: string): void;
}
