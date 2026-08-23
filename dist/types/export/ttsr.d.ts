import { type Rule } from "../capability/rule.js";
import type { TtsrSettings } from "../config/settings.js";
export type TtsrMatchSource = "text" | "thinking" | "tool";
/** Context about the stream content currently being checked against TTSR rules. */
export interface TtsrMatchContext {
    source: TtsrMatchSource;
    /** Tool name for tool argument deltas, e.g. "edit" or "write". */
    toolName?: string;
    /** Candidate file paths associated with the current stream chunk. */
    filePaths?: string[];
    /** Stable key to isolate buffering (for example a tool call ID). */
    streamKey?: string;
}
export declare class TtsrManager {
    #private;
    constructor(settings?: TtsrSettings);
    /** Add a TTSR rule to be monitored. */
    addRule(rule: Rule): boolean;
    /**
     * Add a stream chunk to its scoped buffer and return matching rules.
     *
     * Buffers are isolated by source/tool key so matches don't bleed across
     * assistant prose, thinking text, and unrelated tool argument streams.
     */
    checkDelta(delta: string, context: TtsrMatchContext): Rule[];
    /**
     * Replace the scoped buffer with a tool-provided normalized snapshot and
     * return matching rules.
     *
     * Used for tools exposing `matcherDigest`: the digest is recomputed from the
     * full (partial) arguments on every delta, so it replaces the buffer instead
     * of being appended to it.
     */
    checkSnapshot(snapshot: string, context: TtsrMatchContext): Rule[];
    /**
     * Evaluate ast-grep `astCondition` rules against a reconstructed tool snapshot.
     *
     * Only edit/write tool streams reach here (AST conditions need a language, which
     * we infer from the file extension on the tool's path argument). The snapshot is
     * matched in memory by the native engine (`astMatch`), so this is async and
     * intentionally throttled: identical consecutive snapshots (the common case when
     * only non-source arguments change between deltas) are skipped.
     */
    checkAstSnapshot(snapshot: string, context: TtsrMatchContext): Promise<Rule[]>;
    /** True when any registered rule carries ast-grep conditions. */
    hasAstRules(): boolean;
    /** Mark rules as injected (won't trigger again until conditions allow). */
    markInjected(rulesToMark: Rule[]): void;
    /** Mark rule names as injected (won't trigger again until conditions allow). */
    markInjectedByNames(ruleNames: string[]): void;
    /** Get names of all injected rules (for persistence). */
    getInjectedRuleNames(): string[];
    /** Restore injected state from a list of rule names. */
    restoreInjected(ruleNames: string[]): void;
    /** Reset stream buffers (called on new turn). */
    resetBuffer(): void;
    /** Check if any TTSR rules are registered. */
    hasRules(): boolean;
    /** All rules currently registered for TTSR monitoring, in registration order. */
    getRules(): Rule[];
    /** Increment message counter (call after each turn). */
    incrementMessageCount(): void;
    /** Get current message count. */
    getMessageCount(): number;
    /** Get settings. */
    getSettings(): Required<TtsrSettings>;
}
