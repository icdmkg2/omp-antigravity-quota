/**
 * Fullscreen /agents hub, shown on the alternate screen like /models.
 *
 * Layout mirrors the model hub: a sidebar of scopes (All agents, per-source
 * groups, "+ New agent"), a body listing agents with type-to-filter search,
 * and a footer that turns into a chip strip while configuring. Enter on an
 * agent opens its property strip (enabled / model / prewalk / advisor); a
 * property opens a value strip whose "pick model…" chip dives into the real
 * ModelBrowser and whose "pattern…" chip opens an inline pattern input, so
 * every per-agent knob is picked instead of memorized.
 */
import { type Component, type TUI } from "@oh-my-pi/pi-tui";
import type { ModelRegistry } from "../../config/model-registry.js";
import type { Settings } from "../../config/settings.js";
/** Ambient model context for resolution previews and the creation architect. */
export interface AgentsHubModelContext {
    modelRegistry?: ModelRegistry;
    activeModelPattern?: string;
    defaultModelPattern?: string;
}
export interface AgentsHubCallbacks {
    onCancel: () => void;
}
/**
 * The fullscreen agents hub component. Hosted via
 * `ui.showOverlay(..., { fullscreen: true })`; the host must call
 * {@link AgentsHubComponent.dispose} when the overlay closes.
 */
export declare class AgentsHubComponent implements Component {
    #private;
    private constructor();
    static create(tui: TUI, cwd: string, settings: Settings, modelContext?: AgentsHubModelContext, callbacks?: AgentsHubCallbacks): Promise<AgentsHubComponent>;
    dispose(): void;
    invalidate(): void;
    handleInput(data: string): void;
    render(width: number): string[];
}
