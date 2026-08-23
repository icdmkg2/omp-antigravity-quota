import type { ToolSession } from "../index.js";
import { CmuxTab } from "./cmux/cmux-tab.js";
import { type BrowserHandle, type BrowserKindTag, type CmuxBrowserHandle, type PuppeteerBrowserHandle } from "./registry.js";
import type { ReadyInfo, RunResultOk, Transferable, WorkerInbound, WorkerInitPayload, WorkerOutbound } from "./tab-protocol.js";
interface WorkerHandle {
    send(msg: WorkerInbound, transferList?: Transferable[]): void;
    onMessage(handler: (msg: WorkerOutbound) => void): () => void;
    onError(handler: (error: Error) => void): () => void;
    terminate(): Promise<void>;
    readonly mode: "worker" | "inline";
}
export type DialogPolicy = "accept" | "dismiss";
export interface PendingRun {
    resolve(result: RunResultOk): void;
    reject(error: unknown): void;
    session: ToolSession;
    signal?: AbortSignal;
    toolCalls: Map<string, AbortController>;
    /**
     * Fires when `releaseTab` closes the tab out from under an in-flight run
     * (sibling `browser close --all`, session-scoped reap, etc.). Composed
     * into the cmux run's signal so `wait(...)`, cmux socket calls, and the
     * facade proxies unwind promptly instead of blocking to the run's
     * timeout. `pending.reject` still fires first so the awaiting caller
     * sees the tab-close error immediately; `closeAc` propagates the
     * cancellation into the still-running `runCmuxCode` body (issue #4499).
     */
    closeAc?: AbortController;
}
interface TabSessionBase<TBrowser extends BrowserHandle = BrowserHandle> {
    name: string;
    browser: TBrowser;
    targetId: string;
    state: "alive" | "dead";
    info: ReadyInfo;
    pending: Map<string, PendingRun>;
    dialogPolicy?: DialogPolicy;
    kindTag: BrowserKindTag;
    /**
     * Session id of the caller that CREATED the tab. Preserved across reuse so
     * that dispose of the creating session can reap browser resources without
     * yanking the tab out from under a subagent that only reused it.
     * Undefined when the acquirer did not identify itself.
     */
    ownerSessionId?: string;
}
export interface WorkerTabSession extends TabSessionBase<PuppeteerBrowserHandle> {
    backend: "worker";
    worker: WorkerHandle;
    activateForScreenshot: boolean;
}
export interface CmuxTabSession extends TabSessionBase<CmuxBrowserHandle> {
    backend: "cmux";
    cmuxTab: CmuxTab;
    cmuxOwnsSurface: boolean;
    cmuxAttachedSurface?: string;
}
export type TabSession = WorkerTabSession | CmuxTabSession;
export interface AcquireTabOptions {
    url?: string;
    waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number;
    };
    target?: string;
    signal?: AbortSignal;
    timeoutMs: number;
    dialogs?: DialogPolicy;
    cmuxSurface?: string;
    /**
     * Session id of the acquirer. Recorded on the tab when created (never on
     * reuse) so `releaseTabsForOwner` can walk the shared tabs map on session
     * dispose. Optional — omitting it opts the tab out of session-scoped reap.
     */
    ownerSessionId?: string;
}
export interface AcquireTabResult {
    tab: TabSession;
    created: boolean;
}
export interface RunInTabOptions {
    code: string;
    timeoutMs: number;
    signal?: AbortSignal;
    session: ToolSession;
}
export interface ReleaseTabOptions {
    kill?: boolean;
    /** Maximum time for each asynchronous cleanup resource before close fails with diagnostics. */
    timeoutMs?: number;
}
export declare function getTab(name: string): TabSession | undefined;
export declare function acquireTab(name: string, browser: BrowserHandle, opts: AcquireTabOptions): Promise<AcquireTabResult>;
export declare function runInTab(name: string, opts: RunInTabOptions): Promise<RunResultOk>;
export declare function releaseTab(name: string, opts?: ReleaseTabOptions): Promise<boolean>;
export declare function releaseAllTabs(opts?: ReleaseTabOptions): Promise<number>;
export declare function dropHeadlessTabs(): Promise<void>;
/**
 * Release every tab created by the given session id. Invoked from
 * `AgentSession.dispose()` so headless/spawned Chromium and workers the
 * session opened do not leak into the long-lived process — the module-global
 * `tabs`/`browsers` maps that back this tool are not otherwise walked by
 * session teardown. (Issue #3963.)
 *
 * Ownership is recorded ONLY on tab creation (`acquireTab` with
 * `ownerSessionId`), never on reuse: a subagent re-driving a tab another
 * session opened will not yank teardown responsibility away from the
 * creator. Tabs opened with no owner (e.g. from an SDK caller that doesn't
 * identify a session) are skipped and must be released explicitly.
 */
export declare function releaseTabsForOwner(ownerId: string, opts?: ReleaseTabOptions): Promise<number>;
/** Test-only accessor for the module-global tabs map. */
export declare function getTabsMapForTest(): ReadonlyMap<string, TabSession>;
export declare function initializeTabWorkerForTest(worker: WorkerHandle, payload: WorkerInitPayload, timeoutMs: number): Promise<ReadyInfo>;
export {};
