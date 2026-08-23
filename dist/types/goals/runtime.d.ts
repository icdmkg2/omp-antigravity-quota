import type { Goal, GoalBudgetSteering, GoalModeState, GoalRuntimeEvent, GoalTokenUsage } from "./state.js";
export interface GoalRuntimeHost {
    getState(): GoalModeState | undefined;
    setState(state: GoalModeState | undefined): void;
    getCurrentUsage(): GoalTokenUsage;
    emit(event: GoalRuntimeEvent): void | Promise<void>;
    persist(mode: "goal" | "goal_paused" | "none", state?: GoalModeState): void;
    sendHiddenMessage(message: {
        customType: string;
        content: string;
        deliverAs?: "steer" | "followUp" | "nextTurn";
    }): Promise<void>;
    now?(): number;
}
export interface GoalTurnSnapshot {
    turnId: string;
    baselineUsage: GoalTokenUsage;
    activeGoalId?: string;
}
export interface GoalWallClockSnapshot {
    lastAccountedAt: number;
    activeGoalId?: string;
}
export interface GoalRuntimeSnapshot {
    turnSnapshot?: GoalTurnSnapshot;
    wallClock: GoalWallClockSnapshot;
    budgetReportedFor?: string;
}
export type GoalPromptKind = "active" | "continuation" | "budget-limit";
export declare function remainingTokens(goal: Goal | null | undefined): number | null;
export declare function renderTrustedObjective(objective: string): string;
export declare function goalTokenDelta(current: GoalTokenUsage, baseline: GoalTokenUsage): number;
export declare function renderGoalPrompt(kind: GoalPromptKind, goal: Goal): string;
export declare function completionBudgetReport(goal: Goal): string | null;
export declare class GoalRuntime {
    #private;
    constructor(host: GoalRuntimeHost);
    get snapshot(): GoalRuntimeSnapshot;
    clearAccounting(): void;
    onTurnStart(turnId: string, baselineUsage: GoalTokenUsage): void;
    onToolCompleted(toolName: string): Promise<void>;
    onGoalToolCompleted(): Promise<void>;
    onAgentEnd(options?: {
        turnCompleted?: boolean;
        currentUsage?: GoalTokenUsage;
    }): Promise<void>;
    onTaskAborted(options?: {
        reason?: "interrupted" | "internal";
    }): Promise<void>;
    onThreadResumed(options?: {
        preserveActiveGoal?: boolean;
    }): Promise<GoalModeState | undefined>;
    onBudgetMutated(newBudget: number | undefined): Promise<GoalModeState | undefined>;
    flushUsage(steering: GoalBudgetSteering, currentUsage?: GoalTokenUsage): Promise<void>;
    createGoal(input: {
        objective: string;
        tokenBudget?: number;
    }): Promise<GoalModeState>;
    replaceGoal(input: {
        objective: string;
        tokenBudget?: number;
    }): Promise<GoalModeState>;
    resumeGoal(): Promise<GoalModeState>;
    pauseGoal(): Promise<GoalModeState | undefined>;
    dropGoal(): Promise<Goal | undefined>;
    completeGoalFromTool(): Promise<Goal>;
    buildActivePrompt(): string | undefined;
    buildContinuationPrompt(): string | undefined;
}
