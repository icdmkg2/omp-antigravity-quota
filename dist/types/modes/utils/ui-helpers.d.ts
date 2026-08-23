import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import type { AssistantMessage, ImageContent, Message } from "@oh-my-pi/pi-ai";
import { type Component } from "@oh-my-pi/pi-tui";
import type { InteractiveModeContext, RenderSessionContextOptions } from "../../modes/types.js";
import type { SessionContext } from "../../session/session-context.js";
interface RenderInitialMessagesOptions {
    preserveExistingChat?: boolean;
    clearTerminalHistory?: boolean;
}
type AddMessageOptions = {
    imageLinks?: readonly (string | undefined)[];
    reuseSettledComponent?: boolean;
};
export declare class UiHelpers {
    #private;
    private ctx;
    constructor(ctx: InteractiveModeContext);
    /** Extract text content from a user message */
    getUserMessageText(message: Message): string;
    /**
     * Show a status message in the chat.
     *
     * If multiple status messages are emitted back-to-back (without anything else being added to the chat),
     * we update the previous status line instead of appending new ones to avoid log spam.
     */
    showStatus(message: string, options?: {
        dim?: boolean;
    }): void;
    addMessageToChat(message: AgentMessage, options?: AddMessageOptions): Component[];
    /**
     * Render session context to chat. Used for initial load and rebuild after compaction.
     * @param sessionContext Session context to render
     * @param options.updateFooter Update footer state
     * @param options.populateHistory Add user messages to editor history
     */
    renderSessionContext(sessionContext: SessionContext, options?: RenderSessionContextOptions): void;
    /** Build a session context in bounded chunks so terminal input runs between event-loop turns. */
    renderSessionContextIncrementally(sessionContext: SessionContext, options: RenderSessionContextOptions, renderChunk?: () => void): Promise<void>;
    /**
     * Fast-path history rewind (esc-esc branch, /tree rewind to an ancestor):
     * drop the rendered components at/after `message` in place instead of the
     * destructive clear-scrollback replay. Rows already committed to native
     * scrollback are immutable, so the drop is expressible only while every
     * affected block is still wholly inside the visible window; returns false
     * when the caller must fall back to
     * `renderInitialMessages({ clearTerminalHistory: true })`.
     *
     * Callers must have already rewound the session so that `message` and
     * everything after it are no longer part of the view session's transcript.
     */
    truncateTranscriptFromMessage(message: AgentMessage): boolean;
    renderInitialMessages(options?: RenderInitialMessagesOptions): Promise<void>;
    clearEditor(): void;
    showError(errorMessage: string): void;
    showWarning(warningMessage: string, options?: {
        hideWithToolActivity?: boolean;
    }): void;
    showNewVersionNotification(newVersion: string): void;
    updatePendingMessagesDisplay(): void;
    queueCompactionMessage(text: string, mode: "steer" | "followUp", images?: ImageContent[]): void;
    isKnownSlashCommand(text: string): boolean;
    flushCompactionQueue(options?: {
        willRetry?: boolean;
    }): Promise<void>;
    /** Move pending bash components from pending area to chat */
    flushPendingBashComponents(): void;
    findLastAssistantMessage(): AssistantMessage | undefined;
    extractAssistantText(message: AssistantMessage): string;
}
export {};
