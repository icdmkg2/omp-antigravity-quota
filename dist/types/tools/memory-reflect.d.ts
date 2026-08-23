import type { AgentTool, AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
declare const memoryReflectSchema: import("@oh-my-pi/omptype").FluentType<{
    context?: string | undefined;
    query: string;
}, {
    context?: string | undefined;
    query: string;
}>;
export type MemoryReflectParams = typeof memoryReflectSchema.infer;
export declare class MemoryReflectTool implements AgentTool<typeof memoryReflectSchema> {
    private readonly session;
    readonly name = "reflect";
    readonly approval: "read";
    readonly label = "Reflect";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        context?: string | undefined;
        query: string;
    }, {
        context?: string | undefined;
        query: string;
    }>;
    readonly strict = true;
    readonly loadMode = "discoverable";
    readonly summary = "Synthesize an answer from long-term memory";
    constructor(session: ToolSession);
    static createIf(session: ToolSession): MemoryReflectTool | null;
    execute(_id: string, params: MemoryReflectParams, signal?: AbortSignal): Promise<AgentToolResult>;
}
export {};
