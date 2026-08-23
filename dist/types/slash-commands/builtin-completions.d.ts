import type { AutocompleteItem } from "@oh-my-pi/pi-tui";
import type { SubcommandDef, TuiSlashCommandRuntime } from "./types.js";
/**
 * Build getArgumentCompletions from declarative subcommand definitions.
 * Returns subcommand names filtered by prefix in the dropdown.
 */
export declare function buildArgumentCompletions(subcommands: SubcommandDef[]): (prefix: string) => AutocompleteItem[] | null;
/**
 * Build getArgumentCompletions for /mcp. Delegates to the generic
 * declarative subcommand completer while the subcommand name itself is
 * still being typed, then switches to MCP server-name completion (sourced
 * from {@link collectMcpServerNames}) once a recognized server-name
 * subcommand (enable/disable/test/remove/reconnect/reauth/unauth) is
 * followed by a space. `remove` gets its own scope-aware completions (see
 * {@link buildMcpRemoveCompletions}) since — unlike the others —
 * it only ever succeeds against a config-file entry. Subcommands with a
 * different argument shape (add, smithery-search, ...) get no argument
 * completion.
 */
export declare function buildMcpArgumentCompletions(subcommands: SubcommandDef[], runtime: TuiSlashCommandRuntime): (argumentPrefix: string) => Promise<AutocompleteItem[] | null>;
/**
 * Build getInlineHint from declarative subcommand definitions.
 * Shows remaining completion + usage as dim ghost text after cursor.
 */
export declare function buildSubcommandInlineHint(subcommands: SubcommandDef[]): (argumentText: string) => string | null;
/**
 * Build getInlineHint for commands with a simple static hint string.
 * Shows the hint only when no arguments have been typed yet.
 */
export declare function buildStaticInlineHint(hint: string): (argumentText: string) => string | null;
/**
 * Build getArgumentCompletions that suggests directories relative to the
 * current project directory. Used by /move so users can Tab-complete the
 * destination directory.
 */
export declare function buildDirectoryArgumentCompletions(): (prefix: string) => Promise<AutocompleteItem[] | null>;
