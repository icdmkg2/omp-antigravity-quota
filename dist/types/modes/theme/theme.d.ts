import type { Terminal } from "@oh-my-pi/pi-tui";
import type { ThemeColor } from "./schema.js";
import type { SymbolPreset } from "./symbols.js";
import type { Theme } from "./theme-class.js";
export { getLanguageFromPath, isMarkdownPath } from "../../utils/lang-from-path.js";
export { getAvailableThemes, getAvailableThemesWithPaths, getThemeByName, type ThemeInfo } from "./loader.js";
export { isValidThemeColor, type ThemeBg, type ThemeColor } from "./schema.js";
export { getAvailableSymbolPresets, isValidSymbolPreset, type SpinnerType, type SymbolKey, type SymbolPreset, } from "./symbols.js";
export { Theme } from "./theme-class.js";
export { getEditorTheme, getMarkdownTheme, getSelectListTheme, getSettingsListTheme, getSymbolTheme, highlightCode, setMarkdownMermaidRendering, } from "./tui-adapters.js";
export declare var theme: Theme;
/** Get the name of the currently active theme. */
export declare function getCurrentThemeName(): string | undefined;
/** Returns unstyled `text` before `initTheme()` assigns the global theme; use only for early-render paths. */
export declare function fgOrPlain(color: ThemeColor, text: string, styledText?: string): string;
export interface ThemeChangeEvent {
    /** Preview/presentation-only changes should repaint live UI without replacing native scrollback. */
    ephemeral?: boolean;
}
/** Initialize the active theme synchronously before the first terminal paint. */
export declare function initThemeSync(symbolPreset?: SymbolPreset, colorBlindMode?: boolean, darkTheme?: string, lightTheme?: string): void;
/** Initialize the default theme only when no earlier prepaint initialized one. */
export declare function ensureTheme(): Promise<void>;
export declare function initTheme(enableWatcher?: boolean, symbolPreset?: SymbolPreset, colorBlindMode?: boolean, darkTheme?: string, lightTheme?: string): Promise<void>;
export declare function setTheme(name: string, enableWatcher?: boolean): Promise<{
    success: boolean;
    error?: string;
}>;
export declare function previewTheme(name: string, event?: ThemeChangeEvent): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Enable auto-detection mode, switching to the appropriate dark/light theme.
 */
export declare function enableAutoTheme(event?: ThemeChangeEvent): void;
/**
 * Update the theme mappings for auto-detection mode.
 * When a dark/light mapping changes and auto-detection is active, re-evaluate the theme.
 */
export declare function setAutoThemeMapping(mode: "dark" | "light", themeName: string): void;
/**
 * Called when the terminal detects a dark/light appearance change.
 * The terminal layer queries OSC 11 (background color) and computes luminance;
 * Mode 2031 notifications trigger re-queries rather than providing the value directly.
 */
export declare function onTerminalAppearanceChange(mode: "dark" | "light", event?: ThemeChangeEvent): void;
export declare function setThemeInstance(themeInstance: Theme): void;
/**
 * Set the symbol preset override, recreating the theme with the new preset.
 */
export declare function setSymbolPreset(preset: SymbolPreset): Promise<void>;
/**
 * Get the current symbol preset override.
 */
export declare function getSymbolPresetOverride(): SymbolPreset | undefined;
/**
 * Set color blind mode, recreating the theme with the new setting.
 * When enabled, uses blue instead of green for diff additions.
 */
export declare function setColorBlindMode(enabled: boolean): Promise<void>;
/**
 * Get the current color blind mode setting.
 */
export declare function getColorBlindMode(): boolean;
export declare function onThemeChange(callback: (event: ThemeChangeEvent) => void): () => void;
/**
 * Monotonic counter bumped on any theme-affecting change that should invalidate
 * cached renders: theme swaps and reloads (including the invalid-theme dark
 * fallback), theme previews, symbol-preset changes, and color-blind-mode
 * changes — everything that routes through {@link notifyThemeChange}. Consumers
 * key cached renders on it so the next render re-shapes their output.
 */
export declare function getThemeEpoch(): number;
type MacOSAppearanceReprobeTerminal = Pick<Terminal, "appearance" | "onAppearanceChange" | "onAppearanceReport" | "onPrivateModeReport" | "refreshAppearance">;
/**
 * Fall back to native macOS appearance notifications when the terminal
 * explicitly confirms that Mode 2031 notifications are unsupported.
 *
 * Native notifications provisionally repaint from the host appearance and
 * synchronously trigger an OSC 11 probe, followed by a bounded burst of six
 * retries. A changed terminal classification cancels the sequence; otherwise
 * a confirmed terminal classification is restored at the validation deadline.
 */
export declare function startMacOSAppearanceReprobeFallback(terminal: MacOSAppearanceReprobeTerminal): () => void;
export declare function stopThemeWatcher(): void;
/**
 * Get resolved theme colors as CSS-compatible hex strings.
 * Used by HTML export to generate CSS custom properties.
 */
export declare function getResolvedThemeColors(themeName?: string): Promise<Record<string, string>>;
/**
 * Check if a theme is a "light" theme by analyzing its status-line background
 * luminance. Loads theme JSON synchronously (built-in or custom file on disk)
 * for callers in synchronous flows (settings migration, setup wizard).
 */
export declare function isLightTheme(themeName?: string): boolean;
/**
 * Get explicit export colors from theme JSON, if specified.
 * Returns undefined for each color that isn't explicitly set.
 */
export declare function getThemeExportColors(themeName?: string): Promise<{
    pageBg?: string;
    cardBg?: string;
    infoBg?: string;
}>;
