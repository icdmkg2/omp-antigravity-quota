import { type Component } from "@oh-my-pi/pi-tui";
import type { BranchSummaryMessage, CompactionSummaryMessage, CustomMessage } from "../../session/messages.js";
/**
 * Compaction point in the transcript, rendered as a slim horizontal divider:
 *
 *   ──────── 📷 remote-compacted · 256K→20K · ctrl+o ────────
 *
 * The label names the maintenance method that fired (remote/soft/handoff/
 * snapcompact; "compacted" for legacy or extension-provided entries) and the
 * before → after context amounts when the entry recorded them. The
 * conversation above the divider stays visible (display transcript keeps
 * full history); only the LLM context was reset. Expanding (ctrl+o) reveals
 * the compaction summary below the divider.
 */
export declare class CompactionSummaryMessageComponent implements Component {
    #private;
    private readonly message;
    constructor(message: CompactionSummaryMessage);
    setExpanded(expanded: boolean): void;
    invalidate(): void;
    render(width: number): readonly string[];
}
/**
 * Handoff is a compaction strategy too, but it is persisted as a custom message
 * so the LLM sees the handoff-specific developer context. Render it with the
 * same divider affordance as `/compact` instead of the generic `[handoff]` box.
 */
export declare class HandoffSummaryMessageComponent implements Component {
    #private;
    private readonly message;
    constructor(message: CustomMessage<unknown>);
    setExpanded(expanded: boolean): void;
    invalidate(): void;
    render(width: number): readonly string[];
}
export declare function createHandoffSummaryMessageComponent(message: CustomMessage<unknown>, expanded: boolean): HandoffSummaryMessageComponent | undefined;
/**
 * A branch summary collapses a side branch back into the main line. Render it
 * with the same slim divider as `/compact` and handoff rather than a `[branch]`
 * box, so every history-collapse point reads as one consistent banner.
 */
export declare class BranchSummaryMessageComponent implements Component {
    #private;
    private readonly message;
    constructor(message: BranchSummaryMessage);
    setExpanded(expanded: boolean): void;
    invalidate(): void;
    render(width: number): readonly string[];
}
