import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback, ToolApprovalDecision } from "@oh-my-pi/pi-agent-core";
import { type Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "../tools/index.js";
import { type LspParams, type LspToolDetails, lspSchema } from "./types.js";
/**
 * LSP tool for language server protocol operations.
 */
export declare class LspTool implements AgentTool<typeof lspSchema, LspToolDetails, Theme> {
    private readonly session;
    readonly name = "lsp";
    readonly approval: (args: unknown) => ToolApprovalDecision;
    readonly formatApprovalDetails: (args: unknown) => string[];
    readonly label = "LSP";
    readonly loadMode = "discoverable";
    readonly summary = "Query LSP (language server) for diagnostics, hover info, and references";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        action: "capabilities" | "code_actions" | "definition" | "diagnostics" | "hover" | "implementation" | "references" | "reload" | "rename" | "rename_file" | "request" | "status" | "symbols" | "type_definition";
        apply?: boolean | undefined;
        file?: string | undefined;
        line?: number | undefined;
        new_name?: string | undefined;
        payload?: string | undefined;
        query?: string | undefined;
        symbol?: string | undefined;
        timeout?: number | undefined;
    }, {
        action: "capabilities" | "code_actions" | "definition" | "diagnostics" | "hover" | "implementation" | "references" | "reload" | "rename" | "rename_file" | "request" | "status" | "symbols" | "type_definition";
        apply?: boolean | undefined;
        file?: string | undefined;
        line?: number | undefined;
        new_name?: string | undefined;
        payload?: string | undefined;
        query?: string | undefined;
        symbol?: string | undefined;
        timeout?: number | undefined;
    }>;
    readonly strict = true;
    constructor(session: ToolSession);
    static createIf(session: ToolSession): LspTool | null;
    execute(_toolCallId: string, params: LspParams, signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<LspToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<LspToolDetails>>;
}
