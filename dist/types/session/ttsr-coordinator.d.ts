import { type AfterToolCallContext, type AfterToolCallResult, type Agent, type AgentEvent } from "@oh-my-pi/pi-agent-core";
import type { AssistantMessage } from "@oh-my-pi/pi-ai";
import type { Settings } from "../config/settings.js";
import type { TtsrManager } from "../export/ttsr.js";
import type { AgentSessionEvent } from "./agent-session-events.js";
import type { SessionManager } from "./session-manager.js";
interface TtsrContinueOptions {
    delayMs?: number;
    generation?: number;
    shouldContinue?: () => boolean;
    onSkip?: () => void;
    onError?: () => void;
}
/** Capabilities the TTSR coordinator borrows from its owning session. */
export interface TtsrCoordinatorHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    emitSessionEvent(event: AgentSessionEvent): Promise<void>;
    schedulePostPromptTask(task: (signal: AbortSignal) => Promise<void>, options?: {
        delayMs?: number;
    }): void;
    scheduleAgentContinue(options: TtsrContinueOptions): void;
    promptGeneration(): number;
}
/** Coordinates TTSR stream matching, interruption, injection, and resume gates. */
export declare class TtsrCoordinator {
    #private;
    constructor(host: TtsrCoordinatorHost, manager: TtsrManager | undefined);
    /** Configured TTSR manager, when stream rules are enabled. */
    get manager(): TtsrManager | undefined;
    /** Whether a TTSR-triggered stream abort is awaiting its continuation. */
    get abortPending(): boolean;
    /** Current resume gate awaited by post-prompt recovery. */
    get resumeGate(): Promise<void> | undefined;
    /** Resets stream buffers at turn start. */
    onTurnStart(): void;
    /** Advances repeat-after-gap tracking at turn end. */
    onTurnEnd(): void;
    /** Checks one streamed message update and reports whether TTSR consumed it by aborting. */
    checkMessageUpdate(event: AgentEvent): Promise<boolean>;
    /** Settles the previous resume gate and queues any deferred injection. */
    onAssistantMessageEnd(message: AssistantMessage): void;
    /** Marks names persisted with a delivered TTSR injection as injected. */
    markInjectedFromDetails(details: unknown): void;
    /** Folds per-tool reminders into the matched tool's result. */
    afterToolCall(ctx: AfterToolCallContext): AfterToolCallResult | undefined;
    /** Resolves and clears the current resume gate. */
    resolveResume(): void;
}
export {};
