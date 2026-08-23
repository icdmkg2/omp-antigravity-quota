import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolExample } from "@oh-my-pi/pi-ai";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "../sdk.js";
import type { SessionEntry } from "../session/session-entries.js";
export type TodoStatus = "pending" | "in_progress" | "completed" | "abandoned" | "blocked";
/** Operation names accepted by the todo tool and echoed in successful result details. */
export type TodoOperation = "init" | "start" | "done" | "rm" | "drop" | "block" | "unblock" | "append" | "view";
export interface TodoItem {
    content: string;
    status: TodoStatus;
    /** When `status === "blocked"`, an optional note on what the task is waiting for. */
    blocker?: string;
}
export interface TodoPhase {
    name: string;
    tasks: TodoItem[];
}
/** Whether an unknown value is a persisted todo phase. */
export declare function isTodoPhase(value: unknown): value is TodoPhase;
export interface TodoCompletionTransition {
    phase: string;
    content: string;
}
export interface TodoToolDetails {
    /** Operation that produced this snapshot; absent on legacy transcript entries. */
    op?: TodoOperation;
    phases: TodoPhase[];
    storage: "session" | "memory";
    completedTasks?: TodoCompletionTransition[];
}
declare const todoSchema: import("@oh-my-pi/omptype").FluentType<{
    items?: string[] | undefined;
    list?: {
        items: string[];
        phase: string;
    }[] | undefined;
    op: "append" | "block" | "done" | "drop" | "init" | "rm" | "start" | "unblock" | "view";
    phase?: string | undefined;
    reason?: string | undefined;
    task?: string | undefined;
}, {
    items?: string[] | undefined;
    list?: {
        items: string[];
        phase: string;
    }[] | undefined;
    op: "append" | "block" | "done" | "drop" | "init" | "rm" | "start" | "unblock" | "view";
    phase?: string | undefined;
    reason?: string | undefined;
    task?: string | undefined;
}>;
type TodoParams = TodoSchema;
type TodoSchema = typeof todoSchema.infer;
/** A single todo op entry (the params object itself). */
type TodoOpEntryValue = TodoParams;
/** Return the active todo task, preferring an in-progress item over the first pending item. */
export declare function nextActionableTask(phases: readonly TodoPhase[]): TodoItem | undefined;
export declare const USER_TODO_EDIT_CUSTOM_TYPE = "user_todo_edit";
export declare function getLatestTodoPhasesFromEntries(entries: SessionEntry[]): TodoPhase[];
/**
 * Report whether `content` likely names the same work as any entry in
 * `descriptions`. Used by the sticky todo panel to light up a pending todo
 * when an in-flight subagent is doing the work for it, without requiring
 * the caller to flip the todo's status.
 *
 * Matching is normalize-then-equal first (lowercased; punctuation and
 * whitespace runs both collapsed to a single space; trimmed), with a
 * substring fallback in either direction so minor wording drift
 * ("Sonnet #2: bug scan" vs "Sonnet #2") still links up. The substring
 * fallback requires at least {@link TODO_DESCRIPTION_MIN_OVERLAP} chars on
 * the contained side.
 */
export declare function todoMatchesAnyDescription(content: string, descriptions: readonly string[]): boolean;
/** Whether a todo is settled: completed or deliberately abandoned. Shared so
 *  the collapsed viewport, the HUD progress counters, and the HUD's closed-todo
 *  auto-clear can never disagree about what "done" hides. */
export declare function isClosedTodo<T extends {
    status: TodoStatus;
}>(task: T): boolean;
/** Result of {@link selectCollapsedTodos}: the rows to render plus an optional
 *  summary line (empty string ⇒ no summary row). */
export interface CollapsedTodoSelection<T> {
    items: T[];
    summary: string;
}
/**
 * Walking-viewport selection for a phase's collapsed todo preview (#5873).
 *
 * Applied to `tasks` in todo order: the open tasks run through
 * {@link selectWithinCap}, led by the last {@link COLLAPSED_CLOSED_CONTEXT}
 * closed tasks in todo order so a checked row remains visible even when callers
 * complete work out of sequence. The lead is additive — it never costs an open
 * row — and a phase with no open work left falls back to its closed tasks so the
 * sticky HUD's closed-todo persistence still has something to render.
 *
 * `summary` counts the open tasks that did not fit; the closed lead is context,
 * not part of the budget.
 */
export declare function selectCollapsedTodos<T extends {
    status: TodoStatus;
}>(tasks: T[], isMatched: (task: T) => boolean, cap: number): CollapsedTodoSelection<T>;
/** Apply an array of `todo`-style ops to existing phases. Used by /todo slash command. */
export declare function applyOpsToPhases(currentPhases: TodoPhase[], ops: TodoOpEntryValue[]): {
    phases: TodoPhase[];
    errors: string[];
};
export declare function resolveTodoMarkdownPath(input: string, cwd: string): string;
/** Render todo phases as a Markdown checklist suitable for editing/copying. */
export declare function phasesToMarkdown(phases: TodoPhase[]): string;
/** Parse a Markdown checklist back into todo phases. */
export declare function markdownToPhases(md: string): {
    phases: TodoPhase[];
    errors: string[];
};
export declare class TodoTool implements AgentTool<typeof todoSchema, TodoToolDetails> {
    private readonly session;
    readonly name = "todo";
    readonly approval: "read";
    readonly label = "Todo";
    readonly summary = "Write a structured todo list to track progress within a session";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        items?: string[] | undefined;
        list?: {
            items: string[];
            phase: string;
        }[] | undefined;
        op: "append" | "block" | "done" | "drop" | "init" | "rm" | "start" | "unblock" | "view";
        phase?: string | undefined;
        reason?: string | undefined;
        task?: string | undefined;
    }, {
        items?: string[] | undefined;
        list?: {
            items: string[];
            phase: string;
        }[] | undefined;
        op: "append" | "block" | "done" | "drop" | "init" | "rm" | "start" | "unblock" | "view";
        phase?: string | undefined;
        reason?: string | undefined;
        task?: string | undefined;
    }>;
    readonly concurrency = "exclusive";
    readonly strict = true;
    readonly lenientArgValidation = true;
    readonly examples: readonly ToolExample<typeof todoSchema.infer>[];
    readonly loadMode = "discoverable";
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: TodoParams, _signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<TodoToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<TodoToolDetails>>;
}
type TodoRenderOp = {
    op?: string;
    task?: string;
    phase?: string;
    items?: string[];
};
/** New single-op shape `{op,...}`; legacy `{ops:[...]}` still seen in old transcripts. */
type TodoRenderArgs = TodoRenderOp & {
    ops?: TodoRenderOp[];
};
/** One-based ASCII roman numeral for display (I, II, III, IV, …). */
export declare function phaseRomanNumeral(oneBasedIndex: number): string;
/**
 * Display-only phase header: `I. Foundation`. State and prompts never see this.
 *
 * Sanitized for the same reason task labels are: this is a render boundary and
 * the name may carry provider or session text holding control sequences. The
 * raw `phase.name` stays the lookup key everywhere else.
 */
export declare function formatPhaseDisplayName(name: string, oneBasedIndex: number): string;
export declare const TODO_STRIKE_HOLD_FRAMES = 2;
export declare const TODO_STRIKE_REVEAL_FRAMES = 12;
export declare const TODO_STRIKE_TOTAL_FRAMES: number;
/** Wire the live-subagent description source for {@link todoToolRenderer}. */
export declare function setActiveTodoDescriptionsProvider(provider: () => readonly string[]): void;
export declare const todoToolRenderer: {
    renderCall(args: TodoRenderArgs, options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: TodoToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions, uiTheme: Theme, args?: TodoRenderArgs): Component;
    mergeCallAndResult: boolean;
};
export {};
