import { type Component, Container } from "@oh-my-pi/pi-tui";
/**
 * Component that renders a user message
 */
export declare class UserMessageComponent extends Container {
    #private;
    constructor(text: string, synthetic?: boolean, imageLinks?: readonly (string | undefined)[]);
    render(width: number): readonly string[];
}
/**
 * Collapsed placeholder for a synthetic (agent-attributed) user input in the
 * file/remote-backed transcript viewer — chiefly the advisor's `Session update`
 * replay dumps, which can each be hundreds of KiB of Markdown and, on cold open,
 * blocked the TUI for tens of seconds while every historical body was laid out
 * before the viewport clip (issue #6308).
 *
 * Collapsed by default: renders one dim summary row (label · size · line count ·
 * expand hint) and builds NO Markdown. The heavy {@link UserMessageComponent} is
 * constructed lazily only when expanded via `ctrl+o`, so blocks above the
 * viewport never pay layout cost until the reader asks to see them. The raw
 * observability data stays intact in `__advisor.jsonl`.
 */
export declare class CollapsedSyntheticMessageComponent implements Component {
    #private;
    private readonly text;
    private readonly imageLinks?;
    constructor(text: string, imageLinks?: readonly (string | undefined)[] | undefined);
    /** ctrl+o toggle: reveal/hide the full Markdown body. */
    setExpanded(expanded: boolean): void;
    invalidate(): void;
    dispose(): void;
    render(width: number): readonly string[];
}
