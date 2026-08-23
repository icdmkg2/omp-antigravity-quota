import { IndexedSessionStorage, type SessionStorageBackend } from "./indexed-session-storage.js";
/**
 * Supported `bun:sql` adapter dialects. `Bun.SQL` reports this string on
 * `client.options.adapter`; we detect it once at construction and pick the
 * correct DDL / upsert / concat / byte-slice syntax for the underlying engine.
 */
export type SqlSessionStorageAdapter = "postgres" | "mysql" | "sqlite";
/**
 * Minimal subset of the `Bun.SQL` instance surface used by
 * {@link SqlSessionStorage}. Bun's SQL client exposes a tagged-template API too,
 * but this implementation intentionally uses `unsafe(query, values)` because
 * the table identifier is validated and then inlined while values remain bound
 * parameters.
 */
export interface SqlSessionStorageClient {
    unsafe(query: string, values?: unknown[]): Promise<unknown[]>;
    /**
     * `Bun.SQL` exposes the parsed connection options here. We only consult
     * `adapter` to pick the dialect; the field is typed as
     * `string | undefined` so the real `Bun.SQL` instance type slots in
     * without casting (it reports `string | undefined` across adapters).
     */
    options: {
        adapter?: string;
        [key: string]: unknown;
    };
    end?(): Promise<void>;
}
export interface SqlSessionStorageOptions {
    /** Connected `Bun.SQL` instance (PostgreSQL, MySQL, or SQLite). */
    client: SqlSessionStorageClient;
    /**
     * Override the auto-detected adapter. Useful when the client is wrapped
     * (e.g. by a pool) and `client.options.adapter` is unreliable.
     */
    adapter?: SqlSessionStorageAdapter;
    /**
     * Table name to use. Default: `omp_session_files`. Must match
     * `[A-Za-z_][A-Za-z0-9_]{0,62}` — inlined into prepared statements at
     * startup, so we accept identifier-safe inputs only (no quoted/dotted
     * names).
     */
    table?: string;
    /**
     * If true, run `CREATE TABLE IF NOT EXISTS` during `create()`.
     * Default: true. Disable when the table is owned by an external
     * migration.
     */
    createTable?: boolean;
}
/**
 * SQL-backed implementation of {@link SessionStorage} using `bun:sql`. Each
 * session JSONL file maps to a row keyed by `path`; one table stores the file
 * contents while this process keeps only a metadata index (`size`, `mtimeMs`) in
 * memory for synchronous `existsSync` / `statSync` / `listFilesSync` calls.
 *
 * Works against PostgreSQL, MySQL/MariaDB, and SQLite by selecting the
 * dialect-correct DDL, upsert, string-concat, byte-length, and byte-slice syntax
 * at construction.
 */
export declare class SqlSessionStorage extends IndexedSessionStorage {
    #private;
    constructor(backend: SessionStorageBackend, adapter: SqlSessionStorageAdapter, table: string);
    /**
     * Apply the dialect-correct DDL (unless `createTable: false` is set) and warm
     * the metadata index with every existing row. Must be awaited before passing
     * the storage into `SessionManager.create()`.
     */
    static create(options: SqlSessionStorageOptions): Promise<SqlSessionStorage>;
    get adapter(): SqlSessionStorageAdapter;
    get table(): string;
}
