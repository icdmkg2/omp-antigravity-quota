import { type StructuredSubagentSchemaMode } from "../task/structured-subagent.js";
import type { NestedRepoPatch } from "../task/worktree.js";
import type { ToolSession } from "../tools/index.js";
import type { JsStatusEvent } from "./js/shared/types.js";
import "../tools/review.js";
/** Synthetic bridge name reserved for the `agent()` helper across both runtimes. */
export declare const EVAL_AGENT_BRIDGE_NAME = "__agent__";
export interface EvalAgentBridgeOptions {
    session: ToolSession;
    signal?: AbortSignal;
    emitStatus?: (event: JsStatusEvent) => void;
}
export interface EvalAgentResult {
    text: string;
    /** Parsed structured data returned by the child executor. */
    data?: unknown;
    details: {
        agent: string;
        id: string;
        model?: string | string[];
        structured: boolean;
        schemaSource?: "caller" | "agent" | "session";
        schemaMode?: StructuredSubagentSchemaMode;
        schemaStatus?: "valid" | "invalid";
        isolated?: boolean;
        patchPath?: string;
        branchName?: string;
        nestedPatches?: NestedRepoPatch[];
        changesApplied?: boolean | null;
        isolationSummary?: string;
    };
}
/**
 * Run a single subagent on behalf of an eval cell's `agent()` call.
 */
export declare function runEvalAgent(args: unknown, options: EvalAgentBridgeOptions): Promise<EvalAgentResult>;
