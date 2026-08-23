import type { SessionNotification, SessionUpdate, ToolKind } from "@oh-my-pi/pi-utils/acp";
import type { AgentSessionEvent } from "../../session/agent-session.js";
interface MessageProgress {
    textEmitted: boolean;
    thoughtEmitted: boolean;
}
interface AcpEventMapperOptions {
    getMessageId?: (message: unknown) => string | undefined;
    getMessageProgress?: (message: unknown) => MessageProgress | undefined;
    getToolArgs?: (toolCallId: string) => unknown;
    resolveImageData?: (data: string, mimeType: string | undefined) => string;
    /**
     * Session cwd. Tool call locations sent to ACP clients must be absolute
     * (the editor host needs them to open or focus files). When provided,
     * the mapper resolves raw `path`/`file`/etc. args against this cwd
     * before emitting `ToolCallLocation` entries.
     */
    cwd?: string;
}
export declare function mapToolKind(toolName: string, args?: unknown): ToolKind;
export declare function mapAgentSessionEventToAcpSessionUpdates(event: AgentSessionEvent, sessionId: string, options?: AcpEventMapperOptions): SessionNotification[];
export declare function buildToolCallStartUpdate(input: {
    toolCallId: string;
    toolName: string;
    args: unknown;
    intent?: string;
    cwd?: string;
    status?: "pending" | "completed";
}): SessionUpdate;
export declare function normalizeReplayToolArguments(value: unknown): {
    args: unknown;
};
export declare function extractAssistantMessageText(value: unknown): string;
export {};
