/**
 * CPU and heap profiling wrappers for debug reports.
 */
export interface CpuProfile {
    data: string;
    markdown: string;
}
export interface ProfilerSession {
    /** Stop profiling and return the profile data */
    stop(): Promise<CpuProfile>;
}
/**
 * Start CPU profiling.
 * Returns a session that can be stopped to get the profile data.
 */
export declare function startCpuProfile(): Promise<ProfilerSession>;
export interface HeapSnapshot {
    data: string;
}
/**
 * Generate a heap snapshot.
 * Uses Bun's built-in generateHeapSnapshot.
 */
export declare function generateHeapSnapshotData(): HeapSnapshot;
