/**
 * Small helpers over {@link InteractiveModeContext} shared between
 * {@link UiHelpers} and the input/event controllers, so the live chat surfaces
 * construct components and reset editor state identically.
 */
import type { AssistantMessage } from "@oh-my-pi/pi-ai";
import { AssistantMessageComponent } from "../components/assistant-message.js";
import type { InteractiveModeContext } from "../types.js";
/**
 * Construct an {@link AssistantMessageComponent} wired to the live context's
 * thinking/image settings. `message` is omitted for the streaming placeholder
 * component and supplied when rendering a persisted turn.
 */
export declare function createAssistantMessageComponent(ctx: InteractiveModeContext, message?: AssistantMessage): AssistantMessageComponent;
