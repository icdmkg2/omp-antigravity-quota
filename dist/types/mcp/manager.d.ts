import { type TSchema } from "@oh-my-pi/pi-ai";
import type { SourceMeta } from "../capability/types.js";
import type { CustomTool } from "../extensibility/custom-tools/types.js";
import { type AuthStorage } from "../session/auth-storage.js";
import type { McpConnectionStatusEvent } from "./startup-events.js";
import type { MCPToolDetails } from "./tool-bridge.js";
import type { MCPToolCache } from "./tool-cache.js";
import type { MCPAuthChallenge, MCPGetPromptResult, MCPPrompt, MCPRequestOptions, MCPResource, MCPResourceReadResult, MCPResourceTemplate, MCPServerConfig, MCPServerConnection } from "./types.js";
/**
 * Stable, total ordering on MCP tools by name.
 *
 * Anthropic prompt caching keys on byte-identical tool definitions: any reorder
 * of the tools array invalidates the tools cache breakpoint and forces a full
 * prefix rebuild on the next request. MCP servers connect/reconnect at arbitrary
 * times, so the natural "insertion order" of `#tools` is non-deterministic.
 * Sorting after every mutation makes the array bytes independent of connection
 * sequence.
 */
export declare function sortMCPToolsByName<T extends {
    name: string;
}>(tools: T[]): T[];
export declare function resolveSubscriptionPostAction(notificationsEnabled: boolean, currentEpoch: number, subscriptionEpoch: number): "rollback" | "ignore" | "apply";
/** Result of loading MCP tools */
export interface MCPLoadResult {
    /** Loaded tools as CustomTool instances */
    tools: CustomTool<TSchema, MCPToolDetails>[];
    /** Connection errors by server name */
    errors: Map<string, string>;
    /** Connected server names */
    connectedServers: string[];
    /** Extracted Exa API keys from filtered MCP servers */
    exaApiKeys: string[];
}
/** Options for discovering and connecting to MCP servers */
export interface MCPDiscoverOptions {
    /** Whether to load project-level config (default: true) */
    enableProjectConfig?: boolean;
    /** Whether to filter out Exa MCP servers (default: true) */
    filterExa?: boolean;
    /** Whether to filter out browser MCP servers when builtin browser tool is enabled (default: false) */
    filterBrowser?: boolean;
    /** Called when MCP server connection state changes. */
    onStatus?: (event: McpConnectionStatusEvent) => void;
}
/** Handles an MCP `WWW-Authenticate` challenge and returns refreshed config. */
export type MCPAuthHandler = (serverName: string, challenge: MCPAuthChallenge) => Promise<MCPServerConfig | undefined>;
/**
 * MCP Server Manager.
 *
 * Manages connections to MCP servers and provides tools to the agent.
 */
export declare class MCPManager {
    #private;
    private cwd;
    private toolCache;
    /** Process-global instance shared by internal URL protocol handlers and tools. */
    static instance(): MCPManager | undefined;
    /** Install or clear the process-global instance. */
    static setInstance(value: MCPManager | undefined): void;
    /** Reset the process-global instance. Test-only. */
    static resetForTests(): void;
    constructor(cwd: string, toolCache?: MCPToolCache | null);
    /**
     * Register a listener for server-initiated MCP notifications.
     *
     * The listener is called for every JSON-RPC notification received from any
     * connected server, AFTER the manager's own handling of known methods
     * (`notifications/tools/list_changed`, `notifications/resources/list_changed`,
     * `notifications/resources/updated`, `notifications/prompts/list_changed`).
     * For list-change methods the internal refresh promise is awaited before
     * fanout, so listeners observe up-to-date manager and tool state. Unknown
     * or server-custom methods are also delivered, letting consumers bridge
     * server-initiated events into session-level behavior (e.g. an extension
     * injecting a steer via `pi.sendMessage`).
     *
     * Notifications received before any listener attached are buffered
     * (bounded FIFO, cap {@link NOTIFICATION_BUFFER_CAP}, drop-oldest) and
     * drained into the first subscriber — matches {@link setOnPromptsChanged}'s
     * replay-on-attach and {@link IrcBus}'s mailbox semantics.
     *
     * Returns an unsubscribe function; call it to remove the listener.
     *
     * Multiple listeners are allowed; each is invoked with independent error
     * isolation — a listener that throws does not prevent other listeners from
     * firing.
     */
    addNotificationListener(listener: (serverName: string, method: string, params: unknown) => void): () => void;
    /**
     * Set a callback to fire when any server's tools change.
     *
     * May return a Promise; if so, {@link refreshServerTools} awaits it so that
     * downstream consumers (e.g. `mcp_notification` listeners for
     * `notifications/tools/list_changed`) observe not just the manager's
     * refreshed tool set but also any session-level rebind driven by the
     * handler (`session.refreshMCPTools`). Other callsites (initial connect,
     * disconnect, reconnect) invoke the handler synchronously — their downstream
     * chains don't need to serialize on the rebind.
     */
    setOnToolsChanged(handler: (tools: CustomTool<TSchema, MCPToolDetails>[]) => void | Promise<void>): void;
    /**
     * Set a callback to fire when any server's resources change.
     */
    setOnResourcesChanged(handler: (serverName: string, uri: string) => void): void;
    /**
     * Set a callback to fire when any server's prompts change.
     */
    setOnPromptsChanged(handler: (serverName: string) => void): void;
    setNotificationsEnabled(enabled: boolean): void;
    /**
     * Set the auth storage for resolving OAuth credentials.
     */
    setAuthStorage(authStorage: AuthStorage): void;
    /** Set the callback used to complete OAuth after a tool-level auth challenge. */
    setAuthHandler(handler: MCPAuthHandler | undefined): void;
    /**
     * Discover and connect to all MCP servers from .mcp.json files.
     * Returns tools and any connection errors.
     */
    discoverAndConnect(options?: MCPDiscoverOptions): Promise<MCPLoadResult>;
    /**
     * Connect to specific MCP servers.
     * Connections are made in parallel for faster startup.
     */
    connectServers(configs: Record<string, MCPServerConfig>, sources: Record<string, SourceMeta>, onStatus?: (event: McpConnectionStatusEvent) => void): Promise<MCPLoadResult>;
    /**
     * Get all loaded tools.
     */
    getTools(): CustomTool<TSchema, MCPToolDetails>[];
    /**
     * Get a specific connection.
     */
    getConnection(name: string): MCPServerConnection | undefined;
    /**
     * Get current connection status for a server.
     */
    getConnectionStatus(name: string): "connected" | "connecting" | "disconnected";
    /**
     * Get the source metadata for a server.
     */
    getSource(name: string): SourceMeta | undefined;
    /**
     * Get the preserved (pre-auth) config for a known server — whether currently
     * connected or merely discovered (a connect was attempted but may have failed,
     * e.g. an OAuth server that has not been authorized yet). Mirrors the
     * reconnect lookup at {@link reconnectServer} so callers like `/mcp reauth`
     * can recover a discovered server's config without re-reading config files.
     */
    getServerConfig(name: string): MCPServerConfig | undefined;
    /**
     * Wait for a connection to complete (or fail).
     */
    waitForConnection(name: string): Promise<MCPServerConnection>;
    /**
     * Resolve auth and shell-command substitutions in config before connecting.
     * Pass `oauth: false` to skip OAuth credential injection (used by reauth's
     * unauthenticated probe, which must observe the server's bare 401).
     */
    prepareConfig(config: MCPServerConfig, options?: {
        oauth?: boolean;
    }): Promise<MCPServerConfig>;
    /**
     * Get all connected server names.
     */
    getConnectedServers(): string[];
    /**
     * Get all known server names (connected, connecting, or discovered).
     */
    getAllServerNames(): string[];
    /**
     * Disconnect from a specific server.
     */
    disconnectServer(name: string): Promise<void>;
    /**
     * Disconnect from all servers.
     */
    disconnectAll(): Promise<void>;
    /**
     * Reconnect to a server after a connection failure.
     *
     * Tears down the stale connection, re-resolves auth, establishes a new
     * connection, reloads tools, and notifies consumers. Concurrent calls for
     * the same server share one reconnection attempt. Returns the new
     * connection, or `null` if reconnection failed or the per-server crash
     * burst limit (see {@link RECONNECT_BURST_LIMIT}) is exceeded.
     * @param options.manual - When `true`, resets the crash-burst window so a
     *   user-driven retry (e.g. `/mcp reconnect`) is never blocked by an
     *   earlier storm. Defaults to `false`; the transport `onClose` callback
     *   and the per-tool-call retry path in `tool-bridge` MUST NOT set it.
     */
    reconnectServer(name: string, options?: {
        manual?: boolean;
        authChallenge?: MCPAuthChallenge;
    }): Promise<MCPServerConnection | null>;
    /**
     * Refresh tools from a specific server.
     */
    refreshServerTools(name: string): Promise<void>;
    /**
     * Refresh tools from all servers.
     */
    refreshAllTools(): Promise<void>;
    /**
     * Refresh resources from a specific server.
     */
    refreshServerResources(name: string): Promise<void>;
    /**
     * Wait until a connected server's resource catalog has been loaded.
     * Coalesces with initial loading and notification-driven refreshes.
     */
    ensureServerResources(name: string): Promise<void>;
    /**
     * Refresh prompts from a specific server.
     */
    refreshServerPrompts(name: string): Promise<void>;
    /**
     * Get resources and templates for a specific server.
     */
    getServerResources(name: string): {
        resources: MCPResource[];
        templates: MCPResourceTemplate[];
    } | undefined;
    /**
     * Read a specific resource from a server.
     */
    readServerResource(name: string, uri: string, options?: MCPRequestOptions): Promise<MCPResourceReadResult | undefined>;
    /**
     * Get prompts for a specific server.
     */
    getServerPrompts(name: string): MCPPrompt[] | undefined;
    /**
     * Get a specific prompt from a server.
     */
    executePrompt(name: string, promptName: string, args?: Record<string, string>, options?: MCPRequestOptions): Promise<MCPGetPromptResult | undefined>;
    /**
     * Get all server instructions (for system prompt injection).
     */
    getServerInstructions(): Map<string, string>;
    /**
     * Get notification state for display.
     */
    getNotificationState(): {
        enabled: boolean;
        subscriptions: Map<string, ReadonlySet<string>>;
    };
}
/**
 * Create an MCP manager and discover servers.
 * Convenience function for quick setup.
 */
export declare function createMCPManager(cwd: string, options?: MCPDiscoverOptions): Promise<{
    manager: MCPManager;
    result: MCPLoadResult;
}>;
