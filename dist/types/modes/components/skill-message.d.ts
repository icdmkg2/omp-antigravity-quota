import { Container } from "@oh-my-pi/pi-tui";
import type { CustomMessage, SkillPromptDetails } from "../../session/messages.js";
export declare class SkillMessageComponent extends Container {
    #private;
    private readonly message;
    constructor(message: CustomMessage<SkillPromptDetails>);
    setExpanded(expanded: boolean): void;
    invalidate(): void;
}
