/**
 * Date/cwd reminder injection.
 *
 * The system prompt must stay byte-stable so open-weight chat templates that
 * render tool schemas *after* the system content keep their prefix cache
 * (#7404). The per-request date/cwd line used to live at the tail of the
 * system prompt (`project-prompt.md`), which invalidated the whole tool array
 * on every directory change or day rollover. It now rides on the first user
 * turn of each provider request instead: built at request time (never stored
 * in the session), deterministic per `(date, cwd)`, so the bytes are stable
 * for the lifetime of a session/day and refresh automatically at midnight.
 */
import type { Context, Message } from "@oh-my-pi/pi-ai";
/** Renders the reminder text for the given local calendar date and cwd. */
export declare function renderDateCwdReminder(date: string, cwd: string): string;
export declare function injectDateCwdReminder(messages: Message[], reminder: string): Message[];
/**
 * Applies the date/cwd reminder to a provider `Context`, keeping the system
 * prompt byte-stable for prompt caching. Skips NULL_PROMPT-style contexts
 * (empty system prompt) so a no-prompt session stays byte-for-byte unchanged.
 */
export declare function withDateCwdReminder(context: Context, date: string, cwd: string): Context;
