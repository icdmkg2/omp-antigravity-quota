/**
 * Autocomplete for internal-url schemes (skill://, rule://, omp://, local://,
 * memory://, agent://, artifact://) while composing a prompt.
 *
 * Detection here MUST stay in sync with the generic URL-scheme trigger in the
 * TUI editor (`packages/tui/src/components/editor.ts`); the editor fires the
 * popup, this module decides whether there are candidates to show.
 */
import type { AutocompleteItem } from "@oh-my-pi/pi-tui";
export interface InternalUrlContext {
    /** Lowercased scheme (e.g. `local`). */
    scheme: string;
    /** Text typed after the slashes so far (host + path); may be empty. */
    query: string;
    /** Exact buffer token from its boundary to the cursor (the completion prefix). */
    token: string;
}
/**
 * Detect a completable internal-url token immediately before the cursor.
 * Returns `null` when the text is not a `scheme://` token whose scheme is
 * registered with a completion-capable handler.
 */
export declare function extractInternalUrlContext(textBeforeCursor: string): InternalUrlContext | null;
/**
 * Suggestions for the internal-url token ending at the cursor, or `null` when
 * the text is not such a token or no candidate matches the typed query.
 */
export declare function getInternalUrlSuggestions(textBeforeCursor: string, cwd?: string, signal?: AbortSignal): Promise<{
    items: AutocompleteItem[];
    prefix: string;
} | null>;
/** Whether `prefix` (the token a completion was offered for) is an internal-url token. */
export declare function isInternalUrlPrefix(prefix: string): boolean;
/**
 * Replace the internal-url token with the selected candidate, appending a
 * trailing space (matching `@` file-reference behavior) so the user can keep
 * typing.
 */
export declare function applyInternalUrlCompletion(lines: string[], cursorLine: number, cursorCol: number, item: AutocompleteItem, prefix: string): {
    lines: string[];
    cursorLine: number;
    cursorCol: number;
};
