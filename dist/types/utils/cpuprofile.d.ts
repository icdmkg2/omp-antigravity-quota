/**
 * Parser and renderer for V8 `.cpuprofile` files (emitted by `node --cpu-prof`,
 * `bun --cpu-prof`, Chrome DevTools, and the CDP `Profiler` domain).
 *
 * The raw file is a JSON blob with a flat node table and up to millions of
 * sample/timestamp entries — useless to read directly. `renderCpuProfile`
 * converts it into a compact bottleneck summary:
 *
 * - the hot-path call tree, pruned to frames with meaningful self time,
 *   with pass-through chains collapsed and direct recursion flattened
 * - `(idle)` time excluded from on-CPU totals
 * - a profile-wide "top functions by self time" table
 *
 * Consumed by the read tool: `*.cpuprofile` reads show the summary, `:raw`
 * returns the original JSON.
 */
/** Matches paths the read tool should treat as V8 CPU profiles. */
export declare function isCpuProfilePath(filePath: string): boolean;
/** Call-site metadata of one profile node. `lineNumber` is 0-based. */
export interface CpuProfileCallFrame {
    functionName: string;
    url?: string;
    lineNumber?: number;
}
/** One node in the flat profile tree; `children` are node ids. */
export interface CpuProfileNode {
    id: number;
    callFrame: CpuProfileCallFrame;
    hitCount?: number;
    children?: number[];
}
/** Parsed V8 CPU profile. `startTime`/`endTime`/`timeDeltas` are microseconds. */
export interface CpuProfile {
    nodes: CpuProfileNode[];
    startTime: number;
    endTime: number;
    samples?: number[];
    timeDeltas?: number[];
}
/**
 * Parse a `.cpuprofile` JSON blob. Accepts both the bare profile and the CDP
 * `Profiler.stop` result shape (`{ profile: {...} }`). Returns null when the
 * text is not a structurally valid V8 CPU profile.
 */
export declare function parseCpuProfile(text: string): CpuProfile | null;
/**
 * Render a V8 CPU profile as an agent-friendly bottleneck summary.
 * Returns null when `text` is not a CPU profile (caller falls back to the
 * plain-text path).
 */
export declare function renderCpuProfile(text: string): string | null;
