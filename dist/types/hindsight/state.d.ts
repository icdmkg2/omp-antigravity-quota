import type { AgentSession } from "../session/agent-session.js";
import { type BankScope } from "./bank.js";
import type { HindsightApi } from "./client.js";
import type { HindsightConfig } from "./config.js";
import { type HindsightMessage } from "./content.js";
interface RecallOutcome {
    context: string | null;
    ok: boolean;
}
export interface HindsightSessionStateOptions {
    /** Session id used for retain-queue metadata. */
    sessionId: string;
    client: HindsightApi;
    bankId: string;
    /** Tags applied to every retain — non-empty in per-project-tagged mode. */
    retainTags?: string[];
    /** Tag filter applied to every recall/reflect — non-empty in per-project-tagged mode. */
    recallTags?: string[];
    recallTagsMatch?: "any" | "all" | "any_strict" | "all_strict";
    config: HindsightConfig;
    session: AgentSession;
    banksSet: Set<string>;
    lastRetainedTurn?: number;
    hasRecalledForFirstTurn?: boolean;
    /**
     * When set, this entry is a subagent alias that reuses the parent's bank,
     * scope, config, client, and banksSet. Aliases skip auto-recall and
     * auto-retain — those run on the parent only — but the recall/retain/reflect
     * tools resolve via the alias so they persist to the same bank as the parent.
     */
    aliasOf?: HindsightSessionState;
}
/**
 * Debounced batch queue for tool-initiated `retain` calls owned by one
 * Hindsight session state instance.
 *
 * Auto-retain (`HindsightSessionState.retainSession`) is intentionally not
 * routed through this queue — it submits a full transcript as one large item
 * and already runs `async: true` server-side.
 */
export declare class HindsightRetainQueue {
    #private;
    constructor(state: HindsightSessionState);
    get depth(): number;
    enqueue(content: string, context?: string): void;
    flush(): Promise<void>;
    dispose(): void;
}
/** Per-session Hindsight runtime state owned by its AgentSession. */
export declare class HindsightSessionState {
    #private;
    /** Session id used for retain-queue metadata. */
    sessionId: string;
    client: HindsightApi;
    bankId: string;
    /** Tags applied to every retain — non-empty in per-project-tagged mode. */
    retainTags?: string[];
    /** Tag filter applied to every recall/reflect — non-empty in per-project-tagged mode. */
    recallTags?: string[];
    recallTagsMatch?: "any" | "all" | "any_strict" | "all_strict";
    config: HindsightConfig;
    session: AgentSession;
    banksSet: Set<string>;
    lastRetainedTurn: number;
    hasRecalledForFirstTurn: boolean;
    lastRecallSnippet?: string;
    /** Cached `<mental_models>` block injected into developer instructions. */
    mentalModelsSnippet?: string;
    /** When the cached snippet was last refreshed; gates the agent_end re-list. */
    mentalModelsLoadedAt?: number;
    /**
     * In-flight ensure+load promise. `beforeAgentStartPrompt` awaits this on
     * the first turn so the MM block lands in the system prompt before the
     * LLM generates, even though `start()` returns before the load completes.
     */
    mentalModelsLoadPromise?: Promise<void>;
    unsubscribe?: () => void;
    /**
     * Releases the `onHindsightScopeChanged` subscription that drives live
     * rebuilds when `hindsight.bankId` / `bankIdPrefix` / `scoping` change.
     * Only set on primary states; aliases inherit the parent's subscription.
     */
    unsubscribeScope?: () => void;
    /** Alias states delegate persistence config to a primary parent state. */
    aliasOf?: HindsightSessionState;
    readonly retainQueue: HindsightRetainQueue;
    constructor(options: HindsightSessionStateOptions);
    setSessionId(sessionId: string): void;
    resetConversationTracking(): void;
    enqueueRetain(content: string, context?: string): void;
    flushRetainQueue(): Promise<void>;
    recallForContext(query: string, signal?: AbortSignal): Promise<RecallOutcome>;
    retainSession(messages: HindsightMessage[]): Promise<void>;
    maybeRetainOnAgentEnd(): Promise<void>;
    forceRetainCurrentSession(): Promise<void>;
    beforeAgentStartPrompt(promptText: string): Promise<string | undefined>;
    recallForCompaction(messages: HindsightMessage[]): Promise<string | undefined>;
    runMentalModelLoad(scope: BankScope): Promise<void>;
    refreshMentalModelsSnippet(): Promise<void>;
    reloadMentalModels(): Promise<boolean>;
    attachSessionListeners(): void;
    dispose(): void;
}
export {};
