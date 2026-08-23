/**
 * AgentLifecycleManager - Owns the idle → parked → revived lifecycle of
 * adopted subagents.
 *
 * The task executor hands a finished agent over via {@link AgentLifecycleManager.adopt};
 * from then on the manager arms a TTL timer whenever the agent goes `idle`,
 * parks it on expiry (disposes the live session, keeps the AgentRef +
 * sessionFile), and revives it on demand through
 * {@link AgentLifecycleManager.ensureLive}. Only this manager flips
 * `parked` ↔ `idle`.
 *
 * Park/dispose is gated against concurrent ensureLive/hub-send:
 * - A disposing session is never handed out.
 * - ensureLive during an in-flight park either cancels the park (session still
 *   live) or waits for detach+park and then revives.
 * - Concurrent ensureLive/park operations coalesce per id.
 *
 * Every adoption, park, and revival is bound to the exact {@link AgentRef} it
 * started from, so stale async work (a late finalizer, a cancelled initializer,
 * a superseded revive) can never clobber a newer same-id ref.
 */
import type { AgentSession } from "../session/agent-session.js";
import { type AgentRef, type AgentRefExpectation, AgentRegistry } from "./agent-registry.js";
export type AgentReviver = (expected: AgentRef) => Promise<AgentSession>;
/**
 * Builds a reviver for a `parked` ref restored from disk (Agent Hub scan,
 * collab mirror, resumed process) that carries a sessionFile but no in-memory
 * adoption. Returns undefined when the ref cannot be faithfully rebuilt (no
 * persisted session contract, or its workspace is gone). Injected from the
 * top-level session so this manager stays free of sdk/SessionManager imports.
 */
export type PersistedSubagentReviverFactory = (ref: AgentRef) => Promise<AgentReviver | undefined>;
export interface AdoptOptions {
    /** TTL before an idle agent is parked. <= 0 disables parking. */
    idleTtlMs: number;
    /** Recreates a live AgentSession from the ref's sessionFile. Absent => not resumable after park (e.g. isolated runs). */
    revive?: AgentReviver;
}
export declare class AgentLifecycleManager {
    #private;
    static global(): AgentLifecycleManager;
    /** Reset the global manager. Test-only. */
    static resetGlobalForTests(): void;
    constructor(registry?: AgentRegistry);
    /**
     * Install the factory used to cold-revive `parked` refs restored from disk
     * (Agent Hub scan, collab mirror, resumed process) — they carry a sessionFile
     * but no adoption. Set by the top-level session, which owns the ambient deps
     * (auth, models, MCP, artifacts) the factory needs at revive time.
     */
    setPersistedSubagentReviverFactory(factory: PersistedSubagentReviverFactory, idleTtlMs: number): void;
    /**
     * Take ownership of a finished subagent. Caller has already set registry
     * status to "idle". Arms the TTL timer (idleTtlMs <= 0 adopts without one).
     * When `expected` is given, the adoption is refused if the id no longer
     * resolves to that ref (or that ref's session).
     */
    adopt(id: string, opts: AdoptOptions, expected?: AgentRefExpectation): void;
    /** True if the id is adopted (parked or live) — and, when `expected` is given, still bound to that ref. */
    has(id: string, expected?: AgentRefExpectation): boolean;
    /**
     * Reclaim a provably-dead parked corpse so a fresh spawn can reuse its id.
     * Refuses live, adopted, in-flight, or cold-revivable refs. For a parked ref
     * restored from disk, the persisted factory is consulted before removal
     * because cold revivers are created lazily by {@link ensureLive}.
     *
     * Only refs in the registry this manager owns are touched; the transcript
     * stays readable at `history://<id>`. Returns true when the corpse was
     * unregistered.
     */
    reclaimDeadCorpse(id: string, expected: AgentRef): Promise<boolean>;
    /**
     * True when this manager owns `registry` — i.e. its adopt/park/revive state
     * describes that registry's refs. Lets a caller holding a specific registry
     * (e.g. a custom-registry {@link IrcBus} that fell back to the global
     * manager) skip lifecycle gating that would consult unrelated park state.
     */
    manages(registry: AgentRegistry): boolean;
    /**
     * True while {@link park} is disposing this agent's session (lets dispose
     * hooks distinguish park from teardown). False once the park is cancelled
     * by ensureLive or after detach+dispose completes. When `expected` is
     * given, only a park bound to that ref (or its session) counts.
     */
    isParking(id: string, expected?: AgentRefExpectation): boolean;
    /**
     * Dispose the live session, detach it from the registry, and mark the
     * agent `parked`. No-op unless the id is adopted and live.
     *
     * The session is detached (and status flipped to `parked`) *before*
     * `session.dispose()` so concurrent {@link ensureLive}/hub-send never
     * observe or inject into a disposing session. A concurrent ensureLive that
     * arrives before detach cancels the park and keeps the live session.
     */
    park(id: string): Promise<void>;
    /**
     * Return the live session, reviving from the sessionFile if parked.
     * Throws a plain Error if the id is unknown or parked without a reviver.
     * Concurrent calls share one in-flight revive.
     *
     * Never returns a session that is mid-dispose: an in-flight park is either
     * cancelled (session still live) or awaited to completion before revive.
     */
    ensureLive(id: string): Promise<AgentSession>;
    /**
     * Dispose if live and drop timers. When `expected` is given, only a ref
     * matching it is released; a stale release can never take down a newer
     * same-id ref. Returns true when a matching ref was released.
     *
     * By default the ref is unregistered (teardown / one-shot removal). Pass
     * `tombstone: true` for an explicit kill: the ref is kept registered as a
     * terminal `aborted` row (session detached) instead of being removed, so a
     * later persisted-subagent scan (e.g. Agent Hub reopen) skips it via its
     * `if (!registry.get(id))` guard rather than re-adopting the surviving
     * on-disk transcript as a fresh `parked` row. Mirrors
     * `finalizeSubagentLifecycle`'s genuine-kill path.
     */
    release(id: string, expected?: AgentRefExpectation, options?: {
        tombstone?: boolean;
    }): Promise<boolean>;
    /** Teardown everything; disposing the global manager makes its next owner a fresh instance. */
    dispose(deadlineAt?: number): Promise<void>;
}
