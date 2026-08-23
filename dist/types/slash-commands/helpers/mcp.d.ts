import type { ParsedSlashCommand, SlashCommandResult, SlashCommandRuntime } from "../types.js";
/** ACP/text-mode `/mcp` handler. Shared by both dispatchers via the spec. */
export declare function handleMcpAcp(command: ParsedSlashCommand, runtime: SlashCommandRuntime): Promise<SlashCommandResult>;
