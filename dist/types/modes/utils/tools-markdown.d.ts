import type { Tool } from "../../tools/index.js";
export interface ToolsMarkdownBindings {
    tools: ReadonlyArray<Pick<Tool, "description" | "name">>;
    /** Tools mounted under `xd://` URLs, listed after the active set. */
    xdevTools?: ReadonlyArray<{
        name: string;
        summary: string;
    }>;
}
export declare function buildToolsMarkdown(bindings: ToolsMarkdownBindings): string;
