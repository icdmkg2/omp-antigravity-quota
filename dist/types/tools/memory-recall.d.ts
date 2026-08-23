import type { AgentTool, AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
declare const memoryRecallSchema: import("@oh-my-pi/omptype").FluentType<{
    query: string;
}, {
    query: string;
}>;
export type MemoryRecallParams = typeof memoryRecallSchema.infer;
export declare class MemoryRecallTool implements AgentTool<typeof memoryRecallSchema> {
    private readonly session;
    readonly name = "recall";
    readonly approval: "read";
    readonly label = "Recall";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        query: string;
    }, {
        query: string;
    }>;
    readonly strict = true;
    readonly loadMode = "discoverable";
    readonly summary = "Search memory for relevant prior context";
    constructor(session: ToolSession);
    static createIf(session: ToolSession): MemoryRecallTool | null;
    execute(_id: string, params: MemoryRecallParams, signal?: AbortSignal): Promise<AgentToolResult>;
}
export {};
