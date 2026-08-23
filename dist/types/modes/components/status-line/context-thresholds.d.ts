import type { ThemeColor } from "../../../modes/theme/theme.js";
export type ContextUsageLevel = "normal" | "warning" | "purple" | "error";
export declare function getContextUsageLevel(contextPercent: number, contextWindow: number): ContextUsageLevel;
/**
 * Format context usage as `<percent>%/<window>` when the model window is known.
 * Unknown windows render as `<tokens>/?`, because `0.0%/0` suggests a real
 * empty context instead of missing provider metadata.
 */
export declare function formatContextUsage(contextPercent: number | null | undefined, contextWindow: number, usedTokens?: number): string;
export declare function getContextUsageThemeColor(level: ContextUsageLevel): ThemeColor;
