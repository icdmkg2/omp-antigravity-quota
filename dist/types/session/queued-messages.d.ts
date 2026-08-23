import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import type { AssistantMessage } from "@oh-my-pi/pi-ai";
import type { RestoredQueuedMessage } from "./agent-session-types.js";
import { type CustomMessage } from "./messages.js";
/** Whether a queued message should render in the queue UI. */
export declare function isDisplayableQueuedMessage(message: AgentMessage): boolean;
/** Whether a queued message is an advisor card. */
export declare function isAdvisorCard(message: AgentMessage): message is CustomMessage;
/** Whether a message is a terminal assistant answer containing text and no tools. */
export declare function isTerminalTextAssistantAnswer(message: AgentMessage | undefined): message is AssistantMessage;
/** Whether queued content was authored by the user and can be restored to the editor. */
export declare function isUserQueuedMessage(message: AgentMessage): boolean;
/** Hidden magic-keyword notices queued alongside a user prompt. */
export declare const MAGIC_KEYWORD_NOTICE_TYPES: Record<string, true>;
/** Hidden companion carrying vision descriptions for a text-only model. */
export declare const IMAGE_ATTACHMENT_DESCRIPTION_TYPE = "image-attachment-description";
/** Whether a hidden queued message is a companion of an adjacent user prompt. */
export declare function isHiddenUserCompanion(message: AgentMessage): boolean;
/** Human-readable text shown for a queued-message chip. */
export declare function queueChipText(message: AgentMessage): string;
/** Converts a queued user message to editor-restorable content. */
export declare function toRestoredQueuedMessage(message: AgentMessage): RestoredQueuedMessage;
