/**
 * CustomToolAdapter wraps CustomTool instances into AgentTool for use with the agent.
 */
import type { AgentTool, AgentToolUpdateCallback, ToolLoadMode } from "@oh-my-pi/pi-agent-core";
import type { Static, TSchema } from "@oh-my-pi/pi-ai";
import type { Theme } from "../../modes/theme/theme.js";
import type { CustomTool, CustomToolContext } from "./types.js";
export declare class CustomToolAdapter<TParams extends TSchema = TSchema, TDetails = any, TTheme extends Theme = Theme> implements AgentTool<TParams, TDetails, TTheme> {
    private tool;
    private getContext;
    name: string;
    label: string;
    description: string;
    parameters: TParams;
    readonly strict: boolean | undefined;
    readonly loadMode: ToolLoadMode;
    constructor(tool: CustomTool<TParams, TDetails>, getContext: () => CustomToolContext);
    execute(toolCallId: string, params: Static<TParams>, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<TDetails, TParams>, context?: CustomToolContext): Promise<import("@oh-my-pi/pi-agent-core").AgentToolResult<TDetails, TParams>>;
    /**
     * Backward-compatible export of factory function for existing callers.
     * Prefer CustomToolAdapter constructor directly.
     */
    static wrap<TParams extends TSchema = TSchema, TDetails = any, TTheme extends Theme = Theme>(tool: CustomTool<TParams, TDetails>, getContext: () => CustomToolContext): AgentTool<TParams, TDetails, TTheme>;
}
