/**
 * Tool wrapper - wraps tools with hook callbacks for interception.
 */
import type { AgentTool, AgentToolContext, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { Static, TSchema } from "@oh-my-pi/pi-ai";
import type { HookRunner } from "./runner.js";
/**
 * Wraps an AgentTool with hook callbacks for interception.
 *
 * Features:
 * - Emits tool_call event before execution (can block)
 * - Emits tool_result event after execution (can modify result)
 * - Forwards onUpdate callback to wrapped tool for progress streaming
 */
export declare class HookToolWrapper<TParameters extends TSchema = TSchema, TDetails = unknown> implements AgentTool<TParameters, TDetails> {
    private tool;
    private hookRunner;
    name: string;
    description: string;
    parameters: TParameters;
    label: string;
    strict: boolean;
    constructor(tool: AgentTool<TParameters, TDetails>, hookRunner: HookRunner);
    execute(toolCallId: string, params: Static<TParameters>, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<TDetails, TParameters>, context?: AgentToolContext): Promise<import("@oh-my-pi/pi-agent-core").AgentToolResult<TDetails, TParameters>>;
}
