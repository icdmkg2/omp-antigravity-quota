/**
 * Shell-completion generation (bash, zsh, fish).
 *
 * Single source of truth: the declarative `flags`/`args` descriptors carried by
 * each `Command` subclass plus the registered subcommand table. {@link buildSpec}
 * walks that metadata — the same data `renderCommandBody` renders for `--help` —
 * and {@link generateCompletion} emits a self-contained completion script. Adding
 * a flag to a command's static `flags` therefore propagates into completions with
 * no edits here.
 *
 * Static candidates (enum `options`, the builtin tool list) are baked into the
 * script. A small set of flags resolve dynamic candidates (the live model
 * catalog and on-disk sessions) by calling back into `<bin> __complete <kind>`
 * — see `commands/complete.ts`. The flag→source mapping below is the only manual
 * knob and is keyed by flag name so it stays stable as flags are added.
 */
import type { CliConfig } from "@oh-my-pi/pi-utils/cli";
export type Shell = "bash" | "zsh" | "fish";
/** How a flag/positional value should be completed. */
export type ValueSource = {
    kind: "flag";
} | {
    kind: "value";
} | {
    kind: "enum";
    values: readonly string[];
} | {
    kind: "list";
    values: readonly string[];
} | {
    kind: "models";
    multiple: boolean;
} | {
    kind: "sessions";
} | {
    kind: "file";
} | {
    kind: "dir";
};
export interface CompletionFlag {
    /** Long name without the leading `--`. */
    name: string;
    /** Short character without the leading `-`. */
    char?: string;
    description: string;
    value: ValueSource;
    /** Flag may appear multiple times (oclif `multiple`). */
    repeatable: boolean;
}
export interface CompletionArg {
    name: string;
    description: string;
    value: ValueSource;
}
export interface CompletionCommand {
    name: string;
    aliases: readonly string[];
    description: string;
    flags: CompletionFlag[];
    args: CompletionArg[];
}
export interface CompletionSpec {
    bin: string;
    /** Flags/args of the default (no-subcommand) command. */
    root: {
        flags: CompletionFlag[];
        args: CompletionArg[];
    };
    commands: CompletionCommand[];
}
/**
 * Build a {@link CompletionSpec} from loaded command classes.
 *
 * @param rootName  Entry name of the default command (its flags become top-level
 *                  flags; it is excluded from the subcommand list).
 * @param aliasMap  Canonical-name → aliases (merged from the registration table
 *                  and the command class's static `aliases`).
 */
export declare function buildSpec(config: CliConfig, rootName: string, aliasMap: Map<string, readonly string[]>): CompletionSpec;
export declare function generateCompletion(shell: Shell, spec: CompletionSpec): string;
