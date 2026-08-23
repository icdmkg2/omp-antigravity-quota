export declare const BUILTIN_TOOL_NAMES: readonly ["read", "bash", "edit", "ast_grep", "ast_edit", "ask", "debug", "eval", "github", "glob", "grep", "lsp", "inspect_image", "browser", "computer", "checkpoint", "rewind", "security_scan", "task", "hub", "todo", "web_search", "write", "memory_edit", "retain", "recall", "reflect", "learn", "manage_skill"];
export type BuiltinToolName = (typeof BUILTIN_TOOL_NAMES)[number];
export declare const HIDDEN_TOOL_NAMES: readonly ["yield", "goal", "think"];
export type HiddenToolName = (typeof HIDDEN_TOOL_NAMES)[number];
/** Canonicalize built-in IDs and legacy aliases. Leave plugin names unchanged. */
export declare function normalizeToolName(name: string): string;
/** Normalize and deduplicate tool names while preserving first-seen order. */
export declare function normalizeToolNames(names: Iterable<string>): string[];
/** MCP tool names carry the `mcp__<server>_<tool>` prefix minted by `createMCPToolName`. */
export declare function isMCPToolName(name: string): boolean;
