/**
 * Coding-agent runner that drives the hashline {@link Patcher} on behalf of
 * the `edit` tool. Converts an `{input}` tool-call payload into a
 * fully-applied patch, wraps the result in the agent's
 * {@link AgentToolResult} shape, and attaches LSP diagnostics + `outputMeta`
 * for the renderer.
 *
 * Multi-section patches are preflighted up front via {@link Patcher.prepare}
 * so a partial batch never lands; the commit loop then narrows the LSP
 * batch's `flush` flag to true only for the final write so diagnostics
 * round-trip once.
 */
import { MismatchError as HashlineMismatchError } from "@oh-my-pi/hashline";
import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { WritethroughCallback, WritethroughDeferredHandle } from "../../lsp/index.js";
import type { ToolSession } from "../../tools/index.js";
import type { AppliedEditObserver } from "../blackbox.js";
import type { EditToolDetails, LspBatchRequest } from "../renderer.js";
import { type HashlineParams, hashlineEditParamsSchema } from "./params.js";
export interface ExecuteHashlineSingleOptions {
    session: ToolSession;
    input: string;
    signal?: AbortSignal;
    batchRequest?: LspBatchRequest;
    writethrough: WritethroughCallback;
    beginDeferredDiagnosticsForPath: (path: string) => WritethroughDeferredHandle;
    /** Observes a committed content transition before result snapshots are pruned. */
    onApplied?: AppliedEditObserver;
}
export declare function executeHashlineSingle(options: ExecuteHashlineSingleOptions): Promise<AgentToolResult<EditToolDetails, typeof hashlineEditParamsSchema>>;
export { HashlineMismatchError, type HashlineParams, hashlineEditParamsSchema };
