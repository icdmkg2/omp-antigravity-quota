/**
 * Converts raw user text into bounded, low-noise input for tiny models.
 *
 * Tiny models copy literal noise verbatim and lose the task when only the head
 * of a long message survives. The shared pipeline strips ANSI escapes, paired
 * XML/tool envelopes, full commit hashes, and fenced code blocks, then preserves
 * both ends with an explicit omission marker. Title generation, auto-thinking,
 * and the title benchmark MUST use this same policy.
 */
/** Maximum characters emitted by {@link preprocessTinyMessage}. */
export declare const MAX_TINY_MESSAGE_CHARS = 2000;
/** Drop SGR ANSI escape sequences. */
export declare function stripAnsi(message: string): string;
/**
 * Remove paired XML/HTML-ish blocks (`<user>…</user>`, `<think>…</think>`,
 * tool envelopes). Self-closing and unpaired inline tags (`<Header/>`, a lone
 * `<div>`) are left in place — only fully paired blocks, whose contents would
 * otherwise dominate the title, are dropped.
 */
export declare function stripXmlBlocks(message: string): string;
/** Truncate full commit-hash-like hex runs (≥12 chars) to a short 7-char prefix. */
export declare function shortenHashes(message: string): string;
/**
 * Middle-truncate cleaned text, preserving 2/3 of the available space from the
 * head and 1/3 from the tail. The omission marker counts toward the bound.
 */
export declare function truncateTinyMessage(message: string): string;
/**
 * Strip fenced code blocks from a message before titling.
 *
 * Small title models latch onto literal text inside code blocks — e.g. a pasted
 * UI mockup containing "Welcome to Claude Code v2.1.158" yields that string as
 * the title instead of the surrounding intent. Removing fenced blocks leaves the
 * prose that actually describes the task. Inline code (single backticks) is kept
 * — it is short, high-signal context like `/login`.
 *
 * Falls back to the original message when stripping leaves too little to title
 * (a message that is essentially just a code block).
 */
export declare function stripCodeBlocks(message: string): string;
/** Clean noise from message content without applying the length bound. */
export declare function cleanTinyMessage(message: string): string;
/** Apply the shared tiny-model cleanup and middle-truncation policy. */
export declare function preprocessTinyMessage(message: string): string;
/** True when `message` is a preformatted replan context from
 *  {@link formatTitleConversationContext} — already cleaned per turn and
 *  bounded, so it must bypass {@link preprocessTinyMessage} (whose paired-tag
 *  stripping would consume the entire envelope). */
export declare function isPreformattedChatContext(message: string): boolean;
/** Drop the `<chat>`/`<user>`/`<assistant>`/`<think>` scaffolding, keeping turn
 *  text. Used for token-level signal checks on preformatted contexts. */
export declare function stripChatScaffolding(message: string): string;
/** Wrap a preprocessed user message for title generation. Preformatted replan
 *  contexts pass through untouched. */
export declare function formatTitleUserMessage(message: string): string;
/** One recent conversation turn supplied to title refresh after replanning. */
export interface TitleConversationTurn {
    role: "user" | "assistant";
    text?: string;
    thinking?: string;
}
/** Format preprocessed recent context for title generation after a todo replan. */
export declare function formatTitleConversationContext(turns: readonly TitleConversationTurn[]): string;
