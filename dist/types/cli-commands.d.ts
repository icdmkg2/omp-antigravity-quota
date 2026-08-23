/**
 * Top-level CLI command table.
 *
 * Lives in its own module (importable without side effects) so that tests can
 * inspect the registered subcommands without triggering the side-effectful
 * top-level await in `cli.ts`. Adding a new subcommand here is enough to make
 * `runCli` route to it instead of forwarding the argv as a prompt to
 * `launch` — see #1496 for the original "args silently leak to the LLM"
 * regression that motivated the split.
 */
import type { CommandEntry } from "@oh-my-pi/pi-utils/cli";
export declare const commands: CommandEntry[];
/**
 * Hint for a reserved plugin/marketplace verb used as a top-level command, or
 * `undefined` when the argv should fall through to `launch`.
 *
 * A bare verb (`omp marketplace`) always hints. A multi-word invocation only
 * hints when the arguments follow the documented plugin grammar — a marketplace
 * sub-action (`omp marketplace add …`) or a `name@marketplace` plugin id
 * (`omp uninstall foo@bar`) — so genuine prompts that merely begin with one of
 * these words (`omp list all my files`, `omp upgrade the deps`) still launch.
 *
 * Flags (`-…`) and `@file` arguments in the verb slot are never management
 * commands; those fall through to the default `launch` command.
 */
export declare function reservedTopLevelWordMessage(argv: readonly string[]): string | undefined;
/**
 * Return true when `first` matches a registered subcommand name or alias.
 *
 * Flags (`-…`) and `@file` arguments are never subcommands; for those the CLI
 * runner skips ahead to the default `launch` command.
 */
export declare function isSubcommand(first: string | undefined): boolean;
export type ResolvedCliArgv = {
    argv: string[];
} | {
    error: string;
};
/**
 * Subcommands that share the launch flag surface, so leading global flags
 * (`--cwd`, `--model`, `--approval-mode`, …) placed before them are meaningful
 * and must be forwarded ({@link resolveCliArgv}, #2970). Every other subcommand
 * parses only its own flags.
 */
export declare const LAUNCH_FLAG_COMMANDS: Record<string, true>;
/**
 * Decide what the CLI runner should do with raw argv: reject bare reserved
 * management words, pass help/version through untouched, route a recognized
 * subcommand (even behind leading global flags like `--approval-mode=yolo`) to
 * that command, and forward everything else to `launch` (#2970). Leading
 * launch-global flags are forwarded to launch-shaped commands but stripped for
 * other subcommands that cannot parse them (#8891).
 */
export declare function resolveCliArgv(argv: string[]): ResolvedCliArgv;
