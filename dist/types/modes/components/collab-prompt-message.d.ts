import { Container } from "@oh-my-pi/pi-tui";
import type { CollabPromptDetails } from "../../collab/protocol.js";
import type { CustomMessage } from "../../session/messages.js";
/**
 * Renders a collab guest prompt on every participant's transcript: a
 * user-message-styled bubble prefixed with the author's name.
 */
export declare class CollabPromptMessageComponent extends Container {
    constructor(message: CustomMessage<CollabPromptDetails>);
}
