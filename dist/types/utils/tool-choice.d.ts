import type { Api, Model, ToolChoice } from "@oh-my-pi/pi-ai";
/**
 * Build a provider-aware tool choice that targets one specific tool when supported.
 * Providers that only expose required/any forcing may still honor named choices by
 * narrowing their request tool list before transport.
 */
export declare function buildNamedToolChoice(toolName: string, model?: Model<Api>): ToolChoice | undefined;
/**
 * Whether the given tool choice can be satisfied by the active tool set for the
 * upcoming turn. Non-named choices (`"none"`, `"required"`, etc.) do not name a
 * specific tool and are therefore always active.
 */
export declare function isToolChoiceActive(toolChoice: ToolChoice | undefined, tools: readonly {
    name: string;
}[]): boolean;
