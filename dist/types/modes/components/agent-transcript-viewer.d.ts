import type { AgentTool } from "@oh-my-pi/pi-agent-core";
import { type Component, type TUI } from "@oh-my-pi/pi-tui";
import type { KeyId } from "../../config/keybindings.js";
import type { MessageRenderer } from "../../extensibility/extensions/types.js";
import type { AgentLifecycleManager } from "../../registry/agent-lifecycle.js";
import type { AgentRegistry } from "../../registry/agent-registry.js";
import type { SessionObserverRegistry } from "../session-observer-registry.js";
import type { AgentHubRemote } from "./agent-hub.js";
export interface AgentTranscriptViewerDeps {
    agentId: string;
    registry: AgentRegistry;
    /** Collab guest: read transcript from the host instead of a local file. */
    remote?: AgentHubRemote;
    /** Progress/cost snapshot source for the stats line. */
    observers?: SessionObserverRegistry;
    /** Revive+prompt path for messageable local agents. Lazy to avoid touching the global. */
    lifecycle?: () => AgentLifecycleManager;
    ui: TUI;
    getTool?: (name: string) => AgentTool | undefined;
    /** Whether the active registry entry came from a built-in factory. */
    isBuiltInTool?: (name: string) => boolean;
    getMessageRenderer?: (customType: string) => MessageRenderer | undefined;
    cwd: string;
    hideThinkingBlock?: () => boolean;
    proseOnlyThinking?: () => boolean;
    expandKeys: KeyId[];
    /** Keys that toggle the whole hub closed (app.agents.hub + app.session.observe). */
    hubKeys: KeyId[];
    requestRender: () => void;
    /** Close just this viewer (Esc), returning to the hub table. */
    onClose: () => void;
    /** Close this viewer AND the hub (hub-toggle keys). */
    onHubClose: () => void;
}
export declare class AgentTranscriptViewer implements Component {
    #private;
    private readonly deps;
    constructor(deps: AgentTranscriptViewerDeps);
    dispose(): void;
    handleInput(data: string): void;
    render(width: number): readonly string[];
}
