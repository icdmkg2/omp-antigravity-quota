import { type FileEntry } from "./session-entries.js";
/** Generate a unique short ID (8 hex chars, collision-checked) */
export declare function generateId(byId: {
    has(id: string): boolean;
}): string;
/**
 * Run all necessary migrations to bring entries to current version.
 * Mutates entries in place. Returns true if any migration was applied.
 */
export declare function migrateToCurrentVersion(entries: FileEntry[]): boolean;
/** Exported for testing */
export declare function migrateSessionEntries(entries: FileEntry[]): void;
