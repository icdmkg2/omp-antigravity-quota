/**
 * Shared display-tree machinery for profile summaries (macOS `sample` reports,
 * V8 `.cpuprofile` files). Callers build {@link ProfileNode} trees with a
 * domain-specific metric (on-CPU samples, self microseconds, …); this module
 * merges same-key siblings, flattens direct recursion, collapses pass-through
 * chains, and renders the pruned hot-path tree.
 */
/** Display node: merged, recursion-flattened mirror of a profile subtree. */
export interface ProfileNode {
    /** Merge/recursion identity (demangled symbol, function@call-site, …). */
    key: string;
    /** Human-readable label; recursion and truncation decorations are applied at render time. */
    label: string;
    /** Inclusive metric for this subtree (on-CPU samples, self µs, …); drives pruning and display. */
    value: number;
    /** Levels of direct recursion flattened into this node. */
    recursion: number;
    children: ProfileNode[];
}
/** Merge `b` into `a` (same key), combining values and child lists. */
export declare function mergeInto(a: ProfileNode, b: ProfileNode): void;
/**
 * Flatten direct recursion: children carrying the node's own key are dissolved
 * into it (their children promoted and merged), so a 15-deep recursive spine
 * renders as one annotated node.
 */
export declare function flattenRecursion(node: ProfileNode): void;
/** `n` as a percentage of `total`, one decimal (`"12.3%"`); `"0%"` when total is empty. */
export declare function formatPct(n: number, total: number): string;
/** Options for {@link renderProfileNode}. */
export interface RenderTreeContext {
    out: string[];
    /** Denominator for percentage annotations. */
    total: number;
    /** Minimum subtree value a child needs to stay visible. */
    minValue: number;
    /** Format a metric value for the left column. */
    formatValue: (value: number) => string;
    /** Left-column width (characters) for formatted values. */
    valueWidth: number;
}
/**
 * Render one hot-path subtree: pass-through chains (single kept child, no own
 * contribution above `minValue`) collapse into a single `a › b › c` line, and
 * children below `minValue` are pruned.
 */
export declare function renderProfileNode(node: ProfileNode, indent: number, ctx: RenderTreeContext): void;
