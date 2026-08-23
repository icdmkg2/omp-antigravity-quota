import type { AgentTool, AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { Model } from "@oh-my-pi/pi-ai";
import { type Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import { type Theme } from "../modes/theme/theme.js";
/** Whether a model transport can suppress native reasoning while private scratchpad thoughts are active. */
export declare function supportsExternalThinking(model: Model | null | undefined): boolean;
declare const thinkSchema: import("@oh-my-pi/omptype").FluentType<{
    thoughts: string;
}, {
    thoughts: string;
}>;
type ThinkParams = typeof thinkSchema.infer;
export type ThinkRenderArgs = {
    thoughts?: string;
};
export declare const thinkToolRenderer: {
    inline: boolean;
    renderCall(args: ThinkRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(): Component;
};
interface ThinkToolDetails {
    recorded: true;
}
/** Records private scratchpad thoughts while native model reasoning is disabled. */
export declare class ThinkTool implements AgentTool<typeof thinkSchema, ThinkToolDetails> {
    readonly name = "think";
    readonly approval: "read";
    readonly label = "Think";
    readonly summary = "Record private scratchpad thoughts";
    readonly description = "private scratchpad; not shown to user";
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        thoughts: string;
    }, {
        thoughts: string;
    }>;
    readonly strict = true;
    readonly intent: "omit";
    execute(_toolCallId: string, _params: ThinkParams): Promise<AgentToolResult<ThinkToolDetails>>;
}
export {};
