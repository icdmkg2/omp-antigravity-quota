import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "./index.js";
import type { OutputMeta } from "./output-meta.js";
export interface CheckpointState {
    /** Number of in-memory messages at checkpoint (AFTER checkpoint tool result is appended) */
    checkpointMessageCount: number;
    /** Session entry ID at checkpoint (for session tree branching) */
    checkpointEntryId: string | null;
    /** Timestamp */
    startedAt: string;
}
export interface CompletedRewindState {
    /** Report retained after a successful rewind. */
    report: string;
    /** Timestamp for the checkpoint that was rewound. */
    startedAt: string;
    /** Timestamp when the rewind completed. */
    rewoundAt: string;
}
declare const checkpointSchema: import("@oh-my-pi/omptype").FluentType<{
    goal: string;
}, {
    goal: string;
}>;
type CheckpointParams = typeof checkpointSchema.infer;
declare const rewindSchema: import("@oh-my-pi/omptype").FluentType<{
    report: string;
}, {
    report: string;
}>;
type RewindParams = typeof rewindSchema.infer;
export interface CheckpointToolDetails {
    goal: string;
    startedAt: string;
    meta?: OutputMeta;
}
export interface RewindToolDetails {
    report: string;
    rewound: boolean;
    meta?: OutputMeta;
}
export declare class CheckpointTool implements AgentTool<typeof checkpointSchema, CheckpointToolDetails> {
    private readonly session;
    readonly name = "checkpoint";
    readonly approval: "read";
    readonly label = "Checkpoint";
    readonly summary = "Create a git-based checkpoint to save and restore session state";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        goal: string;
    }, {
        goal: string;
    }>;
    readonly strict = true;
    readonly loadMode = "discoverable";
    readonly intent: (args: Partial<CheckpointParams>) => string;
    constructor(session: ToolSession);
    static createIf(session: ToolSession): CheckpointTool | null;
    execute(_toolCallId: string, params: CheckpointParams, _signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<CheckpointToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<CheckpointToolDetails>>;
}
export declare class RewindTool implements AgentTool<typeof rewindSchema, RewindToolDetails> {
    private readonly session;
    readonly name = "rewind";
    readonly approval: "read";
    readonly label = "Rewind";
    readonly summary = "Rewind to a previously created checkpoint";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        report: string;
    }, {
        report: string;
    }>;
    readonly strict = true;
    readonly loadMode = "discoverable";
    readonly intent: () => string;
    constructor(session: ToolSession);
    static createIf(session: ToolSession): RewindTool | null;
    execute(_toolCallId: string, params: RewindParams, _signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<RewindToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<RewindToolDetails>>;
}
export {};
