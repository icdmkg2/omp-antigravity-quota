/**
 * Tool wrappers for extensions.
 */
import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback, ToolLoadMode } from "@oh-my-pi/pi-agent-core";
import type { Static, TSchema } from "@oh-my-pi/pi-ai";
import type { ExtensionRunner } from "./runner.js";
import type { RegisteredTool } from "./types.js";
/**
 * Adapts a RegisteredTool into an AgentTool.
 */
export declare class RegisteredToolAdapter implements AgentTool<any, any, any> {
    private registeredTool;
    private runner;
    name: string;
    description: string;
    parameters: any;
    label: string;
    strict: boolean;
    renderCall?: (args: any, options: any, theme: any) => any;
    renderResult?: (result: any, options: any, theme: any, args?: any) => any;
    readonly loadMode: ToolLoadMode;
    constructor(registeredTool: RegisteredTool, runner: ExtensionRunner);
    execute(toolCallId: string, params: any, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<any>, context?: AgentToolContext): Promise<AgentToolResult<unknown, unknown>>;
}
/**
 * Backward-compatible factory function wrapper.
 */
export declare function wrapRegisteredTool(registeredTool: RegisteredTool, runner: ExtensionRunner): AgentTool;
/**
 * Wrap all registered tools into AgentTools.
 */
export declare function wrapRegisteredTools(registeredTools: RegisteredTool[], runner: ExtensionRunner): AgentTool[];
/**
 * Wraps a tool with extension callbacks for interception.
 * - Emits tool_call event before execution (can block)
 * - Emits tool_result event after execution (can modify result)
 */
export declare class ExtensionToolWrapper<TParameters extends TSchema = TSchema, TDetails = unknown> implements AgentTool<TParameters, TDetails> {
    private tool;
    private runner;
    name: string;
    description: string;
    parameters: TParameters;
    label: string;
    strict: boolean;
    constructor(tool: AgentTool<TParameters, TDetails>, runner: ExtensionRunner);
    /**
     * Forward browser mode changes when available.
     */
    restartForModeChange(): Promise<void>;
    execute(toolCallId: string, params: Static<TParameters>, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<TDetails, TParameters>, context?: AgentToolContext): Promise<AgentToolResult<TDetails, TParameters>>;
}
