import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import { BlobStore } from "./blob-store.js";
import type { FileEntry } from "./session-entries.js";
import { type SessionStorage } from "./session-storage.js";
import { type SessionTitleUpdate } from "./session-title-slot.js";
export interface VisitEntriesFromFileStreamOptions {
    /** Stop after the visitor returns `false`. */
    shouldContinue?: () => boolean;
    /** Stop after this many valid or malformed JSONL records have been consumed. */
    maxRecords?: number;
    /** Yield to the macrotask queue after this many bytes have been consumed. */
    yieldEveryBytes?: number;
    /** Yield to the macrotask queue after this many entries have been visited. */
    yieldEveryEntries?: number;
    /** Called once for every malformed JSONL record skipped by the stream. */
    onMalformedRecord?: () => void;
}
/** Parsed session entries plus corruption metadata needed by writable loaders. */
export interface SessionLoadResult {
    entries: FileEntry[];
    titleSlot: SessionTitleUpdate | undefined;
    malformedRecords: number;
}
/** Parse session JSONL while stripping and folding the optional fixed title slot. */
export declare function parseSessionContent(content: string): SessionLoadResult;
/** Parse session JSONL and visit each entry without retaining prior entries. */
export declare function visitEntriesFromFileStream(filePath: string, visit: (entry: FileEntry) => void | boolean, options?: VisitEntriesFromFileStreamOptions): Promise<SessionTitleUpdate | undefined>;
/** Exported for testing — the ≥8MiB streaming path (works on any file size). */
export declare function loadEntriesFromFileStream(filePath: string): Promise<SessionLoadResult>;
/** Exported for compaction.test.ts */
export declare function parseSessionEntries(content: string): FileEntry[];
/** Load and validate a session while retaining malformed-record diagnostics. */
export declare function loadSessionFile(filePath: string, storage?: SessionStorage): Promise<SessionLoadResult>;
/** Load the valid entries from a session file, skipping malformed records. */
export declare function loadEntriesFromFile(filePath: string, storage?: SessionStorage): Promise<FileEntry[]>;
/**
 * Visit session entries, using bounded streaming for large file-backed journals.
 * Small files and non-file backends keep the existing full-load path.
 */
export declare function visitEntriesFromFile(filePath: string, visit: (entry: FileEntry) => void | boolean, storage?: SessionStorage): Promise<void>;
export declare function resolveBlobRefsInEntries(entries: FileEntry[], blobStore: BlobStore): Promise<void>;
/**
 * Read-only transcript view of a session file: load entries, migrate to the
 * current version, resolve blob refs, and build the display transcript along
 * the persisted leaf path (last entry). Uses transcript mode (collapsed to the
 * latest compaction) so failed/aborted tail turns stay visible, unlike the
 * provider-context builder which drops them. Does NOT create a writer or take
 * the session lock — safe to call against a file another session is writing.
 */
export declare function loadSessionMessagesReadOnly(filePath: string): Promise<AgentMessage[]>;
