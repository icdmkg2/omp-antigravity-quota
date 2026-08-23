import type { Agent, AgentMessage, AgentTurnEndContext } from "@oh-my-pi/pi-agent-core";
import type { Model } from "@oh-my-pi/pi-ai";
import type { LocalProtocolOptions } from "../internal-urls/index.js";
import type { PlanModeState } from "../plan-mode/state.js";
import { type ConfiguredThinkingLevel } from "../thinking.js";
import type { PlanProposalHandler } from "../tools/resolve.js";
import type { PlanYolo, Prewalk } from "./agent-session-types.js";
import type { SessionManager } from "./session-manager.js";
/** Hidden plan steering is consumed within the live run and must not reappear after a context rebuild. */
export declare function isPrewalkPlanNudge(message: AgentMessage): boolean;
/** Capabilities the prewalk coordinator borrows from its owning session. */
export interface PrewalkCoordinatorHost {
    agent: Agent;
    sessionManager: SessionManager;
    model(): Model | undefined;
    configuredThinkingLevel(): ConfiguredThinkingLevel | undefined;
    emitNotice(level: "info" | "warning" | "error", message: string, source?: string): void;
    setModelTemporary(model: Model, thinkingLevel?: ConfiguredThinkingLevel, options?: {
        ephemeral?: boolean;
    }): Promise<void>;
    setActiveToolsByName(names: string[]): Promise<void>;
    setActiveToolPresentation(toolNames: string[], mountedToolNames: string[]): Promise<void>;
    runToolRegistryMutation<T>(mutation: () => Promise<T>): Promise<T>;
    getActiveToolNames(): string[];
    getEnabledToolNames(): string[];
    getSelectedMCPToolNames(): string[];
    getMountedXdevToolNames(): string[];
    hasBuiltInTool(name: string): boolean;
    getPlanModeState(): PlanModeState | undefined;
    setPlanModeState(state: PlanModeState | undefined): void;
    getPlanReferencePath(): string;
    setPlanProposalHandler(handler: PlanProposalHandler | null): void;
    waitForSessionMessagePersistence(message: AgentMessage): Promise<void>;
    localProtocolOptions(): LocalProtocolOptions;
}
/** Initial state for prewalk and plan-yolo startup flows. */
export interface PrewalkCoordinatorOptions {
    prewalk?: Prewalk;
    planYolo?: PlanYolo;
}
/** Coordinates one-way model prewalks and automatic plan-yolo handoffs. */
export declare class PrewalkCoordinator {
    #private;
    constructor(host: PrewalkCoordinatorHost, options?: PrewalkCoordinatorOptions);
    /** Current prewalk target, if the one-way switch remains armed. */
    get state(): Prewalk | undefined;
    /** Advances the one-way prewalk switch at a completed assistant-turn boundary. */
    advanceAtTurnEnd(liveMessages: AgentMessage[], context: AgentTurnEndContext | undefined): Promise<void>;
    /** Arms a prewalk immediately for an explicit slash-command request. */
    arm(target: Model, thinkingLevel?: ConfiguredThinkingLevel): boolean;
    /** Lazily enables plan-yolo's plan phase before the first prompt is built. */
    armPlanYoloIfNeeded(): Promise<void>;
}
