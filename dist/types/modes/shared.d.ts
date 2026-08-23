import type { TabBarTheme } from "@oh-my-pi/pi-tui";
/** Sanitize text for display in a single-line status. Strips ANSI/VT escape sequences, maps remaining C0/C1 control characters to spaces, collapses whitespace, trims. */
export declare function sanitizeStatusText(text: string): string;
/** Shared tab bar theme used by fullscreen overlays (settings, agent hub). */
export declare function getTabBarTheme(): TabBarTheme;
/**
 * Suffix appended to the loader's working message to remind users they can
 * abort with Esc. Rendered with the active theme's bracket glyphs so it stays
 * visually consistent with badges and other bracketed UI affordances.
 *
 * The leading space separates the hint from the message body and is consumed
 * by `endsWith`/`slice` matching in the loader renderer.
 */
export declare function interruptHint(): string;
export { parseCommandArgs } from "../utils/command-args.js";
