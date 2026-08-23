import type { ParsedSlashCommand, SlashCommandResult, SlashCommandSpec, TuiSlashCommandRuntime } from "./types.js";
export declare const shutdownHandlerTui: (_command: ParsedSlashCommand, runtime: TuiSlashCommandRuntime) => SlashCommandResult;
export declare const BUILTIN_LIFECYCLE_SLASH_COMMANDS: ReadonlyArray<SlashCommandSpec>;
