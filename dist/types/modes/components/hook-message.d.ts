import { Container } from "@oh-my-pi/pi-tui";
import type { HookMessageRenderer } from "../../extensibility/hooks/types.js";
import type { HookMessage } from "../../session/messages.js";
/**
 * Component that renders a custom message entry from hooks.
 * Uses distinct styling to differentiate from user messages.
 */
export declare class HookMessageComponent extends Container {
    #private;
    private readonly message;
    private readonly customRenderer?;
    constructor(message: HookMessage<unknown>, customRenderer?: HookMessageRenderer | undefined);
    setExpanded(expanded: boolean): void;
    invalidate(): void;
}
