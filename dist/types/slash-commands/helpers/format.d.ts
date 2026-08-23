import { type Theme } from "../../modes/theme/theme.js";
/** Format a millisecond duration as a coarse-grained human label. */
export declare function formatDuration(ms: number): string;
type ProgressBarTheme = Pick<Theme, "bold" | "fg" | "getFgAnsi">;
/**
 * Render an ASCII progress bar with a trailing percent label.
 * `fraction` is clamped to `[0, 1]`. `undefined` renders a dotted placeholder.
 */
export declare function renderAsciiBar(fraction: number | undefined, width?: number, uiTheme?: ProgressBarTheme): string;
export {};
