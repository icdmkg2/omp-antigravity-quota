import type { ToolSession } from "../../tools/index.js";
import type { JsDisplayOutput } from "./worker-protocol.js";
export { rewriteImports, wrapCode } from "./shared/rewrite-imports.js";
export type { JsDisplayOutput } from "./worker-protocol.js";
export interface VmRunState {
    signal?: AbortSignal;
    onText?: (chunk: string) => void;
    onDisplay?: (output: JsDisplayOutput) => void;
}
/**
 * Test-only seam: override the graceful-close grace period (ms). Returns the
 * previous value so callers can restore it. Production always uses
 * {@link WORKER_CLOSE_TIMEOUT_MS}; never call this outside tests.
 */
export declare function setWorkerCloseTimeoutMsForTests(ms: number): number;
/** Test-only seam for the legacy Worker lifecycle mocks. */
export declare function setJsEvalWorkerThreadForTests(enabled: boolean): boolean;
export declare function executeInVmContext(options: {
    sessionKey: string;
    sessionId: string;
    /** Logical owner identifier; scopes `reset` on shared contexts and retained-worker cleanup. */
    ownerId?: string;
    cwd: string;
    session: ToolSession;
    localRoots?: Record<string, string>;
    reset?: boolean;
    code: string;
    filename: string;
    timeoutMs?: number;
    runState: VmRunState;
}): Promise<{
    value: unknown;
}>;
export declare function resetVmContext(sessionKey: string): Promise<void>;
export declare function disposeAllVmContexts(): Promise<void>;
/**
 * Shut down retained JS contexts owned solely by `ownerId` (e.g. a subagent's
 * private fork); shared contexts just drop the owner registration.
 */
export declare function disposeVmContextsByOwner(ownerId: string): Promise<void>;
/**
 * Smoke probe: spawn the JS evaluator through the worker-host entry and prove
 * it answers the `init` handshake in a real isolated subprocess (not the inline
 * fallback). Catches silent process-load and init-message regressions
 * that otherwise strand every cell on the init timeout in a distribution build —
 * the failure mode that motivated `installWorkerInbox`. Wired into
 * `omp --smoke-test` so binary / source / tarball installs all exercise it.
 */
export declare function smokeTestJsEvalWorker(): Promise<void>;
