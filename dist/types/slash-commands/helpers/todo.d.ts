import type { ParsedSlashCommand, SlashCommandResult, SlashCommandRuntime } from "../types.js";
/** ACP/text-mode `/todo` handler. Shared by both dispatchers via the spec. */
export declare function handleTodoAcp(command: ParsedSlashCommand, runtime: SlashCommandRuntime): Promise<SlashCommandResult>;
