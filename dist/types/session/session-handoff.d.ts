/** Handoff document generation. Committing the document as a compaction entry is owned by SessionMaintenance. */
import { type Agent, type AgentMessage, type StreamFn, type ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Message, Model, ServiceTier, SimpleStreamOptions } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import type { SecretObfuscator } from "../secrets/obfuscator.js";
import type { HandoffResult, SessionHandoffOptions } from "./agent-session-types.js";
import type { SessionManager } from "./session-manager.js";
/** Capabilities borrowed from the owning AgentSession. */
export interface SessionHandoffHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    modelRegistry: ModelRegistry;
    sideStreamFn: StreamFn;
    obfuscator: SecretObfuscator | undefined;
    model(): Model | undefined;
    thinkingLevel(): ThinkingLevel | undefined;
    sessionId(): string;
    baseSystemPrompt(): string[];
    setSkipPostTurnMaintenance(timestamp: number | undefined): void;
    obfuscateTextForProvider(text: string | undefined): string | undefined;
    deobfuscateFromProvider(text: string): string;
    convertMessagesToLlm(messages: AgentMessage[], signal?: AbortSignal): Promise<Message[]>;
    prepareSimpleStreamOptions(options: SimpleStreamOptions, provider?: string): SimpleStreamOptions;
    effectiveServiceTier(model: Model | undefined): ServiceTier | undefined;
}
/** Generates handoff documents with a cache-friendly oneshot LLM call. */
export declare class SessionHandoff {
    #private;
    constructor(host: SessionHandoffHost);
    /**
     * Cancel in-progress handoff generation, preserving a harness-provided reason.
     */
    abortHandoff(reason?: Error): void;
    /**
     * Check if handoff generation is in progress.
     */
    get isGeneratingHandoff(): boolean;
    /**
     * Generate a handoff document with a oneshot LLM call.
     *
     * The request is built through the same pipeline a live turn uses so the
     * oneshot reads the provider prompt cache the main turn populated. The
     * caller (SessionMaintenance) commits the returned document as a compaction
     * entry; this method rewrites no history.
     *
     * @param customInstructions Optional focus for the handoff document
     * @param options Handoff execution options
     * @returns The handoff document text, or undefined when an auto-triggered
     *   generation produced no content (manual generation throws instead)
     */
    generateDocument(customInstructions?: string, options?: SessionHandoffOptions): Promise<HandoffResult | undefined>;
}
