import type { SettingValue } from "../config/settings.js";
export interface ChangelogEntry {
    major: number;
    minor: number;
    patch: number;
    content: string;
}
/** Number of changelog releases shown by automatic and default recent views. */
export declare const RECENT_CHANGELOG_ENTRY_LIMIT = 3;
/** Maximum Markdown source bytes allowed in automatic startup release notes. */
export declare const STARTUP_CHANGELOG_MAX_BYTES: number;
/** Hint appended when automatic startup release notes are truncated. */
export declare const STARTUP_CHANGELOG_FULL_HINT = "Use `/changelog full` to view the complete changelog.";
/** Markdown generated from selected changelog entries and whether it hit a size cap. */
export interface RenderedChangelog {
    markdown: string;
    truncated: boolean;
}
/** Automatic startup changelog decision, including whether the marker should advance. */
export interface StartupChangelogSelection {
    markdown: string | undefined;
    persistCurrentVersion: boolean;
    truncated: boolean;
    selectedEntries: number;
    totalUnseenEntries: number;
    latestVersion: string | undefined;
    changeCount: number;
    categoryCounts: Record<string, number>;
}
/** Format the compact, deterministic startup update notice. */
export declare function formatStartupChangelogSummary(selection: StartupChangelogSelection): string;
/**
 * Parse changelog entries from omp's package asset when available, falling back
 * to the copy embedded in compiled binaries.
 *
 * The embedded fallback keeps standalone binaries self-contained without
 * resolving relative to the host project's cwd, which caused issue #1423.
 */
export declare function resolveBundledChangelogPath(assetPath: string, moduleUrl: string | URL): string | URL;
export declare function parseChangelog(changelogPath: string | undefined): Promise<ChangelogEntry[]>;
/**
 * Parse an omp changelog marker version into comparable parts.
 */
export declare function parseChangelogVersion(version: string | undefined): ChangelogEntry | undefined;
/**
 * Get entries newer than lastVersion.
 */
export declare function getNewEntries(entries: ChangelogEntry[], lastVersion: string): ChangelogEntry[];
/**
 * Render changelog entries oldest-first by default and optionally cap the Markdown source size.
 */
export declare function renderChangelogEntries(entries: ChangelogEntry[], options?: {
    maxBytes?: number;
    truncationHint?: string;
    oldestFirst?: boolean;
}): RenderedChangelog;
/**
 * Select bounded release notes for interactive startup.
 */
export declare function selectStartupChangelog(entries: ChangelogEntry[], lastVersion: string | undefined, currentVersion: string): StartupChangelogSelection;
/**
 * Resolve and persist the automatic startup changelog decision.
 *
 * Hidden mode advances the marker only for an upgrade, so downgrades do not
 * erase knowledge of a newer version the user has already seen.
 */
export declare function resolveStartupChangelogForDisplay(options: {
    mode: SettingValue<"startup.changelogMode">;
    currentVersion: string;
    changelogPath?: string;
    agentDir?: string;
}): Promise<StartupChangelogSelection | undefined>;
export { getChangelogPath } from "../config.js";
/**
 * Last omp version whose changelog the user has seen. Stored as a plain-text
 * marker file (`~/.omp/agent/last-changelog-version`) rather than in
 * `config.yml`, so version bumps never dirty user-tracked config files.
 */
export declare function readLastChangelogVersion(agentDir?: string): Promise<string | undefined>;
/** Persist the last-seen changelog version marker. Best-effort: failures are logged, never thrown. */
export declare function writeLastChangelogVersion(version: string, agentDir?: string): Promise<void>;
