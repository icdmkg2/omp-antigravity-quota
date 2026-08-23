import type { SessionStorage, SessionStorageStat, SessionStorageWriter, WriteTextAtomicOptions } from "./session-storage.js";
import { type SessionTitleUpdate } from "./session-title-slot.js";
export interface SessionStorageIndexEntry {
    path: string;
    size: number;
    mtimeMs: number;
    title?: string;
    titleSource?: SessionTitleUpdate["source"];
    titleUpdatedAt?: string;
}
export interface SessionStorageBackend {
    init(): Promise<void>;
    loadIndex(): Promise<Iterable<SessionStorageIndexEntry>>;
    readFull(path: string): Promise<string | null>;
    readSlices(path: string, prefixBytes: number, suffixBytes: number): Promise<[string, string]>;
    writeFull(path: string, content: string, mtimeMs: number, title?: SessionTitleUpdate): Promise<void>;
    append(path: string, line: string, mtimeMs: number): Promise<void>;
    updateSessionTitle(path: string, title: SessionTitleUpdate, mtimeMs: number): Promise<void>;
    truncate(path: string, mtimeMs: number): Promise<void>;
    remove(paths: string[]): Promise<void>;
    move(src: string, dst: string, mtimeMs: number): Promise<void>;
}
export declare class IndexedSessionStorage implements SessionStorage {
    #private;
    constructor(backend: SessionStorageBackend);
    initialize(): Promise<void>;
    refresh(): Promise<void>;
    drain(): Promise<void>;
    ensureDirSync(_dir: string): void;
    existsSync(path: string): boolean;
    writeTextSync(path: string, content: string): void;
    updateSessionTitle(path: string, title: SessionTitleUpdate): Promise<void>;
    statSync(path: string): SessionStorageStat;
    listFilesSync(dir: string, pattern: string): string[];
    exists(path: string): Promise<boolean>;
    readText(path: string): Promise<string>;
    readTextSlices(path: string, prefixBytes: number, suffixBytes: number): Promise<[string, string]>;
    writeText(path: string, content: string): Promise<void>;
    writeTextAtomic(path: string, content: string, options?: WriteTextAtomicOptions): Promise<void>;
    rename(src: string, dst: string): Promise<void>;
    unlink(path: string): Promise<void>;
    deleteSessionWithArtifacts(sessionPath: string): Promise<void>;
    openWriter(path: string, options?: {
        flags?: "a" | "w";
        onError?: (err: Error) => void;
    }): SessionStorageWriter;
    _writerClosed(writer: IndexedSessionStorageWriter): void;
    _truncateForWriter(path: string): number;
    _queueTruncate(path: string, mtimeMs: number, getError?: () => Error | undefined): Promise<void>;
    _appendForWriter(path: string, line: string): number;
    _queueAppend(path: string, line: string, mtimeMs: number, getError?: () => Error | undefined): Promise<void>;
}
declare class IndexedSessionStorageWriter implements SessionStorageWriter {
    #private;
    constructor(storage: IndexedSessionStorage, path: string, options?: {
        flags?: "a" | "w";
        onError?: (err: Error) => void;
    });
    appendSync(line: string): void;
    append(line: string): Promise<void>;
    flush(): Promise<void>;
    isOpen(): boolean;
    close(): Promise<void>;
    getError(): Error | undefined;
}
export {};
