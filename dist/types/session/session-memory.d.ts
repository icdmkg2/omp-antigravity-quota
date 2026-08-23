/** Session memory backend lifecycle and transcript resets. */
import type { Agent, AgentTool } from "@oh-my-pi/pi-agent-core";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import type { HindsightSessionState } from "../hindsight/state.js";
import type { MemoryBackendStartOptions } from "../memory-backend/types.js";
import type { MnemopiSessionState } from "../mnemopi/state.js";
/** Capabilities borrowed from the owning AgentSession. */
export interface SessionMemoryHost {
    agent: Agent;
    settings: Settings;
    modelRegistry: ModelRegistry;
    isDisposed(): boolean;
    memoryBackendSession(): MemoryBackendStartOptions["session"];
    getHindsightSessionState(): HindsightSessionState | undefined;
    setHindsightSessionState(state: HindsightSessionState | undefined): void;
    getMnemopiSessionState(): MnemopiSessionState | undefined;
    takeMnemopiSessionState(): MnemopiSessionState | undefined;
    setBaseSystemPrompt(prompt: string[]): void;
    refreshBaseSystemPrompt(): Promise<void>;
    replaceMemoryTools(tools: AgentTool[]): Promise<void>;
}
/** Owns memory backend transitions and transcript-scoped memory state. */
export declare class SessionMemory {
    #private;
    constructor(host: SessionMemoryHost, options: {
        memoryAgentDir?: string;
        memoryTaskDepth?: number;
        createMemoryTools?: () => Promise<AgentTool[]>;
    });
    /** Current serialized backend transition, used by prompt and disposal drains. */
    get transition(): Promise<void>;
    /** Base prompt captured before a per-turn memory promotion. */
    get promotionSnapshot(): string[] | undefined;
    /** Clears the per-turn memory promotion after a canonical prompt rebuild. */
    clearPromotionSnapshot(): void;
    /** Captures the canonical prompt before the first per-turn memory promotion. */
    capturePromotionSnapshot(prompt: string[]): void;
    /** Restores a promotion snapshot while rolling back a failed session switch. */
    restorePromotionSnapshot(prompt: string[] | undefined): void;
    /** Rekeys every active memory backend to the current provider session. */
    rekeyForCurrentSessionId(): void;
    /** Resets transcript-scoped memory counters and removes a promoted prompt. */
    resetContextForNewTranscript(): Promise<void>;
    /** Cancel the local rollout-memory startup owned by this session. */
    cancelLocalMemoryStartup(): void;
    /** Start a new local rollout-memory generation and cancel its predecessor. */
    beginLocalMemoryStartup(): AbortSignal;
    /** Release the local startup slot if `signal` still owns it. */
    endLocalMemoryStartup(signal: AbortSignal): void;
    /**
     * Apply the selected memory backend to runtime state, tools, and prompt.
     * Concurrent settings changes run in order and settle before the next turn.
     */
    applyMemoryBackend(): Promise<void>;
}
