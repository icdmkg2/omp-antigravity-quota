import type { AutocompleteItem } from "@oh-my-pi/pi-tui";
import type { BuiltinSlashCommand, ParsedSlashCommand, SlashCommandResult, SlashCommandRuntime, SlashCommandSpec, TuiSlashCommandRuntime } from "./types.js";
export type { BuiltinSlashCommand, SubcommandDef } from "./types.js";
/** TUI-specific runtime accepted by `executeBuiltinSlashCommand`. */
export type BuiltinSlashCommandRuntime = TuiSlashCommandRuntime;
export interface TuiBuiltinSlashCommand extends BuiltinSlashCommand {
    getArgumentCompletions?: (prefix: string) => AutocompleteItem[] | null | Promise<AutocompleteItem[] | null>;
    getInlineHint?: (argumentText: string) => string | null;
    getAutocompleteDescription?: () => string | undefined;
}
export declare const BUILTIN_SLASH_COMMAND_RESERVED_NAMES: ReadonlySet<string>;
/** Builtin command metadata used for slash-command autocomplete and help text. */
export declare const BUILTIN_SLASH_COMMAND_DEFS: ReadonlyArray<BuiltinSlashCommand>;
/**
 * Materialized builtin slash commands with completion functions derived from
 * declarative subcommand/hint definitions.
 */
export declare const BUILTIN_SLASH_COMMANDS: ReadonlyArray<TuiBuiltinSlashCommand>;
export declare function buildTuiBuiltinSlashCommands(runtime: TuiSlashCommandRuntime): ReadonlyArray<TuiBuiltinSlashCommand>;
/**
 * Unified registry exposed for cross-mode tooling. Each spec carries at least
 * one of `handle` / `handleTui`. The TUI dispatcher prefers `handleTui`; the
 * ACP dispatcher requires `handle` and skips TUI-only entries.
 */
export declare const BUILTIN_SLASH_COMMANDS_INTERNAL: ReadonlyArray<SlashCommandSpec>;
/**
 * Execute a builtin slash command in the interactive TUI.
 *
 * Returns `false` when no builtin matched. Returns `true` when a command
 * consumed the input entirely. Returns a `string` when the command was handled
 * but remaining text should be sent as a prompt.
 */
export declare function executeBuiltinSlashCommand(text: string, runtime: BuiltinSlashCommandRuntime): Promise<string | boolean>;
/** Look up a unified spec by name or alias. Used by the ACP dispatcher. */
export declare function lookupBuiltinSlashCommand(name: string): SlashCommandSpec | undefined;
export type { ParsedSlashCommand, SlashCommandResult, SlashCommandRuntime, SlashCommandSpec, TuiSlashCommandRuntime };
