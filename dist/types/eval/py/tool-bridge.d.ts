import type { ToolSession } from "../../tools/index.js";
import { type JsStatusEvent } from "../js/tool-bridge.js";
export interface PyToolBridgeEntry {
    toolSession: ToolSession;
    /**
     * Turn-cancel handed to the tool implementation. Raw and never deferred, so
     * delegated work — above all the subagents `agent()` spawns — stops at once.
     */
    signal?: AbortSignal;
    /**
     * Kernel-side abort, held back while a critical `agent()` phase (isolation
     * worktree setup, merge/cherry-pick) is in flight. Decides only when the host
     * may stop waiting on a call and let the kernel unwind; it is never given to
     * a tool. Keeping these separate is what stops a cancel from settling the
     * cell on top of a still-running, abort-insensitive merge.
     */
    shieldedSignal?: AbortSignal;
    emitStatus?: (event: JsStatusEvent) => void;
    abortRequested?: () => boolean;
}
export interface PyToolBridgeInfo {
    url: string;
    token: string;
}
/** Starts the bridge server lazily and returns its connection info. */
export declare function ensurePyToolBridge(): Promise<PyToolBridgeInfo>;
export declare function registerPyToolBridge(sessionId: string, runId: string, entry: PyToolBridgeEntry): () => void;
/** Stop the bridge and clear registrations. Test-only / shutdown helper. */
export declare function disposePyToolBridge(): Promise<void>;
