import { IndexedSessionStorage } from "./indexed-session-storage.js";
/**
 * Minimal subset of the `bun:redis` `RedisClient` surface used by
 * {@link RedisSessionStorage}. Keeping the contract narrow (and accepting any
 * client that conforms) lets callers swap in test doubles or shared clients
 * without dragging the entire Bun typings into this module.
 */
export interface RedisSessionStorageClient {
    send(command: string, args: string[]): Promise<unknown>;
    get(key: string): Promise<string | null>;
    getrange(key: string, start: number, end: number): Promise<string>;
    strlen(key: string): Promise<number>;
    set(key: string, value: string): Promise<unknown>;
    append(key: string, value: string): Promise<number>;
    del(...keys: string[]): Promise<number>;
    rename(src: string, dst: string): Promise<unknown>;
    scan(cursor: string, ...args: string[]): Promise<[string, string[]]>;
    hset(key: string, field: string, value: string): Promise<unknown>;
    hgetall(key: string): Promise<Record<string, string>>;
    hdel(key: string, ...fields: string[]): Promise<unknown>;
}
export interface RedisSessionStorageOptions {
    /** A connected `bun:redis` RedisClient (or any compatible adapter). */
    client: RedisSessionStorageClient;
    /**
     * Key prefix applied to every Redis key this storage owns. Default `omp:sessions:`.
     * Trailing colon is preserved verbatim — set to a project-scoped prefix to share
     * one Redis instance between multiple agents.
     */
    prefix?: string;
    /**
     * Maximum number of keys returned per SCAN batch when warming the metadata index.
     * Default 500.
     */
    scanCount?: number;
}
/**
 * Redis-backed implementation of {@link SessionStorage}. Each session JSONL
 * file maps to a Redis STRING key, with per-key metadata (mtime) tracked in a
 * single sibling HASH. This process keeps only a metadata index (`size`,
 * `mtimeMs`) in memory so synchronous `existsSync` / `statSync` /
 * `listFilesSync` calls remain available without mirroring full content.
 */
export declare class RedisSessionStorage extends IndexedSessionStorage {
    /**
     * Warm the metadata index with every existing session key under the configured
     * prefix and return the ready-to-use storage. Must be awaited before passing
     * the storage into `SessionManager.create()` so synchronous lookups (session
     * resume, recent sessions, EPERM-backup recovery) see the existing keyspace.
     */
    static create(options: RedisSessionStorageOptions): Promise<RedisSessionStorage>;
}
