import type { AgentTool, AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
declare const memoryRetainSchema: import("@oh-my-pi/omptype").FluentType<{
    items: {
        content: string;
        context?: string | undefined;
    }[];
}, {
    items: {
        content: string;
        context?: string | undefined;
    }[];
}>;
export type MemoryRetainParams = typeof memoryRetainSchema.infer;
export declare class MemoryRetainTool implements AgentTool<typeof memoryRetainSchema> {
    private readonly session;
    readonly name = "retain";
    readonly approval: "read";
    readonly label = "Retain";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        items: {
            content: string;
            context?: string | undefined;
        }[];
    }, {
        items: {
            content: string;
            context?: string | undefined;
        }[];
    }>;
    readonly strict = true;
    readonly loadMode = "discoverable";
    readonly summary = "Store important facts in long-term memory";
    constructor(session: ToolSession);
    static createIf(session: ToolSession): MemoryRetainTool | null;
    execute(_id: string, params: MemoryRetainParams): Promise<AgentToolResult>;
}
export {};
