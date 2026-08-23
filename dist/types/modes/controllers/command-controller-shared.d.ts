import type { SourceMeta } from "../../capability/types.js";
import type { InteractiveModeContext } from "../types.js";
export type ScopeValue = "project" | "user";
export type ScopeFlagResult = {
    ok: true;
    scope: ScopeValue;
} | {
    ok: false;
    error: string;
};
/**
 * Validate the value following a `--scope` flag.
 */
export declare function readScopeFlag(value: string | undefined): ScopeFlagResult;
export type RemoveArgs = {
    name: string | undefined;
    scope: ScopeValue;
};
export type ParseRemoveResult = {
    ok: true;
    value: RemoveArgs;
} | {
    ok: false;
    error: string;
};
/**
 * Parse the argument tail of `/<cmd> remove <name> [--scope project|user]`.
 *
 * `rest` is the text after the subcommand keyword. The caller is responsible
 * for emitting the command-specific "<entity> name required" usage hint when
 * `value.name` is undefined.
 */
export declare function parseRemoveArgs(rest: string): ParseRemoveResult;
/**
 * Group capability-loaded items by their source provider+path, yielding each
 * group with a display-ready `shortPath`.
 */
export declare function groupBySource<T>(items: Iterable<T>, getSource: (item: T) => SourceMeta): Iterable<{
    providerName: string;
    shortPath: string;
    items: T[];
}>;
/**
 * Render a message block (DynamicBorder / Text / DynamicBorder) into the chat
 * container and request a render.
 */
export declare function showCommandMessage(ctx: InteractiveModeContext, text: string): void;
