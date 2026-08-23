import type { SlashCommandRuntime } from "../types.js";
/**
 * Build the `/usage` ACP-mode text. Prefers provider-reported limits when the
 * session exposes `fetchUsageReports`; otherwise falls back to the local
 * session-manager tallies.
 */
export declare function buildUsageReportText(runtime: SlashCommandRuntime): Promise<string>;
