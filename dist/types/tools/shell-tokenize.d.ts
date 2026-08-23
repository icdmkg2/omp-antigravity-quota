/**
 * Conservative shell command tokenizer shared by the bash approval-pattern
 * matcher and the gh-cache invalidator.
 *
 * Splits a bash command into independent command segments, each a list of word
 * tokens. Handles single/double-quoted strings, backslash escapes, and the
 * standard operators (`;`, `&&`, `||`, `|`, `&`, `(`, `)`, newlines) as segment
 * boundaries so callers treat the pieces as independent command sequences.
 *
 * It is deliberately not a full POSIX parser — heredocs, command substitution,
 * and arithmetic expansion are out of scope; callers fall through when they
 * cannot find the structure they need.
 */
export declare function tokenizeShellSegments(command: string): string[][];
/**
 * A flat shell command segment with the context needed to decide interception.
 *
 * @see extractFlatShellCommandSegments
 */
interface FlatShellCommandSegment {
    /** Original segment text with quoting and escaping preserved. */
    text: string;
    /**
     * True when this segment consumes the previous stage's stdout via an
     * unquoted `|` or `|&`. Blank and comment-only continuation lines preserve
     * the pending pipe state. Such a stage reads piped stdin, so path-based
     * dedicated tools (read/grep/glob) cannot replace it. `||`, `;`, `&`, and
     * `&&` start an independent command and leave this false.
     */
    pipedStdin: boolean;
}
/**
 * Returns the flat shell command segments with the original text of each. Unlike
 * `tokenizeShellSegments`, this preserves quoting and escaping so the results
 * are safe to match against user-configured regular expressions, and flags
 * segments that receive piped stdin.
 *
 * The extractor deliberately declines to split syntax whose execution context
 * cannot be determined with this small scanner (heredocs, command substitution,
 * backticks, grouping, and malformed quoting). Callers must still check the
 * complete input in that case.
 */
export declare function extractFlatShellCommandSegments(command: string): FlatShellCommandSegment[];
/**
 * Parses a leading `cd <path> && ...` prefix so the bash tool can route the
 * target through its structured `cwd` parameter when the model omits it.
 *
 * Returns the single path token (quotes and backslash escapes resolved to their
 * literal value) and the command remainder after the top-level `&&`, or `null`
 * when the command does not begin with exactly `cd`, one path token, and a
 * top-level `&&`. The scanner deliberately bails on anything else in the prefix
 * — redirects (`cd /tmp 2>/dev/null && ...`), extra arguments, or paths needing
 * shell expansion (`$`, backticks, `(`) — leaving the whole command for the
 * shell instead of absorbing shell syntax into `cwd`.
 */
export declare function extractLeadingCdTarget(command: string): {
    path: string;
    rest: string;
} | null;
export {};
