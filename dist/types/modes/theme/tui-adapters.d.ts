import type { EditorTheme, MarkdownTheme, SelectListTheme, SettingsListTheme, SymbolTheme } from "@oh-my-pi/pi-tui";
import type { SlashCommandIconName } from "./symbols.js";
import type { Theme } from "./theme-class.js";
/**
 * Highlight code with syntax coloring based on file extension or language.
 * Returns array of highlighted lines.
 */
export declare function highlightCode(code: string, lang?: string, highlightTheme?: Theme): string[];
export declare function getSymbolTheme(): SymbolTheme;
export declare function setMarkdownMermaidRendering(enabled: boolean): void;
export declare function getMarkdownTheme(): MarkdownTheme;
export declare function getSelectListTheme(): SelectListTheme;
/**
 * Resolve the autocomplete type-indicator glyph for a slash command.
 * Returns `undefined` when no theme is initialized or the active preset is
 * ASCII (shared `icon.*` glyphs have ASCII forms, but a partially lettered
 * icon column reads as noise), which collapses the column entirely.
 */
export declare function getSlashCommandTypeIcon(name: SlashCommandIconName): string | undefined;
export declare function getEditorTheme(): EditorTheme;
export declare function getSettingsListTheme(): SettingsListTheme;
