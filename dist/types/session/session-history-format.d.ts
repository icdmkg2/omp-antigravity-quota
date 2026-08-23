import type { ImageContent, TextContent, ToolResultMessage } from "@oh-my-pi/pi-ai";
export interface HistoryFormatOptions {
    /** Optional H1 prepended to the transcript. */
    title?: string;
    /** Render assistant thinking blocks (default: elided). */
    includeThinking?: boolean;
    /** Render tool intent comment before tool call lines. */
    includeToolIntent?: boolean;
    /** Render watched-session roles as inline `**agent**:` / `**user**:` labels (collapsing consecutive same-role messages) instead of `## ` headings, so a primary transcript embedded inside an advisor turn stays visually distinct. */
    watchedRoles?: boolean;
    /**
     * Expand the primary agent's injected constraint context — plan mode's rules
     * (`plan-mode-context`) and the approved plan it implements
     * (`plan-mode-reference`) — verbatim instead of as a truncated one-liner,
     * wrapped in a `<primary-context>` tag so a reviewer reads it as the primary's
     * instructions, not its own. The advisor sets this: a truncated rule (plan
     * mode's "NEVER create files … except the plan file") makes it raise false
     * blockers. See {@link PRIMARY_CONTEXT_CUSTOM_TYPES}. Other custom messages
     * still collapse to a one-liner.
     */
    expandPrimaryContext?: boolean;
    /**
     * Append the full unified diff (from a tool result's `details.diff`) below
     * edit/apply_patch tool lines, instead of just the path. The advisor sets
     * this so it sees what changed without re-reading the file.
     */
    expandEditDiffs?: boolean;
    /**
     * Chunked rendering support: a caller formatting one logical transcript in
     * several calls (the advisor's chunked delta render) passes a result index
     * built over the WHOLE delta plus one shared consumed-id set, so a toolCall
     * finds its toolResult across chunk boundaries and the result is never
     * re-rendered as an orphan in a later chunk.
     */
    toolResultIndex?: ReadonlyMap<string, ToolResultMessage>;
    consumedToolCallIds?: Set<string>;
    /**
     * Chunked rendering state: a mutable holder for the watched-role label
     * (`**user**:` / `**agent**:`) that ended the previous chunk. Lets a caller
     * formatting one logical transcript across several calls (advisor
     * multi-message split) keep consecutive same-role collapsing byte-identical
     * to the single-block render: pass one object across all chunk calls.
     */
    watchedRoleState?: {
        lastLabel: string | undefined;
    };
}
export declare function formatExecutionSourcePreview(source: string): string;
/** Pick the most informative scalar argument of a tool call. */
export declare function formatToolCallPrimaryArg(name: string, args: Record<string, unknown> | undefined): string;
export declare function formatToolCallIntentPreview(args: Record<string, unknown> | undefined): string | undefined;
export declare function formatToolResultErrorPreview(content: string | readonly (TextContent | ImageContent)[]): string;
/**
 * Hidden custom messages that inject the primary agent's operative *constraints*
 * — plan mode's rules and the approved plan it implements. A reviewer (the
 * advisor) must read these verbatim; truncating them hides load-bearing
 * exceptions (e.g. plan mode permits exactly one plan file). Every other custom
 * type stays a one-liner.
 *
 * Deliberately excludes `goal-mode-context`: its body carries live budget
 * counters (tokens/seconds used) that change every turn, so it can neither be
 * deduped against a prior copy nor expanded each turn without flooding the
 * reviewer — and its constraints don't drive the file-write misreads this
 * targets.
 */
export declare const PRIMARY_CONTEXT_CUSTOM_TYPES: ReadonlySet<string>;
/**
 * Format a session's message array as a concise markdown transcript.
 *
 * `messages` is the session's in-memory message array (or the read-only
 * equivalent loaded from a session file) — the same shapes
 * `session-dump-format.ts` consumes.
 */
export declare function formatSessionHistoryMarkdown(messages: unknown[], opts?: HistoryFormatOptions): string;
