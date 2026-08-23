import type { Settings } from "../config/settings.js";
/** One request-level group of image references written to the provider wire. */
export interface BlobBrokerSavingsRecord {
    /** Unix epoch milliseconds when the provider request was decorated. */
    readonly timestamp: number;
    readonly provider: string;
    readonly model: string;
    /** Provider-native files use `provider-files`; URLs use their publication destination. */
    readonly destination: string;
    readonly imageCount: number;
    /** UTF-8 bytes occupied by the base64 values replaced by references. */
    readonly inlineBytes: number;
    /** UTF-8 bytes occupied by the URL or provider-file references. */
    readonly referenceBytes: number;
    readonly savedBytes: number;
}
/** Additive counters shared by the total and per-destination status views. */
export interface BlobBrokerSavingsCounters {
    readonly entries: number;
    readonly imageCount: number;
    readonly inlineBytes: number;
    readonly referenceBytes: number;
    readonly savedBytes: number;
}
/** Durable savings summary exposed by `omp images status`. */
export interface BlobBrokerSavingsStatus extends BlobBrokerSavingsCounters {
    readonly journalPath: string;
    readonly byDestination: Readonly<Record<string, BlobBrokerSavingsCounters>>;
}
/** Deterministic per-project append-only journal path. */
export declare function blobBrokerSavingsJournalPath(settings: Settings, projectDir: string): string;
/** Aggregate the durable journal in one linear scan; malformed lines are ignored. */
export declare function readBlobBrokerSavingsStatus(journalPath: string): Promise<BlobBrokerSavingsStatus>;
/** Append-only recorder. Failures are diagnostic-only and never break a provider request. */
export declare class BlobBrokerSavingsJournal {
    #private;
    readonly path: string;
    constructor(journalPath: string);
    append(records: readonly BlobBrokerSavingsRecord[]): Promise<void>;
    status(): Promise<BlobBrokerSavingsStatus>;
}
