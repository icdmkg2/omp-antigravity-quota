/**
 * Slash-command usage counts backing frequency-ranked autocomplete.
 *
 * Persisted in agent.db's `command_usage` table (see {@link AgentStorage}),
 * keyed by canonical command name (builtin primary name, `skill:<name>`,
 * custom/file/template name). {@link InputController} records a hit on every
 * submitted known command; `CombinedAutocompleteProvider` reads the in-memory
 * counts synchronously to break text-match-score ties.
 *
 * Until {@link loadSlashCommandUsage} resolves, hits stay in memory only —
 * headless paths and tests that never initialize the store never open agent.db.
 */
/** Load persisted usage counts once per process; concurrent calls share one read. */
export declare function loadSlashCommandUsage(): Promise<void>;
/** Usage count for a command name; ranks equal-score autocomplete matches. */
export declare function getSlashCommandUsage(name: string): number;
/** Increment a command's usage count; persists when the store is loaded. */
export declare function recordSlashCommandUsage(name: string): void;
/** Test-only: reset in-memory usage state. */
export declare function __resetSlashCommandUsageForTests(): void;
