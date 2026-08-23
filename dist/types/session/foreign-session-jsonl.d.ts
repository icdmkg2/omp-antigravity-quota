/** One readable object record from a foreign JSONL transcript. */
export interface ForeignJsonRecord {
    readonly value: Record<string, unknown>;
    readonly line: number;
}
/** Stream valid object records while tolerating malformed or truncated lines. */
export declare function readForeignJsonRecords(filePath: string): AsyncGenerator<ForeignJsonRecord>;
/** Read every valid object record from a foreign JSONL transcript. */
export declare function collectForeignJsonRecords(filePath: string): Promise<ForeignJsonRecord[]>;
