import type { AgentTool, AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
declare const manageSkillSchema: import("@oh-my-pi/omptype").FluentType<{
    action: "create" | "delete" | "update";
    body?: string | undefined;
    description?: string | undefined;
    name: string;
}, {
    action: "create" | "delete" | "update";
    body?: string | undefined;
    description?: string | undefined;
    name: string;
}>;
export type ManageSkillParams = typeof manageSkillSchema.infer;
/**
 * Direct create/update/delete of isolated managed skills. Gated behind
 * `autolearn.enabled`; backend-independent (the skill side is standalone).
 */
export declare class ManageSkillTool implements AgentTool<typeof manageSkillSchema> {
    private readonly refreshSkills?;
    readonly name = "manage_skill";
    readonly approval: "write";
    readonly label = "Manage Skill";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        action: "create" | "delete" | "update";
        body?: string | undefined;
        description?: string | undefined;
        name: string;
    }, {
        action: "create" | "delete" | "update";
        body?: string | undefined;
        description?: string | undefined;
        name: string;
    }>;
    readonly strict = true;
    readonly loadMode: "essential";
    readonly summary = "Create, update, or delete an isolated managed skill";
    constructor(refreshSkills?: (() => Promise<void>) | undefined);
    static createIf(session: ToolSession): ManageSkillTool | null;
    execute(_id: string, params: ManageSkillParams): Promise<AgentToolResult>;
}
export {};
