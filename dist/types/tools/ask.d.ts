/**
 * Ask Tool - Interactive user prompting during execution
 *
 * Use this tool when you need to ask the user questions during execution.
 * This allows you to:
 *   1. Gather user preferences or requirements
 *   2. Clarify ambiguous instructions
 *   3. Get decisions on implementation choices as you work
 *   4. Offer choices to the user about what direction to take
 *
 * Usage notes:
 *   - Users will always be able to select "Other" to provide custom text input
 *   - Use multi: true to allow multiple answers to be selected for a question
 *   - Use recommended: <index> to mark the default option; "(Recommended)" suffix is added automatically
 *   - Questions may time out and auto-select the recommended option (configurable, disabled in plan mode)
 */
import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolExample } from "@oh-my-pi/pi-ai";
import { type Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import { type Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "./index.js";
export declare const OTHER_OPTION = "Other (type your own)";
declare const askSchema: import("@oh-my-pi/omptype").FluentType<{
    questions: {
        header?: string | undefined;
        id: string;
        multi?: boolean | undefined;
        options: {
            description?: string | undefined;
            label: string;
            preview?: string | undefined;
        }[];
        question: string;
        recommended?: number | undefined;
    }[];
}, {
    questions: {
        header?: string | undefined;
        id: string;
        multi?: boolean | undefined;
        options: {
            description?: string | undefined;
            label: string;
            preview?: string | undefined;
        }[];
        question: string;
        recommended?: number | undefined;
    }[];
}>;
export type AskToolInput = typeof askSchema.infer;
/**
 * Recover a validated `questions` payload from a persisted `ask` toolCall's
 * `arguments`. Used by `/tree` re-answer (issue #5642): selecting a past
 * `ask` toolResult re-opens the picker with the *original* questions, so the
 * new answer branches as a sibling instead of mutating the old one. Runs the
 * same schema the live tool call validated against — legacy/corrupted
 * persisted args fail closed (`undefined`) rather than feeding malformed
 * data back into the picker.
 */
export declare function recoverAskQuestions(toolCallArguments: unknown): AskToolInput["questions"] | undefined;
/** Result for a single question */
export interface QuestionResult {
    id: string;
    question: string;
    options: string[];
    multi: boolean;
    selectedOptions: string[];
    customInput?: string;
    /** Optional note attached to the selected answer in the rich ask dialog. */
    note?: string;
    /** True when the answer was auto-selected because the dialog timed out. */
    timedOut?: boolean;
}
export interface AskToolDetails {
    question?: string;
    options?: string[];
    multi?: boolean;
    selectedOptions?: string[];
    customInput?: string;
    /** Optional note attached to the selected answer in the rich ask dialog. */
    note?: string;
    /** True when the answer was auto-selected because the dialog timed out. */
    timedOut?: boolean;
    /** Multi-part question mode */
    results?: QuestionResult[];
    /** Chat redirect: the user chose "Chat about this" instead of answering. */
    chatRedirect?: boolean;
    /** Questions surfaced when chatRedirect is true. */
    questions?: string[];
}
type AskParams = AskToolInput;
/**
 * Ask tool for interactive user prompting during execution.
 *
 * Allows gathering user preferences, clarifying instructions, and getting decisions
 * on implementation choices as the agent works.
 */
export declare class AskTool implements AgentTool<typeof askSchema, AskToolDetails> {
    #private;
    private readonly session;
    readonly name = "ask";
    readonly approval: "read";
    readonly label = "Ask";
    readonly summary = "Ask the user a clarifying question";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        questions: {
            header?: string | undefined;
            id: string;
            multi?: boolean | undefined;
            options: {
                description?: string | undefined;
                label: string;
                preview?: string | undefined;
            }[];
            question: string;
            recommended?: number | undefined;
        }[];
    }, {
        questions: {
            header?: string | undefined;
            id: string;
            multi?: boolean | undefined;
            options: {
                description?: string | undefined;
                label: string;
                preview?: string | undefined;
            }[];
            question: string;
            recommended?: number | undefined;
        }[];
    }>;
    readonly strict = true;
    readonly examples: readonly ToolExample<typeof askSchema.infer>[];
    readonly concurrency = "exclusive";
    readonly loadMode = "discoverable";
    constructor(session: ToolSession);
    static createIf(session: ToolSession): AskTool | null;
    execute(_toolCallId: string, params: AskParams, signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<AskToolDetails>, context?: AgentToolContext): Promise<AgentToolResult<AskToolDetails>>;
}
interface AskRenderOption {
    label: string;
    description?: string;
}
interface AskRenderArgs {
    question?: string;
    options?: AskRenderOption[];
    multi?: boolean;
    questions?: Array<{
        id: string;
        question: string;
        options: AskRenderOption[];
        multi?: boolean;
    }>;
}
export declare const askToolRenderer: {
    mergeCallAndResult: boolean;
    renderCall(args: AskRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: AskToolDetails;
    }, _options: RenderResultOptions, uiTheme: Theme): Component;
};
export {};
