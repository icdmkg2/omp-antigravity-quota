import { Database } from "bun:sqlite";
export declare function looksLikeSqlite(bytes: Uint8Array): boolean;
/**
 * Opens the query-only connection used by read tools, retrying read-write mode solely to initialize missing WAL sidecars.
 */
export declare function openSqliteReadConnection(filePath: string): Promise<Database>;
/** Row cap for raw `?q=` SQL — protects against `SELECT *` on multi-million-row tables. */
export declare const MAX_RAW_QUERY_ROWS = 1000;
export interface SqlitePathCandidate {
    sqlitePath: string;
    subPath: string;
    queryString: string;
}
export type SqliteSelector = {
    kind: "list";
} | {
    kind: "schema";
    table: string;
    sampleLimit: number;
} | {
    kind: "row";
    table: string;
    key: string;
} | {
    kind: "query";
    table: string;
    limit: number;
    offset: number;
    order?: string;
    where?: string;
} | {
    kind: "raw";
    sql: string;
};
export type SqliteRowLookup = {
    kind: "pk";
    column: string;
    type: string;
} | {
    kind: "rowid";
};
/**
 * Row count for a table in the listing.
 * - `exact`: counted in full (the table is small enough to count cheaply).
 * - `estimate`: the planner's `sqlite_stat1` figure; the table is too large to
 *   scan, so this may be stale.
 * - `atLeast`: a lower bound; counting was capped before reaching the end.
 */
export type TableRowCount = {
    kind: "exact";
    rows: number;
} | {
    kind: "estimate";
    rows: number;
} | {
    kind: "atLeast";
    rows: number;
};
export interface SqliteTableSummary {
    name: string;
    count: TableRowCount;
}
export declare function parseSqlitePathCandidates(filePath: string): SqlitePathCandidate[];
export declare function isSqliteFile(absolutePath: string): Promise<boolean>;
export declare function parseSqliteSelector(subPath: string, queryString: string): SqliteSelector;
export declare function listTables(db: Database, options?: {
    probeCap?: number;
}): SqliteTableSummary[];
export declare function getTableSchema(db: Database, table: string): string;
export declare function getTablePrimaryKey(db: Database, table: string): {
    column: string;
    type: string;
} | null;
export declare function resolveTableRowLookup(db: Database, table: string): SqliteRowLookup;
export declare function queryRows(db: Database, table: string, opts: {
    limit: number;
    offset: number;
    order?: string;
    where?: string;
}): {
    columns: string[];
    rows: Record<string, unknown>[];
    totalCount: number;
};
export declare function getRowByKey(db: Database, table: string, pk: {
    column: string;
    type?: string;
}, key: string): Record<string, unknown> | null;
export declare function getRowByRowId(db: Database, table: string, key: string): Record<string, unknown> | null;
export declare function executeReadQuery(db: Database, sql: string): {
    columns: string[];
    rows: Record<string, unknown>[];
    truncated: boolean;
};
export declare function insertRow(db: Database, table: string, data: Record<string, unknown>): void;
export declare function updateRowByKey(db: Database, table: string, pk: {
    column: string;
    type?: string;
}, key: string, data: Record<string, unknown>): number;
export declare function updateRowByRowId(db: Database, table: string, key: string, data: Record<string, unknown>): number;
export declare function deleteRowByKey(db: Database, table: string, pk: {
    column: string;
    type?: string;
}, key: string): number;
export declare function deleteRowByRowId(db: Database, table: string, key: string): number;
export declare function renderTableList(tables: SqliteTableSummary[]): string;
export declare function renderSchema(createSql: string, sampleRows: {
    columns: string[];
    rows: Record<string, unknown>[];
}): string;
export declare function renderRow(row: Record<string, unknown>): string;
export declare function renderTable(columns: string[], rows: Record<string, unknown>[], meta: {
    totalCount: number;
    offset: number;
    limit: number;
    table: string;
    dbPath: string;
}): string;
