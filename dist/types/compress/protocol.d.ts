import type { ToolDefinition } from "../extensibility/extensions/index.js";
import type { CompressDraft, CompressLoss, CompressMetrics } from "./types.js";
/** Transcript details for one `rewrite` call. */
export interface RewriteDetails {
    round: number;
    draftTokens: number;
    losses: number;
}
/** Transcript details for one `approve` call. */
export interface ApproveDetails {
    round: number;
}
/** Draft ledger shared by the protocol tools and the command loop. */
export declare class CompressProtocol {
    #private;
    /**
     * Metrics measure source-vs-draft ratios with the default estimate. The
     * compress session resolves its model after this ledger is constructed, so
     * no catalog model is available here.
     */
    constructor(source: string);
    /** Newest submitted draft, or undefined before the first `rewrite`. */
    get latest(): CompressDraft | undefined;
    /** True once `approve` accepted the newest draft. */
    get approved(): boolean;
    /** The agent's stated reason for accepting the final draft. */
    get verdict(): string | undefined;
    /** Number of drafts submitted so far. */
    get rounds(): number;
    /** Words in the source text. */
    get sourceWords(): number;
    /** Tokens in the source text. */
    get sourceTokens(): number;
    /** Size of `draft` against the source. */
    metrics(draft: CompressDraft): CompressMetrics;
    /** Record that the command has shown `round` back to the agent for a verdict. */
    markReviewed(round: number): void;
    /**
     * Record a draft and return it. Supersedes any prior approval, so an accepted
     * draft cannot be silently replaced by a later one.
     */
    submit(text: string, losses: readonly CompressLoss[]): CompressDraft;
    /**
     * Accept the newest draft and return it.
     *
     * Throws when no draft exists, or when the newest draft has not been shown back
     * to the agent for a verdict — approval is only meaningful after that review.
     */
    accept(verdict: string): CompressDraft;
    /** Tool that records a draft. Thin adapter over {@link submit}. */
    rewriteTool(): ToolDefinition;
    /** Tool that accepts the newest reviewed draft. Thin adapter over {@link accept}. */
    approveTool(): ToolDefinition;
}
