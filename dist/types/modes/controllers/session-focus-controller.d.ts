/**
 * SessionFocusController - Weak retargeting primitive between the rendering/
 * input layer and the AgentSession it displays.
 *
 * Focusing re-points the transcript, streaming event subscription, status
 * line, and editor prompt/interrupt at a subagent's live AgentSession (from
 * AgentRegistry) without touching the main session underneath; unfocusing
 * re-attaches the main session and rebuilds the transcript from its
 * authoritative state.
 */
import { AgentLifecycleManager } from "../../registry/agent-lifecycle.js";
import { AgentRegistry } from "../../registry/agent-registry.js";
import type { AgentSession } from "../../session/agent-session.js";
import type { InteractiveModeContext } from "../types.js";
export declare class SessionFocusController {
    #private;
    private ctx;
    private registry;
    private lifecycle;
    constructor(ctx: InteractiveModeContext, registry?: AgentRegistry, lifecycle?: () => AgentLifecycleManager);
    get focusedAgentId(): string | undefined;
    /** Focused live session, undefined when unfocused. */
    get target(): AgentSession | undefined;
    /** Focus the main view on an agent's live session. Throws an Error with a user-displayable message. */
    focusAgent(id: string): Promise<void>;
    /** Focus the focused agent's parent agent, falling back to the main session. No-op when unfocused. */
    focusParent(): Promise<void>;
    /** Return to the main session. No-op when unfocused. */
    unfocus(): Promise<void>;
    dispose(): void;
}
