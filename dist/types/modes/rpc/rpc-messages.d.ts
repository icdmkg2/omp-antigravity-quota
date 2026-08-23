import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
export declare const RPC_MESSAGES_PAGE_BUSY_ERROR = "Cannot page messages while the session is changing";
export declare const RPC_MESSAGES_PAGE_STALE_ERROR = "RPC message cursor is stale";
/** Machine-readable reasons a `get_messages_page` request can fail; carried as `code` on the error response. */
export type RpcMessagesPageErrorCode = "session_busy" | "stale_cursor";
/** Paging failure that maps to a structured wire `code`, so clients can react without matching message text. */
export declare class RpcMessagesPageError extends Error {
    readonly code: RpcMessagesPageErrorCode;
    constructor(message: string, code: RpcMessagesPageErrorCode);
}
export interface RpcMessageSnapshot {
    sessionId: string;
    leafId: string | null;
    messageCount: number;
}
export interface RpcMessagesPage {
    messages: AgentMessage[];
    nextCursor?: string;
    totalMessages: number;
}
export interface RpcMessagesPageOptions {
    cursor?: string;
    limit?: number;
}
/** Page one stable in-memory message snapshot without crossing the v1 frame budget. */
export declare function pageRpcMessages(messages: readonly AgentMessage[], snapshot: RpcMessageSnapshot, options?: RpcMessagesPageOptions): RpcMessagesPage;
