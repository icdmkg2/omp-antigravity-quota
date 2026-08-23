import { type Type } from "@oh-my-pi/omptype";
import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback, ToolApprovalDecision } from "@oh-my-pi/pi-agent-core";
import type { DesktopCapabilities } from "@oh-my-pi/pi-natives";
import type { ComputerScreenshot } from "./computer/protocol.js";
import { type ComputerController } from "./computer/supervisor.js";
import type { ToolSession } from "./index.js";
interface ComputerToolInput {
    code: string;
    read_only?: boolean;
    timeout?: number;
}
type ComputerSchema = Type<ComputerToolInput>;
/** Renderer and artifact metadata produced by a computer tool run. */
export interface ComputerToolDetails {
    code?: string;
    readOnly?: boolean;
    screenshots: ComputerScreenshot[];
    returnValue?: string;
    backend?: string;
    capturePermission?: string;
    inputPermission?: string;
    axPermission?: string;
}
/** Creates the session-scoped controller used by the computer tool. */
export type ComputerControllerFactory = (session: ToolSession) => ComputerController;
/** Maps inspection-only runs to read approval and all other runs to execution approval. */
export declare function computerApproval(args: unknown): ToolApprovalDecision;
/** Executes persistent desktop JavaScript through one lazy worker session. */
export declare class ComputerTool implements AgentTool<ComputerSchema, ComputerToolDetails> {
    #private;
    readonly session: ToolSession;
    readonly name = "computer";
    readonly label = "Computer";
    readonly loadMode: "essential";
    readonly concurrency: "exclusive";
    readonly summary = "Control the host desktop with persistent JavaScript and OS accessibility APIs";
    readonly strict = false;
    readonly approval: typeof computerApproval;
    readonly formatApprovalDetails: (args: unknown) => string[];
    constructor(session: ToolSession, createController?: ComputerControllerFactory);
    get parameters(): ComputerSchema;
    get description(): string;
    execute(_toolCallId: string, params: ComputerToolInput, signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<ComputerToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<ComputerToolDetails>>;
    capabilities(): Promise<DesktopCapabilities | undefined>;
    close(): Promise<void>;
}
export {};
