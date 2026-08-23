import type { AgentTool, AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
declare const memoryEditSchema: import("@oh-my-pi/omptype").FluentType<{
    content?: string | undefined;
    id: string;
    importance?: number | undefined;
    op: "forget" | "invalidate" | "update";
    replacement_id?: string | undefined;
}, {
    content?: string | undefined;
    id: string;
    importance?: number | undefined;
    op: "forget" | "invalidate" | "update";
    replacement_id?: string | undefined;
}>;
export type MemoryEditParams = typeof memoryEditSchema.infer;
export declare class MemoryEditTool implements AgentTool<typeof memoryEditSchema> {
    private readonly session;
    readonly name = "memory_edit";
    readonly approval: "read";
    readonly label = "Memory Edit";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        content?: string | undefined;
        id: string;
        importance?: number | undefined;
        op: "forget" | "invalidate" | "update";
        replacement_id?: string | undefined;
    }, {
        content?: string | undefined;
        id: string;
        importance?: number | undefined;
        op: "forget" | "invalidate" | "update";
        replacement_id?: string | undefined;
    }>;
    readonly strict = true;
    readonly loadMode = "discoverable";
    readonly summary = "Update, forget, or invalidate Mnemopi memories";
    constructor(session: ToolSession);
    static createIf(session: ToolSession): MemoryEditTool | null;
    execute(_id: string, params: MemoryEditParams): Promise<AgentToolResult>;
}
export {};
