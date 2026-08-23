import type { AvailableCommand } from "@oh-my-pi/pi-utils/acp";
import type { AcpBuiltinSlashCommandResult, SlashCommandRuntime } from "./types.js";
export type { AcpBuiltinSlashCommandResult } from "./types.js";
/**
 * All names (primary + aliases) that are reserved by ACP builtins. Used to
 * filter out extension commands that would shadow a builtin or its alias at
 * dispatch time (e.g. `models` is an alias for `/model`, so an extension
 * registering `models` would appear in the palette but execute the builtin).
 */
export declare const ACP_BUILTIN_RESERVED_NAMES: ReadonlySet<string>;
/**
 * Whether an extension command named `name` would be captured by ACP builtin
 * dispatch before reaching the extension handler. Beyond exact name/alias
 * collisions, `parseSlashCommand` treats `:` as a name/args separator, so a
 * colon-namespaced name whose prefix is a handled builtin (e.g. `model:foo`)
 * executes the `/model` builtin with `foo` as args. Such names must not be
 * advertised to ACP clients.
 */
export declare function isAcpBuiltinShadowedName(name: string): boolean;
/**
 * Commands advertised to ACP clients. Entries without a text-mode `handle`
 * (e.g. `/quit`, `/login`, dashboards) are filtered out so the client doesn't
 * see commands it cannot drive.
 */
export declare const ACP_BUILTIN_SLASH_COMMANDS: AvailableCommand[];
/**
 * Dispatch a slash command in ACP/text mode. Returns:
 * - `false` when no builtin matched (or matched a TUI-only entry); the caller
 *   should forward the input as a prompt.
 * - `{ consumed: true }` when the command handled the input entirely.
 * - `{ prompt }` when the command was handled but a residual prompt should be
 *   sent to the model.
 */
export declare function executeAcpBuiltinSlashCommand(text: string, runtime: SlashCommandRuntime): Promise<AcpBuiltinSlashCommandResult>;
