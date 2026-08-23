import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import { completeSimple, type ToolExample } from "@oh-my-pi/pi-ai";
import type { ToolSession } from "./index.js";
declare const inspectImageSchema: import("@oh-my-pi/omptype").FluentType<{
    path: string;
    question: string;
}, {
    path: string;
    question: string;
}>;
export type InspectImageParams = typeof inspectImageSchema.infer;
export interface InspectImageToolDetails {
    model: string;
    imagePath: string;
    mimeType: string;
}
export declare class InspectImageTool implements AgentTool<typeof inspectImageSchema, InspectImageToolDetails> {
    private readonly session;
    private readonly completeImageRequest;
    readonly name = "inspect_image";
    readonly approval: "read";
    readonly label = "InspectImage";
    readonly loadMode = "discoverable";
    readonly summary = "Describe or analyze an image file";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        path: string;
        question: string;
    }, {
        path: string;
        question: string;
    }>;
    readonly strict = false;
    readonly examples: readonly ToolExample<typeof inspectImageSchema.infer>[];
    constructor(session: ToolSession, completeImageRequest?: typeof completeSimple);
    execute(_toolCallId: string, params: InspectImageParams, signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<InspectImageToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<InspectImageToolDetails>>;
}
export { inspectImageToolRenderer } from "./inspect-image-renderer.js";
