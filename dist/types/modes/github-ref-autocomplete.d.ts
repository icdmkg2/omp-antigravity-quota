/**
 * Autocomplete for GitHub issue/PR references typed as `#<number>` (e.g. `#3164`).
 *
 * Mirrors the `@` file-reference and `scheme://` internal-url conventions: the
 * token is rewritten to an internal URL (`pr://3164` or `issue://3164`) plus a
 * trailing space, and the existing tool-mediated pipeline (the `read` tool →
 * InternalUrlRouter → `gh`) resolves it from the session cwd's git remote.
 *
 * No network at suggestion time — candidates are generated locally. GitHub
 * shares the issue/PR number space and there is no cheap way to tell which a
 * given number is while typing, so both a PR and an Issue candidate are offered
 * by default. Naming the type first (`pr #3164` / `issue #3164`) constrains the
 * candidates to that kind. Anything that is not a standalone `#<number>` token
 * keeps falling through to the existing prompt-action menu.
 */
import type { AutocompleteItem } from "@oh-my-pi/pi-tui";
export interface GithubRefContext {
    /** Text to replace on accept: `#3164`, or `pr #3164` when a qualifier precedes it. */
    prefix: string;
    /** Type the user named (`pr`/`pull` → `pr`, `issue` → `issue`), or null to offer both. */
    qualifier: "pr" | "issue" | null;
    /** The numeric reference, e.g. `3164`. */
    number: string;
}
export declare function getGithubRefContext(textBeforeCursor: string): GithubRefContext | null;
/**
 * Suggestions for a `#<number>` token. Both kinds are offered unless the user
 * named a type (`pr #3164` / `issue #3164`), in which case only that kind is
 * offered. Returns `null` when the text before the cursor is not a standalone
 * `#<number>` token.
 */
export declare function getGithubRefSuggestions(textBeforeCursor: string): {
    items: AutocompleteItem[];
    prefix: string;
} | null;
