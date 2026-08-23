import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
export declare function canonicalizeMessage(text: string | null | undefined): string;
/**
 * Thinking text prepared for display. Both modes drop empty `<!-- -->`
 * sentinel lines outside code fences (see {@link isCommentNoise}); prose-only
 * mode additionally elides fenced code down to a trailing ellipsis.
 */
export declare function formatThinkingForDisplay(text: string, proseOnly: boolean): string;
/** Whether a formatted thinking block has non-placeholder content worth rendering. */
export declare function hasDisplayableThinking(text: string | null | undefined, formattedText: string | null | undefined): boolean;
/** Whether an assistant message contains thinking content the TUI can reveal. */
export declare function messageHasDisplayableThinking(message: AgentMessage, proseOnly: boolean): boolean;
