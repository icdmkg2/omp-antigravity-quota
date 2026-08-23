import { Container } from "@oh-my-pi/pi-tui";
import type { MessageRenderer } from "../../extensibility/extensions/types.js";
import { type CustomMessage } from "../../session/messages.js";
/**
 * Component that renders a custom message entry from extensions.
 * Uses distinct styling to differentiate from user messages.
 */
export declare class CustomMessageComponent extends Container {
    #private;
    private readonly message;
    private readonly customRenderer?;
    constructor(message: CustomMessage<unknown>, customRenderer?: MessageRenderer | undefined);
    setExpanded(expanded: boolean): void;
    invalidate(): void;
}
