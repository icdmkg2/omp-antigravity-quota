import { type Component } from "@oh-my-pi/pi-tui";
import { OverlayPanel } from "./overlay-box.js";
interface UserMessageItem {
    id: string;
    text: string;
    timestamp?: string;
}
/**
 * Custom user message list component with selection
 */
declare class UserMessageList implements Component {
    #private;
    private readonly messages;
    onSelect?: (entryId: string) => void;
    onCancel?: () => void;
    constructor(messages: UserMessageItem[]);
    invalidate(): void;
    render(width: number): readonly string[];
    handleInput(keyData: string): void;
}
/**
 * Component that renders a user message selector for branching
 */
export declare class UserMessageSelectorComponent extends OverlayPanel {
    #private;
    constructor(messages: UserMessageItem[], onSelect: (entryId: string) => void, onCancel: () => void);
    getMessageList(): UserMessageList;
}
export {};
