import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolExample } from "@oh-my-pi/pi-ai";
import type { EvalToolDetails } from "../eval/types.js";
import type { ToolSession } from "./index.js";
export { EVAL_DEFAULT_PREVIEW_LINES, evalToolRenderer } from "./eval-render.js";
/** Language tokens the eval tool accepts, in stable display order. */
export type EvalLanguageToken = "py" | "js" | "rb" | "jl";
/**
 * Per-call input: a single cell. State persists within a language across
 * separate eval calls and across tool calls, so each call is one logical step
 * and later calls reuse what earlier ones defined. This static schema carries
 * the full language union for typing; {@link buildEvalSchema} narrows the wire
 * copy per session so disabled backends are never advertised to the model.
 */
export declare const evalSchema: import("@oh-my-pi/omptype").FluentType<{
    code: string;
    language: "jl" | "js" | "py" | "rb";
    reset?: boolean | undefined;
    timeout?: number | undefined;
    title?: string | undefined;
}, {
    code: string;
    language: "jl" | "js" | "py" | "rb";
    reset?: boolean | undefined;
    timeout?: number | undefined;
    title?: string | undefined;
}>;
export type EvalToolParams = typeof evalSchema.infer;
export type EvalCellInput = EvalToolParams;
export type EvalToolResult = {
    content: Array<{
        type: "text";
        text: string;
    }>;
    details: EvalToolDetails | undefined;
};
export type EvalProxyExecutor = (params: EvalToolParams, signal?: AbortSignal) => Promise<EvalToolResult>;
export interface EvalToolDescriptionOptions {
    py?: boolean;
    js?: boolean;
    rb?: boolean;
    jl?: boolean;
    /**
     * Parent spawn policy (`getSessionSpawns`). `true`/omitted means unrestricted,
     * `false`/`""` hides `agent()`, and a comma list drives the advertised default.
     */
    spawns?: boolean | string | null;
    /** Advertise auto-backgrounding of long-running cells in the tool prompt. */
    autoBackgroundEnabled?: boolean;
}
export declare function getEvalToolDescription(options?: EvalToolDescriptionOptions): string;
export interface EvalToolOptions {
    proxyExecutor?: EvalProxyExecutor;
}
export declare class EvalTool implements AgentTool<typeof evalSchema> {
    #private;
    private readonly session;
    readonly name = "eval";
    readonly approval: "exec";
    readonly formatApprovalDetails: (args: unknown) => string[];
    get summary(): string;
    supportsCodeModeTransport(): boolean;
    readonly loadMode = "essential";
    readonly label = "Eval";
    get description(): string;
    /** All reuse-chain examples; the `examples` getter filters by enabled languages. */
    private static readonly ALL_EXAMPLES;
    get examples(): readonly ToolExample<typeof evalSchema.infer>[];
    get parameters(): typeof evalSchema;
    readonly concurrency = "exclusive";
    readonly strict = true;
    readonly intent: (args: Partial<typeof evalSchema.infer>) => string | undefined;
    constructor(session: ToolSession | null, options?: EvalToolOptions);
    execute(_toolCallId: string, params: typeof evalSchema.infer, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback, ctx?: AgentToolContext): Promise<AgentToolResult<EvalToolDetails | undefined>>;
}
