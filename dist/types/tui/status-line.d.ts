/**
 * Standardized status header rendering for tool output.
 */
import type { Theme, ThemeColor } from "../modes/theme/theme.js";
import type { ToolUIStatus } from "../tools/render-utils.js";
export interface StatusLineOptions {
    icon?: ToolUIStatus;
    /** Pre-rendered glyph that replaces the status icon (e.g. a magnifier for
     * search-family tools). Takes precedence over `icon`. */
    iconOverride?: string;
    spinnerFrame?: number;
    title: string;
    titleColor?: ThemeColor;
    description?: string;
    badge?: {
        label: string;
        color: ThemeColor;
    };
    meta?: string[];
}
export declare function renderStatusLine(options: StatusLineOptions, theme: Theme): string;
