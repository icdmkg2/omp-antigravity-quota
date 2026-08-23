import type { AgentTool, AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
declare const learnSchema: import("@oh-my-pi/omptype").FluentType<{
    context?: string | undefined;
    memory: string;
    skill?: {
        action: "create" | "update";
        body: string;
        description: string;
        name: string;
    } | undefined;
}, {
    context?: string | undefined;
    memory: string;
    skill?: {
        action: "create" | "update";
        body: string;
        description: string;
        name: string;
    } | undefined;
}>;
export type LearnParams = typeof learnSchema.infer;
/**
 * Orchestrating "learn" tool: persists a lesson to long-term memory and,
 * given a `skill` payload, mints/enhances a managed skill via the shared
 * `writeManagedSkill` primitive. Gated behind `autolearn.enabled` plus a live
 * memory backend — `hindsight`/`mnemopi` (remote/SQLite) or `local` (the
 * file-based rollout backend, where lessons append to `learned.md`).
 */
export declare class LearnTool implements AgentTool<typeof learnSchema> {
    private readonly session;
    readonly name = "learn";
    readonly approval: (args: unknown) => "read" | "write";
    readonly label = "Learn";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        context?: string | undefined;
        memory: string;
        skill?: {
            action: "create" | "update";
            body: string;
            description: string;
            name: string;
        } | undefined;
    }, {
        context?: string | undefined;
        memory: string;
        skill?: {
            action: "create" | "update";
            body: string;
            description: string;
            name: string;
        } | undefined;
    }>;
    readonly strict = true;
    readonly loadMode: "essential";
    readonly summary = "Capture a reusable lesson to memory (and optionally a managed skill)";
    constructor(session: ToolSession);
    static createIf(session: ToolSession): LearnTool | null;
    execute(_id: string, params: LearnParams): Promise<AgentToolResult>;
}
export {};
