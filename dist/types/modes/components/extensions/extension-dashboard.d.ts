/**
 * ExtensionDashboard - Fullscreen alternate-screen control center for extensions.
 *
 * Chrome mirrors the `/settings` overlay: a titled rounded box, a shared
 * {@link TabBar} for provider selection, and a two-column body (inventory list |
 * inspector). Both panes are mouse-aware — wheel scrolls, hover highlights, and
 * clicks select/activate — routed from a single SGR-mouse handler.
 *
 * Navigation:
 * - Tab/Shift+Tab or ←/→: switch provider tab
 * - Up/Down/j/k or wheel: move list selection
 * - Space/Enter or click: toggle selected item (or provider master switch)
 * - Wheel over the inspector: scroll the detail pane
 * - Esc: clear search (if active) then close
 */
import { type Component, type Tab } from "@oh-my-pi/pi-tui";
import { Settings } from "../../../config/settings.js";
import type { ProviderTab } from "./types.js";
/**
 * Map dashboard provider tabs to {@link TabBar} tabs. Empty *enabled* providers
 * are muted — skipped by keyboard nav and unclickable; disabled providers stay
 * selectable (with a leading disabled glyph) so their master switch can be
 * re-enabled from the list. The "all" tab is never muted or marked.
 */
export declare function buildTabBarTabs(tabs: ProviderTab[]): Tab[];
export declare class ExtensionDashboard implements Component {
    #private;
    private readonly cwd;
    private readonly settings;
    private readonly terminalHeight;
    onClose?: () => void;
    onRequestRender?: () => void;
    private constructor();
    static create(cwd: string, settings?: Settings | null, terminalHeight?: number): Promise<ExtensionDashboard>;
    /**
     * Fullscreen frame: titled top border, the tab row(s), a divider, the
     * two-column body sized to fill the viewport, a divider, the footer hint, and
     * the bottom border. Records row geometry for mouse hit-testing.
     */
    render(width: number): readonly string[];
    invalidate(): void;
    handleInput(data: string): void;
}
