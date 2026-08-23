/**
 * RPC Client for programmatic access to the coding agent.
 *
 * Spawns the agent in RPC mode and provides a typed API for all operations.
 */
import type { AgentEvent, AgentMessage, AgentToolResult, ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { CompactionResult } from "@oh-my-pi/pi-agent-core/compaction";
import type { ImageContent, Model } from "@oh-my-pi/pi-ai";
import type { BashResult } from "../../exec/bash-executor.js";
import type { AgentSessionEvent, SessionStats } from "../../session/agent-session.js";
import { type RpcMessagesPage, type RpcMessagesPageOptions } from "./rpc-messages.js";
import type { RpcAvailableSlashCommand, RpcHandoffResult, RpcHostToolDefinition, RpcSessionState, RpcSubagentEventFrame, RpcSubagentLifecycleFrame, RpcSubagentMessagesResult, RpcSubagentProgressFrame, RpcSubagentSnapshot, RpcSubagentSubscriptionLevel } from "./rpc-types.js";
export interface RpcClientOptions {
    /** Path to the CLI entry point (default: searches for dist/cli.js) */
    cliPath?: string;
    /** Working directory for the agent */
    cwd?: string;
    /** Environment variables */
    env?: Record<string, string>;
    /** Provider to use */
    provider?: string;
    /** Model ID to use */
    model?: string;
    /** Session directory for the agent */
    sessionDir?: string;
    /** Additional CLI arguments */
    args?: string[];
    /** Grace period before escalating process termination (default: process utility default, 1000ms) */
    terminationGraceMs?: number;
    /** Custom tools owned by the embedding host and exposed over the RPC transport */
    customTools?: RpcClientCustomTool[];
}
export type ModelInfo = Pick<Model, "provider" | "id" | "contextWindow" | "reasoning" | "thinking">;
export type RpcEventListener = (event: AgentEvent) => void;
export type RpcSessionEventListener = (event: AgentSessionEvent) => void;
export type RpcSubagentLifecycleListener = (payload: RpcSubagentLifecycleFrame["payload"]) => void;
export type RpcSubagentProgressListener = (payload: RpcSubagentProgressFrame["payload"]) => void;
export type RpcSubagentEventListener = (payload: RpcSubagentEventFrame["payload"]) => void;
export type RpcAvailableCommandsUpdateListener = (commands: RpcAvailableSlashCommand[]) => void;
export interface RpcClientToolContext<TDetails = unknown> {
    toolCallId: string;
    signal: AbortSignal;
    sendUpdate(partialResult: RpcClientToolResult<TDetails>): void;
}
export type RpcClientToolResult<TDetails = unknown> = AgentToolResult<TDetails> | string;
export interface RpcClientCustomTool<TParams extends Record<string, unknown> = Record<string, unknown>, TDetails = unknown> extends Omit<RpcHostToolDefinition, "parameters"> {
    parameters: Record<string, unknown>;
    execute(params: TParams, context: RpcClientToolContext<TDetails>): Promise<RpcClientToolResult<TDetails>> | RpcClientToolResult<TDetails>;
}
export declare function defineRpcClientTool<TParams extends Record<string, unknown> = Record<string, unknown>, TDetails = unknown>(tool: RpcClientCustomTool<TParams, TDetails>): RpcClientCustomTool<TParams, TDetails>;
/** Failed RPC command; `code` mirrors the server's machine-readable error code when present. */
export declare class RpcCommandError extends Error {
    readonly command: string;
    readonly code?: string | undefined;
    constructor(message: string, command: string, code?: string | undefined);
}
export declare class RpcClient {
    #private;
    private options;
    constructor(options?: RpcClientOptions);
    /**
     * Start the RPC agent process.
     *
     * Safe to call again after {@link stop} on the same instance: a fresh
     * {@link AbortController} is minted for each start, and any failure after
     * the child spawn kills the child and clears internal state so callers may
     * retry without leaking processes.
     */
    start(): Promise<void>;
    /**
     * Stop the RPC agent process.
     */
    stop(): Promise<void>;
    /**
     * Stop the RPC agent process and clean up resources.
     */
    [Symbol.dispose](): void;
    /**
     * Subscribe to agent events.
     */
    onEvent(listener: RpcEventListener): () => void;
    /**
     * Subscribe to all top-level session events, including non-core session state events.
     */
    onSessionEvent(listener: RpcSessionEventListener): () => void;
    /**
     * Subscribe to subagent lifecycle frames after setSubagentSubscription("progress" | "events").
     */
    onSubagentLifecycle(listener: RpcSubagentLifecycleListener): () => void;
    /**
     * Subscribe to aggregated subagent progress frames after setSubagentSubscription("progress" | "events").
     */
    onSubagentProgress(listener: RpcSubagentProgressListener): () => void;
    /**
     * Subscribe to raw subagent session events. Call setSubagentSubscription(\"events\") to enable them server-side.
     */
    onSubagentEvent(listener: RpcSubagentEventListener): () => void;
    /**
     * Subscribe to slash-command availability updates emitted by the RPC server.
     */
    onAvailableCommandsUpdate(listener: RpcAvailableCommandsUpdateListener): () => void;
    /**
     * Get collected stderr output (useful for debugging).
     */
    getStderr(): string;
    /**
     * Send a prompt to the agent.
     * Returns immediately after sending; use onEvent() to receive streaming events.
     * Use waitForIdle() to wait for completion.
     */
    prompt(message: string, images?: ImageContent[]): Promise<void>;
    /**
     * Queue a steering message to interrupt the agent mid-run.
     */
    steer(message: string, images?: ImageContent[]): Promise<void>;
    /**
     * Queue a follow-up message to be processed after the agent finishes.
     */
    followUp(message: string, images?: ImageContent[]): Promise<void>;
    /**
     * Abort current operation.
     */
    abort(): Promise<void>;
    /**
     * Abort current operation and immediately start a new turn with the given message.
     */
    abortAndPrompt(message: string, images?: ImageContent[]): Promise<void>;
    /**
     * Start a new session, optionally with parent tracking.
     * @param parentSession - Optional parent session path for lineage tracking
     * @returns Object with `cancelled: true` if an extension cancelled the new session
     */
    newSession(parentSession?: string): Promise<{
        cancelled: boolean;
    }>;
    /**
     * Get current session state.
     */
    getState(): Promise<RpcSessionState>;
    /**
     * Enable or disable fast mode for the active model family.
     */
    setFastMode(enabled: boolean): Promise<{
        enabled: boolean;
        active: boolean;
    }>;
    /**
     * Configure subagent frames emitted by the RPC server. Servers default to "off".
     * "progress" emits lifecycle/progress frames; "events" additionally emits raw subagent session events.
     */
    setSubagentSubscription(level: RpcSubagentSubscriptionLevel): Promise<RpcSubagentSubscriptionLevel>;
    /**
     * Return the RPC server's current subagent snapshot.
     */
    getSubagents(): Promise<RpcSubagentSnapshot[]>;
    /**
     * Read persisted transcript entries for a tracked subagent session.
     */
    getSubagentMessages(selector: {
        subagentId?: string;
        sessionFile?: string;
        fromByte?: number;
    }): Promise<RpcSubagentMessagesResult>;
    /**
     * Set model by provider and ID.
     */
    setModel(provider: string, modelId: string): Promise<{
        provider: string;
        id: string;
    }>;
    /**
     * Cycle to next model.
     */
    cycleModel(): Promise<{
        model: {
            provider: string;
            id: string;
        };
        thinkingLevel: ThinkingLevel | undefined;
        isScoped: boolean;
    } | null>;
    /**
     * Get list of available models.
     */
    getAvailableModels(): Promise<ModelInfo[]>;
    /**
     * Get list of available slash commands.
     */
    getAvailableCommands(): Promise<RpcAvailableSlashCommand[]>;
    /**
     * Set thinking level.
     */
    setThinkingLevel(level: ThinkingLevel): Promise<void>;
    /**
     * Cycle thinking level.
     */
    cycleThinkingLevel(): Promise<{
        level: ThinkingLevel;
    } | null>;
    /**
     * Set steering mode.
     */
    setSteeringMode(mode: "all" | "one-at-a-time"): Promise<void>;
    /**
     * Set follow-up mode.
     */
    setFollowUpMode(mode: "all" | "one-at-a-time"): Promise<void>;
    /**
     * Compact session context.
     */
    compact(customInstructions?: string): Promise<CompactionResult>;
    /**
     * Set auto-compaction enabled/disabled.
     */
    setAutoCompaction(enabled: boolean): Promise<void>;
    /**
     * Set auto-retry enabled/disabled.
     */
    setAutoRetry(enabled: boolean): Promise<void>;
    /**
     * Abort in-progress retry.
     */
    abortRetry(): Promise<void>;
    /**
     * Execute a bash command.
     */
    bash(command: string): Promise<BashResult>;
    /**
     * Abort running bash command.
     */
    abortBash(): Promise<void>;
    /**
     * Get session statistics.
     */
    getSessionStats(): Promise<SessionStats>;
    /**
     * Hand off session context to a new session.
     */
    handoff(customInstructions?: string): Promise<RpcHandoffResult | null>;
    /**
     * Export session to HTML.
     */
    exportHtml(outputPath?: string): Promise<{
        path: string;
    }>;
    /**
     * Switch to a different session file.
     * @returns Object with `cancelled: true` if an extension cancelled the switch
     */
    switchSession(sessionPath: string): Promise<{
        cancelled: boolean;
    }>;
    /**
     * Branch from a specific message.
     * @returns Object with `text` (the message text) and `cancelled` (if extension cancelled)
     */
    branch(entryId: string): Promise<{
        text: string;
        cancelled: boolean;
    }>;
    /**
     * Get messages available for branching.
     */
    getBranchMessages(): Promise<Array<{
        entryId: string;
        text: string;
    }>>;
    /**
     * Get text of last assistant message.
     */
    getLastAssistantText(): Promise<string | null>;
    /**
     * Get one stable, byte-bounded message page.
     */
    getMessagesPage(options?: RpcMessagesPageOptions): Promise<RpcMessagesPage>;
    /** Get all messages, draining stable pages when protocol v2 is available. */
    getMessages(): Promise<AgentMessage[]>;
    /**
     * Get list of OAuth providers available for login, with their current authentication status.
     */
    getLoginProviders(): Promise<Array<{
        id: string;
        name: string;
        available: boolean;
        authenticated: boolean;
    }>>;
    /**
     * Trigger OAuth login for the given provider.
     * The server will emit an `open_url` extension_ui_request for the auth URL.
     * Providers that require pasted-code completion may then emit an `input`
     * extension_ui_request; pass `onManualCodeInput` to satisfy it.
     * Resolves when login completes or rejects on failure.
     *
     * @param onOpenUrl Called when the server emits the auth URL. The host must
     *   open `url` in a browser. When the flow's callback server hosts a
     *   `/launch` redirect, `launchUrl` is a short loopback URL that 302s to
     *   `url` — hosts SHOULD surface it as the truncation-safe copy target so
     *   terminal viewport clipping cannot corrupt trailing OAuth query
     *   parameters (e.g. `code_challenge_method=S256`).
     */
    login(providerId: string, options?: {
        onOpenUrl?: (url: string, instructions?: string, launchUrl?: string) => void;
        onManualCodeInput?: (prompt: {
            title: string;
            placeholder?: string;
        }) => string | Promise<string>;
    }): Promise<{
        providerId: string;
    }>;
    /**
     * Replace the host-owned custom tools exposed to the RPC session.
     * Changes take effect before the next model call.
     */
    setCustomTools(tools: RpcClientCustomTool[]): Promise<string[]>;
    /**
     * Wait for agent to become idle (no streaming).
     * Resolves when agent_end event is received.
     */
    waitForIdle(timeout?: number): Promise<void>;
    /**
     * Collect events until agent becomes idle.
     */
    collectEvents(timeout?: number): Promise<AgentEvent[]>;
    /**
     * Send prompt and wait for completion, returning all events.
     */
    promptAndWait(message: string, images?: ImageContent[], timeout?: number): Promise<AgentEvent[]>;
}
