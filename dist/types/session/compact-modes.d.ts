/**
 * Manual `/compact` subcommands. Kept in a dependency-free leaf module so the
 * slash-command registry, the interactive controllers, and `AgentSession`
 * can all import the mode metadata + parser without pulling in the heavy
 * `agent-session` module graph (which would form an import cycle through the
 * slash-command registry) — same rationale as `shake-types.ts`.
 *
 * Each mode is a one-off override layered on top of the configured
 * `compaction.*` settings for a single invocation; it never mutates settings.
 * Adding a mode is a single entry here: the command surface (autocomplete +
 * ACP hint), the parser, and the engine override all read this table.
 */
import type { CompactionMethod } from "./compaction-methods.js";
/** Subcommand selecting a one-off compaction mode for manual `/compact`. */
export type CompactMode = "soft" | "remote" | "snapcompact";
/**
 * Per-invocation ordered methods merged over the configured
 * `compaction.methodOrder` for this run.
 */
export interface CompactionOverride {
    methodOrder?: CompactionMethod[];
}
export interface CompactModeDef {
    readonly name: CompactMode;
    /** One-line description surfaced in autocomplete + help. */
    readonly description: string;
    /** Settings overrides applied on top of `compaction.*` for this run. */
    readonly overrides: CompactionOverride;
    /**
     * When true, the mode produces no LLM summary, so trailing focus text is
     * meaningless and rejected by the parser (snapcompact archives history into
     * images without a directed summary).
     */
    readonly rejectsFocus?: boolean;
}
export declare const COMPACT_MODES: readonly CompactModeDef[];
/** Resolve a subcommand token (case-insensitive) to its mode definition. */
export declare function findCompactMode(name: string): CompactModeDef | undefined;
/** Parsed `/compact` arguments: an optional mode plus optional focus text. */
export interface ParsedCompactArgs {
    mode?: CompactMode;
    instructions?: string;
}
/**
 * Split `/compact` args into a leading mode subcommand + focus instructions.
 *
 * Backward compatible: when the first token is not a known mode, the entire
 * argument string is treated as focus instructions (the historical behavior).
 * A recognized mode with `rejectsFocus` and trailing text is an error.
 */
export declare function parseCompactArgs(args: string): ParsedCompactArgs | {
    error: string;
};
