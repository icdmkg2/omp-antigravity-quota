import type { Theme } from "../modes/theme/theme.js";
/** Max depth for JSON tree rendering */
export declare const JSON_TREE_MAX_DEPTH_COLLAPSED = 2;
export declare const JSON_TREE_MAX_DEPTH_EXPANDED = 6;
export declare const JSON_TREE_MAX_LINES_COLLAPSED = 6;
export declare const JSON_TREE_MAX_LINES_EXPANDED = 200;
export declare const JSON_TREE_SCALAR_LEN_COLLAPSED = 60;
export declare const JSON_TREE_SCALAR_LEN_EXPANDED = 2000;
/**
 * Format a scalar value for inline display.
 */
export declare function formatScalar(value: unknown, maxLen: number): string;
/**
 * Format args inline for collapsed view.
 */
export declare function formatArgsInline(args: Record<string, unknown>, maxWidth: number): string;
/**
 * Render a JSON value as tree lines.
 */
export declare function renderJsonTreeLines(value: unknown, theme: Theme, maxDepth: number, maxLines: number, maxScalarLen: number): {
    lines: string[];
    truncated: boolean;
};
