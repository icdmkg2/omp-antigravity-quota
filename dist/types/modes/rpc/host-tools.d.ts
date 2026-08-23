import type { AgentTool, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { RpcHostToolCallRequest, RpcHostToolCancelRequest, RpcHostToolDefinition, RpcHostToolResult, RpcHostToolUpdate } from "./rpc-types.js";
type RpcHostToolOutput = (frame: RpcHostToolCallRequest | RpcHostToolCancelRequest) => void;
export declare function isRpcHostToolResult(value: unknown): value is RpcHostToolResult;
export declare function isRpcHostToolUpdate(value: unknown): value is RpcHostToolUpdate;
export declare class RpcHostToolBridge {
    #private;
    constructor(output: RpcHostToolOutput);
    getToolNames(): string[];
    setTools(tools: RpcHostToolDefinition[]): AgentTool[];
    handleResult(frame: RpcHostToolResult): boolean;
    handleUpdate(frame: RpcHostToolUpdate): boolean;
    requestExecution(definition: RpcHostToolDefinition, toolCallId: string, args: Record<string, unknown>, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<unknown>): Promise<AgentToolResult<unknown>>;
    rejectAllPending(message: string): void;
    /** Reject active and future host tool requests after the RPC client disconnects. */
    close(message: string): void;
}
export {};
