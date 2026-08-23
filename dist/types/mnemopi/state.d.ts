import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import type * as MnemopiNs from "@oh-my-pi/pi-mnemopi";
import type { Mnemopi, RecallResult } from "@oh-my-pi/pi-mnemopi";
import type * as MnemopiCoreNs from "@oh-my-pi/pi-mnemopi/core";
import type { AgentSession } from "../session/agent-session.js";
import type { MnemopiBackendConfig } from "./config.js";
/**
 * Lazily load `@oh-my-pi/pi-mnemopi` (memoized) and route fastembed loads
 * through the dedicated embeddings subprocess. The override is installed once
 * — before any consumer gets the chance to call `embed()` — so
 * `onnxruntime-node`'s NAPI constructor + finalizer never run inside the
 * agent's address space (issue #3031). Test seams that swap the initializer
 * with `setLocalModelInitializerForTests` still win because both go through
 * the same module-level slot.
 */
export declare function loadMnemopi(): Promise<typeof MnemopiNs>;
/** Lazily load `@oh-my-pi/pi-mnemopi/core` (memoized). */
export declare function loadMnemopiCore(): Promise<typeof MnemopiCoreNs>;
/** Sync access for code below an async boundary that already awaited {@link loadMnemopi}. */
export declare function requireMnemopi(): typeof MnemopiNs;
/** Sync access for code below an async boundary that already awaited {@link loadMnemopiCore}. */
export declare function requireMnemopiCore(): typeof MnemopiCoreNs;
interface MnemopiScopedMemory {
    bank: string;
    memory: Mnemopi;
}
type MnemopiRememberInput = Parameters<Mnemopi["remember"]>[0];
type MnemopiRememberOptions = Parameters<Mnemopi["remember"]>[1];
export type MnemopiMemoryEditOperation = "update" | "forget" | "invalidate";
export interface MnemopiMemoryEditOptions {
    content?: string;
    importance?: number;
    replacementId?: string;
}
export interface MnemopiMemoryEditResult {
    status: "updated" | "deleted" | "invalidated" | "not_found" | "not_editable";
    bank?: string;
    store?: MnemopiMemoryStore;
}
/** Which mnemopi table a resolved memory id lives in. `fact` rows are
 * read-only projections of fact extraction (issue #4725): resolvable for
 * reads, never editable. */
export type MnemopiMemoryStore = "working" | "episodic" | "fact";
/**
 * Full-row lookup result produced by {@link MnemopiSessionState.getScopedMemory}.
 * Mirrors the shape stored in mnemopi's working/episodic tables, tagged with
 * the scoped bank that actually held the row so callers can render it with
 * meaningful context.
 */
export interface MnemopiScopedMemoryHit {
    bank: string;
    store: MnemopiMemoryStore;
    row: {
        id: string;
        content: string;
        source: string | null;
        timestamp: string | null;
        importance: number | null;
        veracity: string | null;
        created_at: string | null;
        session_id: string | null;
        memory_type: string | null;
        metadata: unknown;
    };
}
export declare function getMnemopiSessionState(session: AgentSession | undefined): MnemopiSessionState | undefined;
export declare function setMnemopiSessionState(session: AgentSession, state: MnemopiSessionState | undefined): MnemopiSessionState | undefined;
export interface MnemopiSessionStateOptions {
    sessionId: string;
    config: MnemopiBackendConfig;
    session: AgentSession;
    aliasOf?: MnemopiSessionState;
    lastRetainedTurn?: number;
    hasRecalledForFirstTurn?: boolean;
}
export declare class MnemopiSessionState {
    #private;
    sessionId: string;
    readonly config: MnemopiBackendConfig;
    readonly session: AgentSession;
    readonly memory: Mnemopi;
    readonly globalMemory?: Mnemopi;
    readonly aliasOf?: MnemopiSessionState;
    private readonly scoped;
    lastRetainedTurn: number;
    hasRecalledForFirstTurn: boolean;
    lastRecallSnippet?: string;
    unsubscribe?: () => void;
    constructor(options: MnemopiSessionStateOptions);
    setSessionId(sessionId: string): void;
    resetConversationTracking(): void;
    getScopedRecallTargets(): readonly MnemopiScopedMemory[];
    getScopedRetainTarget(): MnemopiScopedMemory;
    /**
     * Read counterpart to {@link editScopedMemory}: fetch a memory row by id
     * from any bank this session recalls from (retain, recall, global). First
     * hit wins in the same order {@link editScopedMemory} would touch, so the
     * shape matches what an `update`/`forget`/`invalidate` on the same id will
     * see. Returns `null` when the id is not found anywhere in scope.
     *
     * Backs the coding-agent `memory://<id>` URL so agents can inspect the
     * FULL content of a recall preview (recall clips content — see
     * {@link RecallResult.truncated}) before issuing a wholesale
     * `memory_edit update` that would otherwise overwrite unseen bytes
     * (issue #4443).
     */
    getScopedMemory(id: string): MnemopiScopedMemoryHit | null;
    editScopedMemory(op: MnemopiMemoryEditOperation, id: string, options?: MnemopiMemoryEditOptions): MnemopiMemoryEditResult;
    formatScopedRecallWithIds(results: readonly RecallResult[]): string;
    collectScopedRecallResults(query: string): Promise<RecallResult[]>;
    recallResultsScoped(query: string): Promise<RecallResult[]>;
    formatScopedRecallContext(results: readonly RecallResult[], format?: "bullet" | "json"): string | undefined;
    formatContextScoped(results: readonly RecallResult[], format?: "bullet" | "json"): string;
    rememberInScope(memory: MnemopiRememberInput, options?: MnemopiRememberOptions): string | undefined;
    rememberScoped(memory: MnemopiRememberInput, options?: MnemopiRememberOptions): string | undefined;
    recallForContext(query: string): Promise<string | undefined>;
    beforeAgentStartPrompt(promptText: string): Promise<string | undefined>;
    recallForCompaction(messages: AgentMessage[]): Promise<string | undefined>;
    maybeRetainOnAgentEnd(_messages: AgentMessage[]): Promise<void>;
    forceRetainCurrentSession(options?: {
        extract?: boolean;
    }): Promise<void>;
    retainMessages(messages: Array<{
        role: string;
        content: string;
    }>, sourceId: string, options?: {
        extract?: boolean;
        retainedThroughUserTurn?: number;
    }): Promise<void>;
    attachSessionListeners(): void;
    maybeRecallOnAgentStart(): Promise<void>;
    /**
     * Capture the current transcript, drain in-flight fact extraction, and
     * optionally run beam consolidation on every owned bank. The explicit
     * `/memory enqueue` path requests full cross-session consolidation; disposal
     * composes the lighter retain-and-flush path with closing the DB handles.
     *
     * Aliased subagent states share `scoped` (and therefore the actual SQLite
     * banks) with their parent. `consolidate()` deliberately does NOT
     * short-circuit on `aliasOf`: `forceRetainCurrentSession` already guards
     * itself, and an explicit `/memory enqueue` invoked from within a subagent
     * still needs to flush extractions and sleep the parent's shared banks —
     * otherwise enqueue would report success while leaving the subagent's
     * retained memories unconsolidated until a later full consolidation request
     * (PR #2327 review).
     *
     * @param options.full - When true, run `sleepAllSessions` on every owned bank
     *  (the full cross-session consolidation used by `/memory enqueue`). When
     *  false (the default), run only `sleep` on the current session when bank
     *  sleep is enabled.
     * @param options.sleep - When false, skips the bank sleep step entirely.
     *  Used on the interactive shutdown path so `dispose` does not block on
     *  synchronous consolidation of old working rows from previous sessions.
     * @param options.extract - When false, the retained transcript is stored but
     *  no LLM fact extraction is scheduled. Used on the interactive shutdown path
     *  so `dispose` does not block on a fresh LLM round-trip.
     */
    consolidate(options?: {
        full?: boolean;
        extract?: boolean;
        sleep?: boolean;
    }): Promise<void>;
    dispose(options?: {
        consolidate?: boolean;
        timeoutMs?: number;
    }): Promise<void>;
}
export declare function getMnemopiScopedDbPaths(config: MnemopiBackendConfig): readonly string[];
export declare function getMnemopiScopedBanks(config: MnemopiBackendConfig): readonly string[];
export {};
