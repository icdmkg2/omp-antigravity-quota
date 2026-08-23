import { ToolExecutionComponent } from "../../modes/components/tool-execution.js";
import type { InteractiveModeContext } from "../../modes/types.js";
import type { AgentSessionEvent } from "../../session/agent-session.js";
export declare class EventController {
    #private;
    private ctx;
    constructor(ctx: InteractiveModeContext);
    dispose(): void;
    subscribeToAgent(): void;
    /** Whether `#handleToolExecutionStart` has fired for this call id this turn. */
    hasToolExecutionStarted(toolCallId: string): boolean;
    /**
     * Clear every transcript-anchored/turn-scoped piece of state. Used by the
     * session focus proxy when re-pointing the transcript at another session:
     * components, timers, and stream-reveal state all reference the previous
     * session's transcript and must not bleed into the new one.
     */
    resetTranscriptAnchors(): void;
    handleEvent(event: AgentSessionEvent): Promise<void>;
    /**
     * Adopt a rebuilt-tail todo snapshot as the controller's tracked live
     * snapshot. Used by rebuild paths (settings/extensions overlay close, focus
     * attach, /resume) to preserve displacement continuity when a turn is still
     * active — without this, the next same-turn `todo` update would stack
     * another panel because the controller's tracker was reset before rebuild.
     * Drops the candidate when it is no longer a displaceable todo.
     */
    inheritDisplaceableTodo(component: ToolExecutionComponent | null | undefined): void;
    sendErrorNotification(event: Extract<AgentSessionEvent, {
        type: "agent_end";
    }>): void;
    sendCompletionNotification(event: Extract<AgentSessionEvent, {
        type: "agent_end";
    }>): void;
}
