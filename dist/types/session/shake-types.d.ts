/**
 * Public shape of the `shake` operation, kept in a dependency-free leaf module
 * so slash-command registries and controllers can import `formatShakeSummary`
 * without pulling in the heavy `agent-session` module graph (which would form
 * an import cycle through the slash-command registry).
 */
/** Mode selector for `AgentSession.shake`. */
export type ShakeMode = "elide" | "images" | "thinking";
/** Outcome of an `AgentSession.shake` run. */
export interface ShakeResult {
    mode: ShakeMode;
    /** Whole tool-call results dropped. */
    toolResultsDropped: number;
    /** Large fenced/XML blocks dropped. */
    blocksDropped: number;
    /** Image blocks removed (images mode only). */
    imagesDropped?: number;
    /** Thinking blocks dropped (thinking mode only). */
    thinkingBlocksDropped?: number;
    /** Estimated context tokens reclaimed. */
    tokensFreed: number;
    /** Session artifact holding the dropped originals, when persisted. */
    artifactId?: string;
}
/** One-line operator summary of a {@link ShakeResult} (shared by TUI + ACP). */
export declare function formatShakeSummary(result: ShakeResult): string;
