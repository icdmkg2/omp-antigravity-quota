import type { ParsedSlashCommand, SlashCommandResult, SlashCommandRuntime } from "../types.js";
/** ACP/text-mode `/ssh` handler. Shared by both dispatchers via the spec. */
export declare function handleSshAcp(command: ParsedSlashCommand, runtime: SlashCommandRuntime): Promise<SlashCommandResult>;
