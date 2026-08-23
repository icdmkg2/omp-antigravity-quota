import { Text } from "@oh-my-pi/pi-tui";
/**
 * Dim transcript marker for tool calls stripped from the resolved branch
 * (failed/retried turns, results on sibling branches). It is tool activity,
 * so it hides and reappears with the `display.hideToolActivity` toggle.
 */
export declare class StrippedToolCallsPlaceholder extends Text {
    #private;
    constructor(strippedToolCalls: number, toolActivityVisible: boolean);
    setToolActivityVisible(visible: boolean): void;
    render(width: number): readonly string[];
}
