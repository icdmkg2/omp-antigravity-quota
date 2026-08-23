/**
 * Parser and renderer for macOS `/usr/bin/sample` call-tree reports
 * (conventionally saved as `*.sample.txt`).
 *
 * The raw report is a 10k+ line ASCII call tree with mangled symbols —
 * expensive for an agent to digest. `renderSampleProfile` converts it into a
 * compact bottleneck summary:
 *
 * - per-thread hot paths, pruned to frames with meaningful on-CPU samples,
 *   with pass-through chains collapsed and direct recursion flattened
 * - blocked/idle threads reduced to a one-line classification
 * - a process-wide "top functions by self samples" table
 * - Rust v0 and legacy symbols demangled (best-effort, path extraction)
 *
 * Consumed by the read tool: `*.sample.txt` reads show the summary, `:raw`
 * returns the original bytes.
 */
/** Matches paths the read tool should treat as macOS sample reports. */
export declare function isSampleProfilePath(filePath: string): boolean;
/** One frame in the sampled call tree. Counts are sample hits (subtree total). */
export interface SampleFrame {
    count: number;
    symbol: string;
    module?: string;
    children: SampleFrame[];
}
/** One sampled thread: `Thread_<id>` root plus its call tree. */
export interface SampleThread {
    id: string;
    name?: string;
    total: number;
    roots: SampleFrame[];
}
/** Metadata from the report preamble (everything before `Call graph:`). */
export interface SampleProfileHeader {
    process: string;
    pid: number;
    intervalMs: number;
    path?: string;
    codeType?: string;
    osVersion?: string;
    footprint?: string;
    footprintPeak?: string;
}
/** Parsed macOS sample report. */
export interface SampleProfile {
    header: SampleProfileHeader;
    threads: SampleThread[];
}
/**
 * Parse a macOS `sample` report. Returns null when the text does not look
 * like sample output (missing analysis preamble or `Call graph:` section).
 */
export declare function parseSampleProfile(text: string): SampleProfile | null;
/**
 * Best-effort demangle of Rust symbols (v0 `_R…` and legacy `_ZN…E`).
 * For v0 this is a path extractor, not a full demangler: identifiers are
 * pulled out in order and joined with `::`, so generic arguments appear as
 * extra path segments. Non-Rust symbols pass through unchanged.
 */
export declare function demangleSymbol(raw: string): string;
/**
 * Render a macOS sample report as an agent-friendly bottleneck summary.
 * Returns null when `text` is not sample output (caller falls back to the
 * plain-text path).
 */
export declare function renderSampleProfile(text: string): string | null;
