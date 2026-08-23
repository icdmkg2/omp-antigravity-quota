/**
 * Debug report bundle creation.
 *
 * Creates a .tar.gz archive with session data, logs, system info, and optional profiling data.
 */
import type { WorkProfile } from "@oh-my-pi/pi-natives";
import type { CpuProfile, HeapSnapshot } from "./profiler.js";
export interface ReportBundleOptions {
    /** Session file path */
    sessionFile: string | undefined;
    /** Settings to include */
    settings?: Record<string, unknown>;
    /** CPU profile (for performance reports) */
    cpuProfile?: CpuProfile;
    /** Heap snapshot (for memory reports) */
    heapSnapshot?: HeapSnapshot;
    /** Work profile (for work scheduling reports) */
    workProfile?: WorkProfile;
    /** Raw provider SSE diagnostics captured by the session buffer */
    rawSseText?: string;
}
export interface ReportBundleResult {
    path: string;
    files: string[];
}
export interface DebugLogSource {
    getInitialText(): Promise<string>;
    hasOlderLogs(): boolean;
    loadOlderLogs(limitDays?: number): Promise<string>;
}
/**
 * Create a debug report bundle.
 *
 * Bundle contents:
 * - session.jsonl: Current session transcript
 * - artifacts/: Current session's artifacts subtree (recursive), including any
 *   subagent session transcripts nested under it
 * - logs.txt: Recent log entries
 * - system.json: OS, arch, CPU, memory, versions
 * - env.json: Sanitized environment variables
 * - config.json: Resolved settings
 * - profile.cpuprofile: CPU profile (performance report only)
 * - raw-sse.txt: Recent raw provider SSE diagnostics (when captured)
 * - profile.md: Markdown CPU profile (performance report only)
 * - heap.heapsnapshot: Heap snapshot (memory report only)
 * - work.folded: Work profile folded stacks (work report only)
 * - work.md: Work profile summary (work report only)
 * - work.svg: Work profile flamegraph (work report only)
 */
export declare function createReportBundle(options: ReportBundleOptions): Promise<ReportBundleResult>;
/** Get recent log entries for display (tail-limited to avoid OOM on large files). */
export declare function getLogText(): Promise<string>;
export declare function createDebugLogSource(): Promise<DebugLogSource>;
/** Calculate total size of artifact cache */
export declare function getArtifactCacheStats(sessionsDir: string): Promise<{
    count: number;
    totalSize: number;
    oldestDate: Date | null;
}>;
/** Clear artifact cache older than N days */
export declare function clearArtifactCache(sessionsDir: string, daysOld?: number): Promise<{
    removed: number;
}>;
