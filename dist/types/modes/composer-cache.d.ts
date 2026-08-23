import type { LspServerInfo, RecentSession } from "./components/welcome.js";
import type { ComposerPreferences } from "./composer.js";
import type { SymbolPreset } from "./theme/theme.js";
/** Theme inputs cached from the last resolved settings load for stable prepaint colors. */
export interface ComposerThemePreferences {
    readonly symbolPreset?: SymbolPreset;
    readonly colorBlindMode?: boolean;
    readonly darkTheme?: string;
    readonly lightTheme?: string;
}
/** Last authoritative model labels shown in the welcome component. */
export interface ComposerWelcomeCache {
    readonly modelName: string;
    readonly providerName: string;
}
/** Speculative composer state read before the settings/session graph is available. */
export interface ComposerStartupCache {
    readonly preferences?: ComposerPreferences;
    readonly theme?: ComposerThemePreferences;
    readonly welcome?: ComposerWelcomeCache;
    readonly recentSessions: RecentSession[];
    readonly lspServers: LspServerInfo[];
}
/** Read all speculative composer caches synchronously before the first terminal paint. */
export declare function readComposerStartupCache(cwd: string): ComposerStartupCache;
/** Persist resolved theme and composer settings for the next prepaint. */
export declare function writeComposerUiCache(cwd: string, preferences: ComposerPreferences, theme: ComposerThemePreferences): Promise<void>;
/** Persist authoritative model/provider labels for the next welcome prepaint. */
export declare function writeComposerWelcomeCache(cwd: string, welcome: ComposerWelcomeCache): Promise<void>;
/** Persist the latest recent-session rows as a compact JSONL speculation cache. */
export declare function writeComposerRecentSessionsCache(cwd: string, sessions: readonly RecentSession[]): Promise<void>;
/** Persist the latest detected project LSP rows for the next prepaint. */
export declare function writeComposerLspCache(cwd: string, servers: readonly LspServerInfo[]): Promise<void>;
