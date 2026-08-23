import type { Agent, AgentMessage, AgentTool } from "@oh-my-pi/pi-agent-core";
import type { AssistantMessage, Model, ToolChoice } from "@oh-my-pi/pi-ai";
import type { Settings } from "../config/settings.js";
import { type TodoPhase } from "../tools/todo.js";
import type { AgentSessionEvent } from "./agent-session-events.js";
import type { SessionManager } from "./session-manager.js";
/** Capabilities the todo tracker borrows from its owning session. */
export interface TodoTrackerHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    model(): Model | undefined;
    agentKind(): "main" | "sub";
    emitSessionEvent(event: AgentSessionEvent): Promise<void>;
    scheduleAgentContinue(options: {
        generation?: number;
    }): void;
    promptGeneration(): number;
    hasPendingAsyncWake(): boolean;
    getActiveToolNames(): string[];
    getEnabledToolNames(): string[];
    toolRegistry(): Map<string, AgentTool>;
    planModeEnabled(): boolean;
    consumeLastServedToolChoiceLabel(): string | undefined;
}
/** Owns canonical todo state, eager preludes, and completion reminders. */
export declare class TodoTracker {
    #private;
    constructor(host: TodoTrackerHost);
    /** Returns a defensive clone of the current todo phases. */
    get phases(): TodoPhase[];
    /** Replaces todo phases with a defensive clone. */
    setPhases(phases: TodoPhase[]): void;
    /** Rehydrates todo phases from the current transcript branch. */
    syncFromBranch(): void;
    /** Returns a defensive clone suitable for snapshots and branch state. */
    clonePhases(phases: TodoPhase[]): TodoPhase[];
    /** Resets per-prompt reminder and mutation budgets. */
    resetCycle(): void;
    /** Records a completed tool result before asynchronous event processing begins. */
    onToolResult(toolName: string, isError: boolean): void;
    /** Detects whether a successful todo result came from an init operation. */
    onTodoResultDetails(details: Record<string, unknown>, toolCallId: string | undefined): boolean;
    /** Builds the first-turn eager todo prelude and optional forced tool choice. */
    createEagerTodoPrelude(promptText: string | undefined): {
        message: AgentMessage;
        toolChoice?: ToolChoice;
    } | undefined;
    /** Builds the first-turn eager task-delegation prelude. */
    createEagerTaskPrelude(promptText: string | undefined): AgentMessage | undefined;
    /** Builds reminder-only eager preludes after compaction. */
    buildPostCompactionEagerNudges(): AgentMessage[];
    /** Checks a terminal assistant turn and schedules continuation for incomplete todos. */
    checkCompletion(message: AssistantMessage): Promise<boolean>;
    /** Takes the next hidden mid-run reconciliation nudge, if its budget and guards allow. */
    takeMidRunNudge(): AgentMessage | null;
}
