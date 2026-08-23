import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../../extensibility/custom-tools/types.js";
import type { Theme } from "../../modes/theme/theme.js";
import type { ToolSession } from "../../tools/index.js";
import type { Goal, GoalToolDetails } from "../state.js";
declare const goalSchema: import("@oh-my-pi/omptype").FluentType<{
    objective?: string | undefined;
    op: "complete" | "create" | "drop" | "get" | "resume";
    token_budget?: number | undefined;
}, {
    objective?: string | undefined;
    op: "complete" | "create" | "drop" | "get" | "resume";
    token_budget?: number | undefined;
}>;
export type GoalToolInput = typeof goalSchema.infer;
export interface GoalToolResponse {
    goal: Goal | null;
    remainingTokens: number | null;
    completionBudgetReport: string | null;
}
export declare function buildGoalToolResponse(goal: Goal | null | undefined, options?: {
    includeCompletionReport?: boolean;
}): GoalToolResponse;
export declare class GoalTool implements AgentTool<typeof goalSchema, GoalToolDetails> {
    #private;
    readonly name = "goal";
    readonly label = "Goal";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        objective?: string | undefined;
        op: "complete" | "create" | "drop" | "get" | "resume";
        token_budget?: number | undefined;
    }, {
        objective?: string | undefined;
        op: "complete" | "create" | "drop" | "get" | "resume";
        token_budget?: number | undefined;
    }>;
    readonly strict = true;
    readonly intent: "omit";
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: GoalToolInput, _signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<GoalToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<GoalToolDetails>>;
}
interface GoalRenderArgs {
    op?: GoalToolInput["op"];
    objective?: string;
    token_budget?: number;
}
export declare const goalToolRenderer: {
    renderCall(args: GoalRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: GoalToolDetails;
        isError?: boolean;
    }, _options: RenderResultOptions, uiTheme: Theme, args?: GoalRenderArgs): Component;
    mergeCallAndResult: boolean;
};
export {};
