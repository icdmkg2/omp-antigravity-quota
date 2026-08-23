export interface GcCommandFlags {
    apply?: boolean;
    json?: boolean;
    agentDir?: string;
    blobs?: boolean;
    archive?: boolean;
    wal?: boolean;
    coldArchiveAfterDays?: number;
    retainNewestGlobal?: number;
    retainNewestPerCwd?: number;
}
export interface GcCommandArgs {
    flags: GcCommandFlags;
}
export interface BlobGcResult {
    referenced: number;
    candidates: number;
    wouldDelete: number;
    deleted: number;
    bytes: number;
    errors: string[];
}
export interface ArchiveGcResult {
    scanned: number;
    skippedActive: number;
    keptNewestGlobal: number;
    keptNewestPerCwd: number;
    wouldArchive: number;
    archived: number;
    historyRowsDeleted: number;
    statsRowsDeleted: number;
    ftsRebuilt: boolean;
    errors: string[];
}
export interface WalCheckpointResult {
    dbPath: string;
    walBytes: number;
    wouldCheckpoint: boolean;
    checkpointed: boolean;
    busy: number;
    log: number;
    checkpointedFrames: number;
}
export interface WalGcResult {
    databases: WalCheckpointResult[];
    walBytes: number;
    wouldCheckpoint: boolean;
    checkpointed: boolean;
}
export interface GcResult {
    agentDir: string;
    apply: boolean;
    blobs?: BlobGcResult;
    archive?: ArchiveGcResult;
    wal?: WalGcResult;
    lockPath: string;
}
export declare function collectGcErrors(result: GcResult): string[];
export declare function runGcCommand(args: GcCommandArgs): Promise<GcResult>;
