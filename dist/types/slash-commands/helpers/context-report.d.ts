import type { SlashCommandRuntime } from "../types.js";
/**
 * Build the `/context` ACP-mode text. Tries the rich breakdown first
 * (categories + auto-compact buffer + free slack) and falls back to the
 * minimal "window/used" lines when the breakdown helper throws.
 */
export declare function buildContextReportText(runtime: SlashCommandRuntime): string;
