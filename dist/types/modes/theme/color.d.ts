import type { ColorMode, ColorValue } from "./schema.js";
/** Resolve theme color depth from the shared terminal capability model. */
export declare function detectColorMode(env?: NodeJS.ProcessEnv): ColorMode;
export declare function colorToAnsi(color: string, mode: ColorMode): string;
export declare function fgAnsi(color: string | number, mode: ColorMode): string;
export declare function bgAnsi(color: string | number, mode: ColorMode): string;
export declare function resolveVarRefs(value: ColorValue, vars: Record<string, ColorValue>, visited?: Set<string>): string | number;
export declare function resolveThemeColors<T extends Record<string, ColorValue>>(colors: T, vars?: Record<string, ColorValue>): Record<keyof T, string | number>;
/**
 * Resolve a theme color value (hex string or 256-color index) to a CSS hex string.
 * Empty string represents the default terminal color.
 */
export declare function resolveToHex(value: string | number, isLight: boolean): string;
/**
 * Convert a 256-color index to hex string.
 * Indices 0-15: basic colors (approximate)
 * Indices 16-231: 6x6x6 color cube
 * Indices 232-255: grayscale ramp
 */
export declare function ansi256ToHex(index: number): string;
