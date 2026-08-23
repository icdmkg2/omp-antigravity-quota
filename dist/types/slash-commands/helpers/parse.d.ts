import type { ParsedSlashCommand, SlashCommandResult, SlashCommandRuntime } from "../types.js";
export interface ParsedSubcommand {
    verb: string;
    rest: string;
}
export type ConfigScope = "user" | "project";
export interface NamedScopeArgs {
    name?: string;
    scope: ConfigScope;
    error?: string;
}
/**
 * Parse a slash-invocation string into `name`/`args`.
 *
 * The separator is the earliest whitespace or `:` character so that both
 * `/foo bar` and `/foo:bar` map to `{ name: "foo", args: "bar" }`.
 */
export declare function parseSlashCommand(text: string): ParsedSlashCommand | null;
/**
 * Mark a command as fully consumed in the ACP shape.
 *
 * Pass `agentInvoked` when the command scheduled a real agent turn whose events
 * will stream after it returns (e.g. `/retry`). RPC hosts use that marker to
 * tell local-only commands apart from work that starts a turn, so reporting
 * `agentInvoked: false` there would have them finalize the request while the
 * agent is still running.
 */
export declare function commandConsumed(options?: {
    agentInvoked?: boolean;
}): {
    consumed: true;
    agentInvoked?: boolean;
};
/** Emit a usage/error message and consume the command. */
export declare function usage(text: string, runtime: SlashCommandRuntime): Promise<SlashCommandResult>;
/** Split `<verb> <rest>` on the first whitespace; lowercases `verb`. */
export declare function parseSubcommand(input: string): ParsedSubcommand;
export declare function errorMessage(error: unknown): string;
/**
 * Parse `<name?> [--scope project|user]`-style argument strings used by
 * remove/rm-style subcommands. `name` is optional so callers can surface
 * "name required" diagnostics with their own messaging.
 */
export declare function parseNamedScopeArgs(rest: string, invalidScopeMessage: string): NamedScopeArgs;
