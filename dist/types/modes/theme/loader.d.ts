import { type ColorMode, type ThemeJson } from "./schema.js";
import { type SymbolPreset } from "./symbols.js";
import { Theme } from "./theme-class.js";
export declare function getBuiltinThemes(): Record<string, ThemeJson>;
export declare function getAvailableThemes(): Promise<string[]>;
export interface ThemeInfo {
    name: string;
    path: string | undefined;
}
export declare function getAvailableThemesWithPaths(): Promise<ThemeInfo[]>;
export declare function loadThemeJson(name: string): Promise<ThemeJson>;
/** Load a theme definition synchronously for the first terminal frame. */
export declare function loadThemeJsonSync(name: string): ThemeJson;
export interface CreateThemeOptions {
    mode?: ColorMode;
    symbolPresetOverride?: SymbolPreset;
    colorBlindMode?: boolean;
}
export declare function createTheme(themeJson: ThemeJson, options?: CreateThemeOptions): Theme;
export declare function loadTheme(name: string, options?: CreateThemeOptions): Promise<Theme>;
/** Load and construct a theme synchronously for latency-sensitive first paint. */
export declare function loadThemeSync(name: string, options?: CreateThemeOptions): Theme;
export declare function getThemeByName(name: string): Promise<Theme | undefined>;
