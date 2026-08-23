/**
 * Host-side handler for the eval `completion()` helper.
 *
 * Both eval runtimes (JS worker + Python kernel) route helper→host calls
 * through {@link callSessionTool}. Reserving the synthetic tool name
 * {@link EVAL_COMPLETION_BRIDGE_NAME} lets a single host handler serve both
 * transports without registering an agent-visible tool: cell code calls
 * `completion(prompt, opts)`, the prelude forwards `{ prompt, model, system?, schema? }`
 * through the bridge, and this module performs one stateless completion.
 *
 * The call is oneshot and toolless from the model's perspective — pure text
 * in, text (or, with `schema`, a structured object) out.
 */
import type { ToolSession } from "../tools/index.js";
import type { JsStatusEvent } from "./js/shared/types.js";
/** Synthetic bridge name reserved for the `completion()` helper across both runtimes. */
export declare const EVAL_COMPLETION_BRIDGE_NAME = "__completion__";
type CompletionTier = "smol" | "default" | "slow";
export interface EvalCompletionBridgeOptions {
    session: ToolSession;
    signal?: AbortSignal;
    emitStatus?: (event: JsStatusEvent) => void;
}
export interface EvalCompletionResult {
    text: string;
    details: {
        model: string;
        tier: CompletionTier;
        structured: boolean;
    };
}
/**
 * Run a single stateless completion on behalf of an eval cell's `completion()` call.
 * Returns a `{ text, details }` value shaped like a {@link callSessionTool}
 * result so the existing bridge transport carries it to either runtime.
 */
export declare function runEvalCompletion(args: unknown, options: EvalCompletionBridgeOptions): Promise<EvalCompletionResult>;
export {};
