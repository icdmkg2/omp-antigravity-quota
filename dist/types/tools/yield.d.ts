/**
 * Result submission tool for subagent output.
 *
 * Subagents can call this tool incrementally or terminally depending on `type`.
 */
import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { TSchema } from "@oh-my-pi/pi-ai/types";
import type { ToolSession } from "./index.js";
export interface YieldDetails {
    /** Successful result payload, or omitted when `useLastTurn` requests last-turn extraction. */
    data?: unknown;
    status: "success" | "aborted";
    error?: string;
    /** Optional result section/classification supplied by the yield caller. */
    type?: string | string[];
    /** True when the caller intentionally omitted success data so the executor uses the last assistant turn. */
    useLastTurn?: boolean;
    /**
     * Set when the yield tool exhausted its in-tool schema-retry budget
     * (MAX_SCHEMA_RETRIES) and accepted the data anyway. Surfaced so the
     * executor's post-mortem finalizer can honor the override instead of
     * re-rejecting the same payload with `schema_violation` — keeping the
     * subagent's acceptance and the parent's view of the result in lockstep.
     */
    schemaOverridden?: boolean;
}
export declare class YieldTool implements AgentTool<TSchema, YieldDetails> {
    #private;
    readonly name = "yield";
    readonly approval: "read";
    readonly label = "Submit Result";
    description: string;
    readonly parameters: TSchema;
    strict: boolean;
    readonly intent: "omit";
    lenientArgValidation: boolean;
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: unknown, _signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<YieldDetails>, _context?: AgentToolContext): Promise<AgentToolResult<YieldDetails>>;
}
