/** Provider-facing message, image, secret, and stream normalization for a session. */
import type { Agent, AgentMessage } from "@oh-my-pi/pi-agent-core";
import type { CompactionPreparation } from "@oh-my-pi/pi-agent-core/compaction";
import type { ImageContent, Message, Model, SimpleStreamOptions } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import type { LocalProtocolOptions } from "../internal-urls/index.js";
import type { SecretObfuscator } from "../secrets/obfuscator.js";
import { type CustomMessage } from "./messages.js";
import type { BuildSessionContextOptions, SessionContext } from "./session-context.js";
import type { SessionManager } from "./session-manager.js";
/** Capabilities borrowed from the owning AgentSession. */
export interface SessionProviderBoundaryHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    modelRegistry: ModelRegistry;
    model(): Model | undefined;
    sessionId(): string;
    localProtocolOptions(): LocalProtocolOptions;
    transformContext(messages: AgentMessage[], signal?: AbortSignal): AgentMessage[] | Promise<AgentMessage[]>;
    convertToLlm(messages: AgentMessage[]): Message[] | Promise<Message[]>;
    onPayload: SimpleStreamOptions["onPayload"] | undefined;
    onResponse: SimpleStreamOptions["onResponse"] | undefined;
    onSseEvent: SimpleStreamOptions["onSseEvent"] | undefined;
    obfuscator: SecretObfuscator | undefined;
}
/** Owns the transformations at the session/provider boundary. */
export declare class SessionProviderBoundary {
    #private;
    constructor(host: SessionProviderBoundaryHost);
    /** Latest image attachments addressable by tools as `Image #N` or `attachment://N`. */
    getImageAttachments(): {
        label: string;
        uri: string;
        image: ImageContent;
        sourcePath: string;
    }[];
    /** Builds the current deobfuscated context for agent display and replay. */
    buildDisplaySessionContext(): SessionContext;
    /** Builds the full display-only transcript context. */
    buildTranscriptSessionContext(options?: Pick<BuildSessionContextOptions, "collapseCompactedHistory" | "keepDanglingToolCalls">): SessionContext;
    /** Obfuscates optional plaintext before a provider request. */
    obfuscateText(text: string | undefined): string | undefined;
    /** Obfuscates summaries and snapcompact plaintext carried into compaction. */
    obfuscateCompactionPreparation(preparation: CompactionPreparation): CompactionPreparation;
    /** Deobfuscates provider text before exposing it to the session. */
    deobfuscateText(text: string): string;
    /** Deobfuscates a streamed delta and removes an incomplete secret placeholder suffix. */
    deobfuscateDelta(text: string): string;
    /** Converts side-request messages through the session's secret boundary. */
    convertToLlmForSideRequest(messages: AgentMessage[]): Message[];
    /** Converts session messages using the configured pre-LLM pipeline. */
    convertMessagesToLlm(messages: AgentMessage[], signal?: AbortSignal): Promise<Message[]>;
    /** Applies session-level stream hooks and provider defaults to a side request. */
    prepareSimpleStreamOptions(options: SimpleStreamOptions, provider?: string): SimpleStreamOptions;
    /** Normalizes image payloads for the active model. */
    normalizeImagesForModel(images: ImageContent[] | undefined): Promise<ImageContent[] | undefined>;
    /** Builds a hidden vision-model description for attachments sent to a text-only model. */
    buildImageDescriptionNotice(normalizedImages: ImageContent[], signal?: AbortSignal): Promise<CustomMessage | undefined>;
    /** Normalizes every image embedded in an agent message. */
    normalizeAgentMessageImages<T extends AgentMessage>(message: T): Promise<T>;
}
