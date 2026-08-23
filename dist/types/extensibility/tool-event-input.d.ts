interface ToolEventInputResolver {
    name: string;
    resolveEventInput?: (input: string) => string;
}
/** Resolves mode-specific textual tool input before extension/hook event normalization. */
export declare function resolveToolEventInput(tool: ToolEventInputResolver, input: Record<string, unknown>): Record<string, unknown>;
/** Adds derived compatibility fields to tool event input without changing tool execution parameters. */
export declare function normalizeToolEventInput(toolName: string, input: Record<string, unknown>): Record<string, unknown>;
export {};
