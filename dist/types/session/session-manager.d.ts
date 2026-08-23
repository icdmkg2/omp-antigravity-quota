import type { ImageContent, Message, MessageAttribution, ServiceTierByFamily, TextContent } from "@oh-my-pi/pi-ai";
import type { StructuredSubagentSchemaMode } from "../task/types.js";
import { ArtifactManager } from "./artifacts.js";
import { type BlobPutOptions, type BlobPutResult } from "./blob-store.js";
import type { CompactionMethod } from "./compaction-methods.js";
import { type BashExecutionMessage, type CustomMessage, type FileMentionMessage, type HookMessage, type PythonExecutionMessage } from "./messages.js";
import { type BuildSessionContextOptions, type SessionContext } from "./session-context.js";
import { type NewSessionOptions, type SessionEntry, type SessionHeader, type SessionTitleSource, type SessionTreeNode, type UsageStatistics } from "./session-entries.js";
import { type SessionInfo } from "./session-listing.js";
import { type SessionStorage } from "./session-storage.js";
/** Copy a session's artifact directory to another session, matching interactive `/fork`. */
export declare function copySessionArtifacts(sourceSessionFile: string, destinationSessionFile: string): Promise<void>;
export type ReadonlySessionManager = Pick<SessionManager, "getCwd" | "getSessionDir" | "getSessionId" | "getSessionFile" | "getSessionName" | "getArtifactsDir" | "getArtifactManager" | "allocateArtifactPath" | "saveArtifact" | "getArtifactPath" | "getLeafId" | "getLeafEntry" | "getEntry" | "getLabel" | "getBranch" | "getHeader" | "getEntries" | "getTree" | "getUsageStatistics" | "putBlob" | "putBlobSync">;
interface SessionManagerStateSnapshot {
    cwd: string;
    sessionDir: string;
    sessionId: string;
    sessionName: string | undefined;
    titleSource: SessionTitleSource | undefined;
    sessionFile: string | undefined;
    titleUpdatedAt: string;
    hasTitleSlot: boolean;
    onDisk: boolean;
    needsRewrite: boolean;
    draftOnlySessionCleanupArmed: boolean;
    header: SessionHeader;
    entries: SessionEntry[];
}
/**
 * The storage may have published a write that rejected, and an authoritative
 * repair could not be proven durable. Callers must fail closed until recovery.
 */
export declare class SessionPersistenceIndeterminateError extends AggregateError {
    readonly operationError: Error;
    readonly recoveryErrors: readonly Error[];
    constructor(operationError: Error, recoveryErrors: readonly Error[]);
}
/**
 * Stores and navigates an append-only conversation journal.
 *
 * A session is a JSONL file: one header line followed by entries. Entries form a
 * tree by `(id, parentId)`, and the mutable leaf pointer selects which path is
 * active for future appends and for LLM context construction.
 *
 * Durability is software-crash safe but not power-loss safe: completed entries
 * (user/assistant/toolResult messages, tool_execution_start markers, custom
 * entries) are handed to the OS synchronously in-body on append and never
 * `fsync`'d. In-flight streaming text is intentionally not durable until
 * `message_end` persists the finished message.
 *
 * While an in-place atomic rewrite is publishing, a concurrent completed append
 * supersedes that publish with a synchronous full-body rewrite so the entry is
 * software-crash durable before the append returns; the abandoned atomic's
 * `commitGuard` then refuses to clobber the fresher body.
 *
 * During {@link moveTo}, appends write a full body to the live relocation path
 * (source until rename, destination once the rename has landed) so a crash mid-
 * move still preserves completed entries without recreating a vacated source.
 * A trailing atomic rewrite still rewrites the header cwd after the path is
 * repointed.
 */
export declare class SessionManager {
    #private;
    /**
     * Collab replication tap: invoked for every appended entry with the
     * in-memory (pre-blob-externalization) entry, so inline images survive.
     */
    onEntryAppended?: (entry: SessionEntry) => void;
    private constructor();
    /** Puts a binary blob into the blob store and returns the blob reference. */
    putBlob(data: Buffer, options?: BlobPutOptions): Promise<BlobPutResult>;
    /** Synchronous variant of {@link putBlob} for rebuild-only render paths. */
    putBlobSync(data: Buffer, options?: BlobPutOptions): BlobPutResult;
    captureState(): SessionManagerStateSnapshot;
    /**
     * Create an independent manager for the current logical session and branch.
     * The clone shares the storage backend but owns its entry index and writer, so
     * callers can finish session-owned work after this manager switches elsewhere.
     * Set `persist` false when the original session is intentionally being dropped.
     */
    cloneCurrentSession(options?: {
        persist?: boolean;
    }): SessionManager;
    restoreState(snapshot: SessionManagerStateSnapshot): void;
    /** Switch to a different session file (resume / branch). */
    setSessionFile(sessionFile: string): Promise<void>;
    /** Start a new session. Drains and closes any existing writer first. */
    newSession(options?: NewSessionOptions): Promise<string | undefined>;
    /** Delete a session file and its artifact directory. ENOENT is treated as success. */
    dropSession(sessionPath: string): Promise<void>;
    /**
     * Fork the current session into a new file with the same entries.
     * @returns the old and new session file paths, or undefined when not persisting.
     */
    fork(): Promise<{
        oldSessionFile: string;
        newSessionFile: string;
    } | undefined>;
    /**
     * Move the session to a new working directory: relocate the session file and
     * artifacts on disk, update internal references, and rewrite the header cwd.
     */
    moveTo(newCwd: string, targetSessionDir?: string): Promise<void>;
    /**
     * Force the session onto disk even with no assistant message yet (ACP
     * session/new must create a discoverable file immediately).
     */
    ensureOnDisk(): Promise<void>;
    /** Persist this session's transcript as a newly identified OMP session. */
    persistCopy(options?: {
        sessionDir?: string;
        suppressBreadcrumb?: boolean;
    }, storage?: SessionStorage): Promise<SessionManager>;
    /**
     * Stage a synchronous group of entry appends and publish the resulting full
     * journal with one atomic replace. A failed publish removes only the staged
     * entries, preserves/reparents entries appended concurrently, restores the
     * prior durable file view, and clears the failed writer latch for retry.
     *
     * The callback MUST be synchronous.
     */
    appendEntriesAtomically<T>(append: () => T): Promise<T>;
    /**
     * Replace an uncertain append tail with the authoritative in-memory journal.
     * Callers must only use this for monotonic recovery where every retained
     * entry remains intended (for example, an explicit terminal tombstone).
     */
    recoverPersistenceFromCurrentState(): Promise<void>;
    /** Flush pending writes. Call before switching sessions or on shutdown. */
    flush(): Promise<void>;
    /**
     * Synchronously makes the current append-only session durable. Avoid rewriting
     * an already-current file: large restored sessions can contain GiB of compacted
     * history, and Ctrl+C must not rebuild the whole JSONL string just to flush.
     */
    flushSync(): void;
    /** Flush, then close the append writer. */
    close(): Promise<void>;
    /**
     * Raise the terminal write barrier ahead of the final {@link close}. Once
     * sealed:
     * - every later append, title change, and rewrite is a dropped no-op —
     *   including work an event handler tries to enqueue while dispose is
     *   awaiting `close()` on the disk tail;
     * - the disk epoch is bumped, so queued-but-unexecuted tail work is
     *   superseded and an ALREADY-RUNNING fenced/repair rewrite (awaiting the
     *   tail, drain, writer close, or the atomic stage) fails its commit guard
     *   at the rename fence instead of publishing over a revived file.
     * The final `close()` itself is scheduled after the bump and still runs;
     * pre-seal hot-path appends are already in the page cache. Idempotent;
     * terminal.
     */
    seal(): void;
    /**
     * Terminal release: drop the in-memory transcript and complete the
     * {@link seal}. The entry journal and its index mirror the agent's message
     * array (tool results, file contents, base64 frame images); on a disposed
     * session — e.g. a parked subagent still referenced by the lifecycle
     * adoption record — they would otherwise stay pinned for the process
     * lifetime.
     *
     * Closes the append writer; with the seal up, nothing can reopen it. A
     * revival may reopen the same JSONL through a NEW manager the moment
     * dispose returns; a late event handler resuming on THIS manager must
     * never race that writer — and a post-release rewrite would persist the
     * now-empty entry list, truncating the transcript. Reads after this point
     * reopen from disk (revival, `history://`). Only call from session
     * dispose, after the final `close()`; idempotent.
     */
    releaseRetainedEntries(): void;
    getCwd(): string;
    /** Additional workspace directories beyond cwd (multi-root), absolute and normalized. */
    getAdditionalDirectories(): string[];
    /**
     * Add a workspace directory. Normalizes (relative to cwd), dedupes, rejects
     * the cwd itself, persists to the session header, and triggers an atomic
     * rewrite so the change survives a crash. Returns the resolved absolute
     * path or `null` when the directory was already present (no-op).
     */
    addWorkspaceDirectory(directory: string): Promise<string | null>;
    /**
     * Remove a workspace directory by absolute or cwd-relative path. Persists
     * the trimmed header. Returns the resolved path that was removed, or
     * `null` when the directory was not an additional root (no-op).
     */
    removeWorkspaceDirectory(directory: string): Promise<string | null>;
    /** Seed additional directories from settings or a passed list. Also called on resumed sessions with --add-dir; persists the updated header when the session file is already durable. No-op when the normalized list is unchanged (avoids rewriting large session files on every startup). */
    setAdditionalDirectories(directories: string[]): Promise<void>;
    getUsageStatistics(): UsageStatistics;
    /**
     * Open a new per-turn budget window: snapshot the cumulative output baseline,
     * reset the eval-subagent counter, and set the (optional) ceiling.
     */
    beginTurnBudget(total: number | null, hard: boolean): void;
    recordEvalSubagentOutput(output: number): void;
    getTurnBudget(): {
        total: number | null;
        spent: number;
        hard: boolean;
    };
    getSessionDir(): string;
    getSessionId(): string;
    getSessionFile(): string | undefined;
    /**
     * Whether the current session has actually been materialized to durable
     * storage (the JSONL exists on disk / in the active storage backend).
     *
     * Session persistence is lazy: the file is only written once the history
     * contains an assistant message (or an explicit {@link ensureOnDisk}
     * caller forces it). Until then {@link getSessionFile} returns an allocated
     * path that leads nowhere, so a `--resume <id>` hint built from it would
     * always fail. Consumers that advertise a resume command must gate on this
     * (issue #8860).
     */
    isSessionOnDisk(): boolean;
    getArtifactsDir(): string | null;
    adoptArtifactManager(manager: ArtifactManager): void;
    getArtifactManager(): ArtifactManager | null;
    allocateArtifactPath(toolType: string): Promise<{
        id?: string;
        path?: string;
    }>;
    saveArtifact(content: string, toolType: string): Promise<string | undefined>;
    getArtifactPath(id: string): Promise<string | null>;
    saveDraft(text: string): Promise<void>;
    consumeDraft(): Promise<string | null>;
    /** The source that set the session name: "user" (manual/RPC) or "auto" (generated title). */
    get titleSource(): SessionTitleSource | undefined;
    getSessionName(): string | undefined;
    onSessionNameChanged(cb: () => void): () => void;
    /** Subscribe to persistence failures so hosts can surface lost-durability state. */
    onPersistenceError(cb: (error: Error) => void): () => void;
    /**
     * Set the session display name.
     * @param source "user" for explicit renames; "auto" for generated titles.
     *   Auto titles are ignored once the user has set a name.
     */
    setSessionName(name: string, source?: SessionTitleSource, trigger?: string): Promise<boolean>;
    /**
     * Append a foreign (host-authored) entry verbatim, preserving its
     * `id`/`parentId`. Used by collab guests to mirror the host session.
     */
    ingestReplicatedEntry(entry: SessionEntry): void;
    /**
     * Snapshot the session for collab replication: the live header plus a deep
     * copy of every entry (the host mutates entries in place on rewrite paths, so
     * guests must not share references).
     */
    snapshotForReplication(): {
        header: SessionHeader;
        entries: SessionEntry[];
    };
    /**
     * Append a message as a child of the current leaf, then advance the leaf.
     * CompactionSummaryMessage / BranchSummaryMessage are rejected here — they are
     * top-level entries via appendCompaction()/branchWithSummary().
     */
    appendMessage(message: Message | CustomMessage | HookMessage | BashExecutionMessage | PythonExecutionMessage | FileMentionMessage): string;
    /**
     * Append to a non-active branch without changing the current leaf.
     * Used by work that retains ownership of a branch across tree navigation.
     */
    appendMessageToBranch(message: Message | CustomMessage | HookMessage | BashExecutionMessage | PythonExecutionMessage | FileMentionMessage, parentId: string | null): string;
    /** Append a thinking level change as child of current leaf, then advance leaf. Returns entry id. */
    appendThinkingLevelChange(thinkingLevel?: string, configured?: string): string;
    appendServiceTierChange(serviceTier: ServiceTierByFamily | null): string;
    appendModeChange(mode: string, data?: Record<string, unknown>): string;
    /**
     * Append a model change as a child of the current leaf, then advance the leaf.
     * @param model Model in "provider/modelId" format
     * @param role Optional role (default: "default")
     * @param resolvedModelIsFallback Whether this transition selected a retry-fallback model
     */
    appendModelChange(model: string, role?: string, resolvedModelIsFallback?: boolean): string;
    appendSessionInit(init: {
        systemPrompt: string;
        task: string;
        tools: string[];
        agent?: string;
        modelRole?: string;
        resolvedModel?: string;
        readOnly?: boolean;
        outputSchema?: unknown;
        outputSchemaMode?: StructuredSubagentSchemaMode;
        restrictToolNames?: boolean;
        spawns?: string;
        readSummarize?: boolean;
        advisor?: string;
    }): string;
    appendCompaction<T = unknown>(summary: string, shortSummary: string | undefined, firstKeptEntryId: string, tokensBefore: number, options?: {
        details?: T;
        fromExtension?: boolean;
        preserveData?: Record<string, unknown>;
        method?: CompactionMethod;
        providerReplayThroughEntryId?: string;
        tokensAfter?: number;
    }): string;
    /**
     * Append the durable conversation boundary recorded by `/clear`. The
     * collapsed live transcript and the model-context rebuild start after the
     * latest one, while the full history stays on disk (the plain
     * `transcript:true` export walks it unchanged).
     */
    appendResetBoundary(): string;
    appendCustomEntry(customType: string, data?: unknown): string;
    /**
     * Rewrite the session file after in-place entry updates (e.g. pruning old tool
     * outputs). Use sparingly.
     */
    rewriteEntries(): Promise<void>;
    /**
     * Append a custom message entry (for extensions) that participates in LLM context.
     * @param customType Hook identifier for filtering on reload
     * @param content Message content (string or TextContent/ImageContent array)
     * @param display Whether to show in TUI (true = styled display, false = hidden)
     * @param details Optional extension-specific metadata (not sent to LLM)
     * @param attribution Who initiated this message for billing/attribution semantics
     */
    appendCustomMessageEntry<T = unknown>(customType: string | undefined, content: string | (TextContent | ImageContent)[] | undefined, display: boolean | undefined, details?: T, attribution?: MessageAttribution | undefined): string;
    /** Append a TTSR injection entry recording which rules were injected. */
    appendTtsrInjection(ruleNames: string[]): string;
    /** All unique TTSR rule names injected on the current branch (root → leaf). */
    getInjectedTtsrRules(): string[];
    /** Append a credential pin recording which OAuth account served `provider`. */
    appendCredentialPin(provider: string, hash: string): string;
    /**
     * Latest credential pin per provider on the current branch (root → leaf),
     * with the effective last-use time of the pinned account.
     *
     * Pins are appended only when the serving account *changes*, so a long
     * session on one account carries a single old pin entry. Any assistant turn
     * for the same provider after that pin was necessarily served by the pinned
     * account, so its timestamp advances `lastUsedAt` — a resume seconds after
     * the last turn seeds a warm sticky instead of a stale one.
     */
    getCredentialPins(): Map<string, {
        hash: string;
        lastUsedAt: number;
    }>;
    getLeafId(): string | null;
    getLeafEntry(): SessionEntry | undefined;
    /**
     * The most recent model role on the current branch, or undefined when no
     * model change has been recorded.
     */
    getLastModelChangeRole(): string | undefined;
    getEntry(id: string): SessionEntry | undefined;
    /** All direct children of an entry. */
    getChildren(parentId: string): SessionEntry[];
    getLabel(id: string): string | undefined;
    /**
     * Set or clear a label on an entry. Pass undefined/empty to clear.
     */
    appendLabelChange(targetId: string, label: string | undefined): string;
    /**
     * Walk from an entry to root, returning entries in path order. Includes all
     * entry types; use buildSessionContext() for the resolved LLM messages.
     */
    getBranch(fromId?: string): SessionEntry[];
    /**
     * Build the session context (LLM messages), or — with `{ transcript: true }` —
     * the full-history display transcript, from the current leaf path.
     */
    buildSessionContext(options?: BuildSessionContextOptions): SessionContext;
    /** Strip stale OpenAI Responses assistant replay metadata from loaded entries. */
    sanitizeLoadedOpenAIResponsesReplayMetadata(): boolean;
    getHeader(): SessionHeader | null;
    /** All session entries (excludes header). Returns a shallow copy. */
    getEntries(): SessionEntry[];
    /**
     * The session as a tree. A well-formed session has exactly one root; orphaned
     * entries (broken parent chain) are returned as roots too.
     */
    getTree(): SessionTreeNode[];
    /**
     * Move the leaf to an earlier entry so the next append forms a new branch.
     * Existing entries are never modified or deleted.
     */
    branch(branchFromId: string): void;
    /** Reset the leaf to null so the next append creates a new root entry. */
    resetLeaf(): void;
    /**
     * Durably move the active branch past a discarded entry.
     *
     * The loader reconstructs the active branch from the last physical journal
     * entry, so changing the in-memory leaf alone is lost on reload. Known
     * metadata children are chained onto the discarded entry's parent before the
     * entry is removed. If any child may carry content, the subtree is preserved
     * off-branch instead. Both paths append a metadata-only branch marker and
     * rewrite the journal, making the selected path durable.
     */
    discardEntryDurably(entryId: string): Promise<void>;
    /** Like branch(), but also records a branch_summary of the abandoned path. */
    branchWithSummary(branchFromId: string | null, summary: string, details?: unknown, fromExtension?: boolean): string;
    /**
     * Create a new session file containing only the path from root to `leafId`.
     * Returns the new file path, or undefined when not persisting.
     */
    createBranchedSession(leafId: string): string | undefined;
    /** Resolve the canonical default session directory for a cwd. */
    static getDefaultSessionDir(cwd: string, agentDir?: string, storage?: SessionStorage): string;
    /**
     * Create a new session.
     * @param cwd Working directory (stored in the session header)
     * @param sessionDir Optional session directory; defaults to the cwd-derived dir.
     */
    static create(cwd: string, sessionDir?: string, storage?: SessionStorage): SessionManager;
    /**
     * Create a fresh empty session file in the default session directory for
     * `cwd`, writing only the session header. The returned path can be passed to
     * `setSessionFile` / `AgentSession.switchSession` when a caller explicitly
     * needs a brand-new persisted session at a cwd-derived path.
     */
    static createEmptySessionFile(cwd: string, storage?: SessionStorage): string;
    /**
     * Fork a session into the current project directory: copy history from another
     * session file while creating a fresh session file in this sessionDir.
     *
     * `options.sessionFile` pins the new session's file path (default: an
     * auto-named `<timestamp>_<id>.jsonl` in `sessionDir`). Artifacts are copied
     * recursively by default; nested agents that deliberately share their parent's
     * artifact root may disable this with `copyArtifacts: false`.
     */
    static forkFrom(sourcePath: string, cwd: string, sessionDir?: string, storage?: SessionStorage, options?: {
        copyArtifacts?: boolean;
        suppressBreadcrumb?: boolean;
        sessionFile?: string;
    }): Promise<SessionManager>;
    /**
     * Open a specific session file.
     * @param sessionDir Optional dir for /new or /branch; defaults to the file's parent.
     * @param options.initialCwd Cwd to use when the file is empty or missing.
     */
    static open(filePath: string, sessionDir?: string, storage?: SessionStorage, options?: {
        initialCwd?: string;
        suppressBreadcrumb?: boolean;
    }): Promise<SessionManager>;
    /**
     * Lock-free peek for cold subagent revival: returns the recorded working
     * directory (session header) and the latest `session_init` contract (system
     * prompt / tools / output schema) WITHOUT taking the single-writer lock that
     * {@link open} acquires — the caller re-opens for the actual revive. Returns
     * null when the file can't be read; `init` is null for files written before
     * `session_init` was recorded (no faithful contract to rebuild from).
     */
    static peekSessionInit(filePath: string, storage?: SessionStorage): Promise<{
        cwd: string;
        init: {
            systemPrompt: string;
            task: string;
            tools: string[];
            agent?: string;
            modelRole?: string;
            resolvedModel?: string;
            outputSchema?: unknown;
            outputSchemaMode?: StructuredSubagentSchemaMode;
            restrictToolNames?: boolean;
            spawns?: string;
            readSummarize?: boolean;
            advisor?: string;
        } | null;
    } | null>;
    /** Continue the most recent session, or create a new one if none exists. */
    static continueRecent(cwd: string, sessionDir?: string, storage?: SessionStorage): Promise<SessionManager>;
    /** Create an in-memory session (no file persistence). */
    static inMemory(cwd?: string, storage?: SessionStorage): SessionManager;
    /**
     * List sessions for a project directory.
     * @param sessionDir Optional dir; defaults to the cwd-derived dir.
     */
    static list(cwd: string, sessionDir?: string, storage?: SessionStorage): Promise<SessionInfo[]>;
    /** List all sessions across all project directories, pinned sessions first. */
    static listAll(storage?: SessionStorage): Promise<SessionInfo[]>;
}
/**
 * If the current session was created by `/move` and contains no real
 * user/assistant messages, delete it so empty move sessions don't accumulate.
 */
export declare function cleanupEmptyMoveSession(sessionManager: SessionManager, movedFromEmptySessionFile: string | undefined): Promise<void>;
export {};
