import type { Tokenizer } from "@oh-my-pi/pi-agent-core";
import type { Model } from "@oh-my-pi/pi-ai";
import type { Skill } from "../../extensibility/skills.js";
import type { AgentSession } from "../../session/agent-session.js";
import { type SnapcompactSavingsEstimate } from "../../session/snapcompact-inline.js";
import type { Tool } from "../../tools/index.js";
import type { theme as Theme } from "../theme/theme.js";
type CategoryId = "systemPrompt" | "systemContext" | "systemTools" | "skills" | "messages";
interface CategoryInfo {
    id: CategoryId;
    label: string;
    tokens: number;
    color: "accent" | "warning" | "success" | "userMessageText" | "customMessageLabel";
    glyph: string;
}
export interface ContextBreakdown {
    model: Model | undefined;
    contextWindow: number;
    categories: CategoryInfo[];
    usedTokens: number;
    autoCompactBufferTokens: number;
    freeTokens: number;
    /** Estimated snapcompact wire savings; set when requested and a snapcompact.* setting is enabled. */
    snapcompact?: SnapcompactSavingsEstimate;
}
/** Percent positions (0–100 of the context window) for the auto-compaction boundaries. */
export interface CompactionBoundaries {
    /** Where auto-compaction fires. */
    thresholdPercent: number;
    /**
     * Where the background speculative summarizer starts (threshold − lead), or
     * `null` when no speculation will run (async compaction disabled, or the
     * first available method is local — snapcompact/shake — and thus instant).
     */
    speculationPercent: number | null;
}
/**
 * Boundary positions for the status line's annotated context gauge. `null`
 * when compaction is disabled/off or the window is unknown — the gauge then
 * renders without markers. `model` resolves which configured method a real
 * pass would run; without it, model-gated methods count as unavailable.
 */
export declare function computeCompactionBoundaries(settings: AgentSession["settings"], contextWindow: number, model?: Model | null): CompactionBoundaries | null;
/** Stable inputs used to cache non-message token estimates. */
export interface NonMessageTokenSource {
    readonly systemPrompt?: string[];
    readonly agent?: {
        readonly state?: {
            readonly tools?: ReadonlyArray<Pick<Tool, "name" | "description" | "parameters">>;
        };
    };
    readonly skills?: readonly Skill[];
}
export declare function estimateSkillsTokens(skills: readonly Skill[], tokenizer: Tokenizer): number;
export declare function estimateToolSchemaTokens(tools: ReadonlyArray<Pick<Tool, "name" | "description" | "parameters">>, tokenizer: Tokenizer): number;
export declare function computeNonMessageTokens(session: NonMessageTokenSource, tokenizer: Tokenizer): number;
/**
 * Shared helper for the four non-message token totals used by
 * `computeContextBreakdown` (/context panel). Keep this category split stable:
 * the status-line fast path intentionally uses the equivalent collapsed total
 * in `computeNonMessageTokens`.
 */
export declare function computeNonMessageBreakdown(session: NonMessageTokenSource, tokenizer: Tokenizer): {
    skillsTokens: number;
    toolsTokens: number;
    systemContextTokens: number;
    systemPromptTokens: number;
};
/**
 * Compute a breakdown of estimated context usage by category for the active
 * session and model.
 */
export declare function computeContextBreakdown(session: AgentSession, options?: {
    snapcompactSavings?: boolean;
}): ContextBreakdown;
/**
 * Render a colorful context-usage panel as ANSI text. Output is a series of
 * lines pairing the grid (left) with the legend (right).
 */
export declare function renderContextUsage(breakdown: ContextBreakdown, theme: typeof Theme): string;
export {};
