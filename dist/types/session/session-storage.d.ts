import { type SessionTitleUpdate } from "./session-title-slot.js";
export interface SessionStorageStat {
    size: number;
    mtimeMs: number;
    mtime: Date;
}
export interface SessionStorageWriter {
    /**
     * Append one newline-terminated line.
     *
     * File and memory storage apply the line synchronously before the returned
     * promise settles, so a software crash after `append` returns (or after a
     * fire-and-forget call begins) still sees the entry on disk / in body. No
     * `fsync` — power loss may still drop the last page. Indexed backends update
     * the local index immediately and queue the remote publish in call order.
     *
     * `line` MUST include the trailing newline.
     */
    append(line: string): Promise<void>;
    /**
     * Synchronous append when the backend can apply the line before return.
     * File and memory implement this so {@link SessionManager} can latch the
     * first write failure before the appending call returns (surfaced by a later
     * flushSync/close/next append — the turn loop does not throw from append).
     * Indexed backends update the local index immediately and queue remote I/O.
     */
    appendSync?(line: string): void;
    /** Resolve once all queued appends complete. No fsync. */
    flush(): Promise<void>;
    /** Drain synchronously flushable queued work when the backend supports it. No fsync. */
    flushSync?(): void;
    /** False once close() has begun/finished. */
    isOpen(): boolean;
    close(): Promise<void>;
    getError(): Error | undefined;
}
/**
 * Optional guard applied by {@link SessionStorage.writeTextAtomic}. The
 * backend MUST call `commitGuard()` synchronously immediately before it makes
 * the staged content visible at `path`. If it returns `false`, the staged
 * write is discarded and the target is left untouched. Backends MUST NOT
 * yield between calling the guard and publishing the write, so a concurrent
 * synchronous rewrite that took over cannot be overwritten by a stale body.
 */
export interface WriteTextAtomicOptions {
    commitGuard?: () => boolean;
}
export interface SessionStorage {
    ensureDirSync(dir: string): void;
    existsSync(path: string): boolean;
    writeTextSync(path: string, content: string): void;
    /**
     * Update the current session title through the storage backend.
     *
     * File-like backends rewrite the fixed-width JSONL title slot; indexed
     * backends can store the semantic title fields and synthesize the slot when
     * reading.
     */
    updateSessionTitle(path: string, update: SessionTitleUpdate): Promise<void>;
    statSync(path: string): SessionStorageStat;
    listFilesSync(dir: string, pattern: string): string[];
    exists(path: string): Promise<boolean>;
    readText(path: string): Promise<string>;
    /** Read the requested UTF-8 byte windows from the head and tail of the file. */
    readTextSlices(path: string, prefixBytes: number, suffixBytes: number): Promise<[string, string]>;
    writeText(path: string, content: string): Promise<void>;
    writeTextAtomic(path: string, content: string, options?: WriteTextAtomicOptions): Promise<void>;
    rename(path: string, nextPath: string): Promise<void>;
    unlink(path: string): Promise<void>;
    deleteSessionWithArtifacts(sessionPath: string): Promise<void>;
    openWriter(path: string, options?: {
        flags?: "a" | "w";
        onError?: (err: Error) => void;
    }): SessionStorageWriter;
    /**
     * Wait for every backing write scheduled by this storage to become durably
     * visible. Sync backends (file, memory) return immediately because their
     * writes complete in-body; async backends (Redis/SQL via
     * {@link IndexedSessionStorage}) await their per-path queues so a caller
     * driving a graceful shutdown does not exit while a fire-and-forget
     * `writeTextSync` publish is still on the wire.
     */
    drain(): Promise<void>;
}
export declare class FileSessionStorage implements SessionStorage {
    #private;
    ensureDirSync(dir: string): void;
    existsSync(path: string): boolean;
    writeTextSync(fpath: string, content: string): void;
    updateSessionTitle(fpath: string, update: SessionTitleUpdate): Promise<void>;
    statSync(path: string): SessionStorageStat;
    listFilesSync(dir: string, pattern: string): string[];
    exists(path: string): Promise<boolean>;
    readText(path: string): Promise<string>;
    readTextSlices(path: string, prefixBytes: number, suffixBytes: number): Promise<[string, string]>;
    writeText(path: string, content: string): Promise<void>;
    writeTextAtomic(fpath: string, content: string, options?: WriteTextAtomicOptions): Promise<void>;
    /**
     * Sync rename hook. Split from `rename` so `writeTextAtomic` can perform its
     * guard-then-publish step without a yield, and so tests can inject
     * Windows-style EPERM at the sync layer used by the atomic path.
     */
    renameSync(source: string, target: string): void;
    rename(path: string, nextPath: string): Promise<void>;
    unlink(path: string): Promise<void>;
    drain(): Promise<void>;
    openWriter(path: string, options?: {
        flags?: "a" | "w";
        onError?: (err: Error) => void;
    }): SessionStorageWriter;
    /**
     * Delete a session file and its artifacts directory.
     * Artifacts are stored in a sibling directory with the same name minus .jsonl extension.
     */
    deleteSessionWithArtifacts(sessionPath: string): Promise<void>;
}
export declare class MemorySessionStorage implements SessionStorage {
    #private;
    ensureDirSync(_dir: string): void;
    existsSync(path: string): boolean;
    writeTextSync(path: string, content: string): void;
    updateSessionTitle(path: string, update: SessionTitleUpdate): Promise<void>;
    /**
     * Internal O(1) append used by {@link MemorySessionStorageWriter}. Lazily
     * creates the entry. External callers should go through `openWriter()`
     * rather than touching the mirror directly.
     */
    appendSync(path: string, chunk: string): void;
    statSync(path: string): SessionStorageStat;
    listFilesSync(dir: string, pattern: string): string[];
    exists(path: string): Promise<boolean>;
    readText(path: string): Promise<string>;
    readTextSlices(path: string, prefixBytes: number, suffixBytes: number): Promise<[string, string]>;
    writeText(path: string, content: string): Promise<void>;
    writeTextAtomic(path: string, content: string, options?: WriteTextAtomicOptions): Promise<void>;
    rename(path: string, nextPath: string): Promise<void>;
    unlink(path: string): Promise<void>;
    deleteSessionWithArtifacts(_sessionPath: string): Promise<void>;
    drain(): Promise<void>;
    openWriter(path: string, options?: {
        flags?: "a" | "w";
        onError?: (err: Error) => void;
    }): SessionStorageWriter;
}
