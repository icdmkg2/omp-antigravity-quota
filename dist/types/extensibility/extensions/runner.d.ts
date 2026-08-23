import type { AgentMessage, AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { CredentialDisabledEvent, ImageContent, Model, ProviderResponseMetadata } from "@oh-my-pi/pi-ai";
import type { KeyId } from "@oh-my-pi/pi-tui";
import type { ModelRegistry } from "../../config/model-registry.js";
import type { Settings } from "../../config/settings.js";
import type { LocalProtocolOptions } from "../../internal-urls/local-protocol.js";
import type { MemoryRuntimeContext } from "../../memory-backend/index.js";
import type { AsyncJobSnapshot } from "../../session/agent-session.js";
import type { SessionManager } from "../../session/session-manager.js";
import type { BranchHandler, NavigateTreeHandler, NewSessionHandler } from "../session-handler-types.js";
import type { AfterProviderResponseEvent, AssistantThinkingRenderer, BeforeAgentStartEvent, BeforeAgentStartEventResult, BeforeProviderRequestEvent, BeforeProviderRequestEventResult, ComposerShapeDefinition, ContextEvent, Extension, ExtensionActions, ExtensionCommandContext, ExtensionCommandContextActions, ExtensionContext, ExtensionContextActions, ExtensionError, ExtensionEvent, ExtensionFlag, ExtensionMode, ExtensionRuntime, ExtensionShortcut, ExtensionUIContext, InputEvent, InputEventResult, McpNotificationEvent, MessageRenderer, RegisteredCommand, RegisteredTool, ResourcesDiscoverEvent, SessionBeforeBranchResult, SessionBeforeCompactResult, SessionBeforeSwitchResult, SessionBeforeTreeResult, SessionCompactingResult, SessionStopEvent, SessionStopEventResult, ToolCallEvent, ToolCallEventResult, ToolResultEvent, ToolResultEventResult, UserBashEvent, UserBashEventResult, UserPythonEvent, UserPythonEventResult } from "./types.js";
/** Combined result from all before_agent_start handlers */
interface BeforeAgentStartCombinedResult {
    messages?: NonNullable<BeforeAgentStartEventResult["message"]>[];
    systemPrompt?: string[];
}
export type ExtensionErrorListener = (error: ExtensionError) => void;
export declare const EXTENSION_HANDLER_TIMEOUT_MS = 30000;
export declare function testSetExtensionHandlerTimeoutMs(timeoutMs: number): void;
/**
 * Dedicated cap for `session_shutdown` handlers. The generic 30s budget is
 * appropriate for events extensions can observe (e.g. `session_start`,
 * `before_provider_request`), but `session_shutdown` is fire-and-forget
 * teardown — extensions receive no result and the user has already asked to
 * leave. A hung handler (e.g. an extension waiting on a stuck IPC pipe to a
 * companion app) MUST NOT hold Ctrl+C / `/exit` hostage for the full window.
 * See issue #2600.
 */
export declare const SESSION_SHUTDOWN_HANDLER_TIMEOUT_MS = 2000;
export declare function testSetSessionShutdownHandlerTimeoutMs(timeoutMs: number): void;
/**
 * Events handled by the generic emit() method.
 * Events with dedicated emitXxx() methods are excluded for stronger type safety.
 */
type RunnerEmitEvent = Exclude<ExtensionEvent, ToolCallEvent | ToolResultEvent | UserBashEvent | ContextEvent | BeforeProviderRequestEvent | AfterProviderResponseEvent | BeforeAgentStartEvent | ResourcesDiscoverEvent | InputEvent>;
type RunnerEmitResult<TEvent extends RunnerEmitEvent> = TEvent extends {
    type: "session_before_switch";
} ? SessionBeforeSwitchResult | undefined : TEvent extends {
    type: "session_before_branch";
} ? SessionBeforeBranchResult | undefined : TEvent extends {
    type: "session_before_compact";
} ? SessionBeforeCompactResult | undefined : TEvent extends {
    type: "session_before_tree";
} ? SessionBeforeTreeResult | undefined : TEvent extends {
    type: "session.compacting";
} ? SessionCompactingResult | undefined : TEvent extends {
    type: "session_stop";
} ? SessionStopEventResult | undefined : undefined;
export type { BranchHandler, NavigateTreeHandler, NewSessionHandler };
export type SwitchSessionHandler = (sessionPath: string) => Promise<{
    cancelled: boolean;
}>;
export type ShutdownHandler = () => void;
/**
 * Emit `session_shutdown`, dispose file-write-fallback registrations, and clear
 * timers owned by an extension runner.
 *
 * Returns whether any shutdown handlers were present. Fallback disposal and timer
 * cleanup run even when a handler fails so extension background work — and a
 * fallback bound to this session's context — cannot outlive its host.
 */
export declare function emitSessionShutdownEvent(extensionRunner: ExtensionRunner | undefined): Promise<boolean>;
export declare class ExtensionRunner {
    #private;
    private readonly extensions;
    private readonly runtime;
    private readonly sessionManager;
    private readonly modelRegistry;
    private readonly settings?;
    private readonly localProtocolOptions?;
    /** Records that the loop already emitted `tool_call` for this dispatch. */
    markToolCallEmitted(toolCallId: string, toolName: string): void;
    /** Consumes a {@link markToolCallEmitted} marker; true when the loop already emitted. */
    consumeToolCallEmitted(toolCallId: string, toolName: string): boolean;
    /** Wires the native-tool resolver used by {@link invokeNativeTool}. */
    setNativeToolResolver(resolve: (name: string) => {
        tool: AgentTool;
        makeContext: () => AgentToolContext;
    } | undefined): void;
    /** Whether a native built-in of `name` is available to delegate to. */
    hasNativeTool(name: string): boolean;
    /**
     * Run the native built-in of `name` with `params` and return its result — the delegation target
     * of a same-tool `ctx.invokeTool`. Calls the unwrapped native `execute` directly with the loop's
     * ordinary tool context, so it inherits the caller's already-granted approval (the caller is the
     * same tool) rather than re-running the gate. `depth` guards a wrapper that recurses into itself;
     * it is per call chain (threaded from the caller), not session-global, so concurrent independent
     * delegations do not interfere.
     */
    invokeNativeTool<TDetails = unknown>(name: string, params: Record<string, unknown>, options?: {
        signal?: AbortSignal;
        onUpdate?: AgentToolUpdateCallback<TDetails>;
        depth?: number;
        /**
         * The caller tool's own context. Reused for the native call so metadata the native tool
         * reads — `toolCall` (write/edit LSP batch flushing) and provider metadata /
         * `providerSafetyApproved` (computer) — is preserved. Falls back to a fresh session tool
         * context only when the caller had none.
         */
        callerContext?: AgentToolContext;
    }): Promise<AgentToolResult<TDetails>>;
    constructor(extensions: Extension[], runtime: ExtensionRuntime, 
    /** Ignored: `cwd` is always read live via the `cwd` getter below, not cached here. */
    _initialCwd: string, sessionManager: SessionManager, modelRegistry: ModelRegistry, getMemory?: () => MemoryRuntimeContext | undefined, settings?: Settings | undefined, localProtocolOptions?: LocalProtocolOptions | undefined, getAsyncJobSnapshot?: () => AsyncJobSnapshot | null);
    /**
     * Live session directory, not a session-start snapshot: `/move`
     * (`SessionManager.moveTo()`) relocates the owning session by updating
     * `sessionManager`'s own `#cwd`, not a process-global. Reading it here
     * via the getter — instead of caching the constructor-time value in a
     * field — keeps every `ExtensionContext` built below in sync with this
     * session's actual, current directory. Deliberately `sessionManager.getCwd()`
     * rather than `getProjectDir()`: the latter is a single process-wide value
     * that only the interactive TUI's `/move` handler happens to also update
     * (`InteractiveModeContext#applyCwdChange`) — an SDK/ACP host running
     * several concurrent sessions each with their own `cwd` (see
     * `CreateAgentSessionOptions.cwd`) must never have one session's move
     * leak into another's `ctx.cwd` by reading a shared global.
     */
    get cwd(): string;
    /**
     * Stable id of the session this runner serves. Read through `sessionManager`
     * for the same reason as {@link cwd}: it is this session's own, never a
     * process-global, so a subagent runner reports itself and not its parent.
     *
     * Used to attribute a denied file write or delete to the session that issued
     * it, since the fallback registry those handlers live in is process-wide.
     */
    get sessionId(): string;
    initialize(actions: ExtensionActions, contextActions: ExtensionContextActions, commandContextActions?: ExtensionCommandContextActions, uiContext?: ExtensionUIContext, mode?: ExtensionMode): void;
    /**
     * Forward a `credential_disabled` event from `AuthStorage` to extension handlers.
     *
     * If {@link initialize} has not yet run, the event is buffered and replayed once
     * initialize wires the runtime/UI context. This matters because mode controllers
     * (interactive, RPC, ACP, print, subagent) call `initialize()` AFTER `createAgentSession`
     * returns, but `AuthStorage` can fire `credential_disabled` during startup model probes
     * inside `createAgentSession()`. Without deferral, extension handlers would observe
     * `hasUI=false`, an unset model, and no-op runtime actions on exactly the headline
     * "OAuth invalid_grant during startup" path the event was designed to surface.
     *
     * Always returns; never throws. Errors from handlers are routed through
     * {@link onError} via {@link emit}'s normal isolation.
     */
    emitCredentialDisabled(event: CredentialDisabledEvent): Promise<void>;
    /**
     * Forward an MCP server notification to extension handlers.
     *
     * If {@link initialize} has not yet run, the notification is buffered and replayed
     * once initialize wires the runtime/UI context. Matches the credential-disabled
     * deferral above: the sdk.ts bridge registers `MCPManager.addNotificationListener`
     * inside `createAgentSession` — BEFORE the mode controller calls `initialize()` on
     * this runner — so notification frames drained by the manager (either fresh
     * arrivals or replay from its own startup buffer) can reach us pre-init. Without
     * this buffer they would evaporate for a second time here.
     *
     * Bounded at {@link MAX_PENDING_MCP_NOTIFICATIONS}; oldest entries drop under
     * pressure. Never throws; per-handler errors are routed through {@link onError}
     * via {@link emit}'s normal isolation.
     */
    emitMcpNotification(event: Omit<McpNotificationEvent, "type">): Promise<void>;
    /** Emits a session stop pass that can be cancelled with the active settle signal. */
    emitSessionStop(event: Omit<SessionStopEvent, "type">): Promise<SessionStopEventResult | undefined>;
    /** Registers the interactive transcript gate that must settle before a tool approval is presented. */
    setToolApprovalPreviewWaiter(waiter: (toolCallId: string) => Promise<void>): () => void;
    /** Waits until the interactive transcript can show the tool call being approved. */
    waitForToolApprovalPreview(toolCallId: string): Promise<void>;
    getUIContext(): ExtensionUIContext;
    hasUI(): boolean;
    getExtensionPaths(): string[];
    /** Get all registered tools from all extensions. */
    getAllRegisteredTools(): RegisteredTool[];
    /** Get the effective registered tool for a name using normal last-extension-wins precedence. */
    getRegisteredTool(name: string): RegisteredTool | undefined;
    /**
     * Observe tools registered after extension factories have loaded. Listener
     * promises are drained before the lifecycle handler that registered them
     * completes, keeping the model tool snapshot and system prompt coherent.
     */
    onToolRegistered(listener: (tool: RegisteredTool, signal?: AbortSignal) => void | Promise<void>): () => void;
    /** Composer shapes registered during extension load, with later extensions winning id collisions. */
    getComposerShapes(): ComposerShapeDefinition[];
    /**
     * Aggregate the registered CLI flags across a set of extensions (last write
     * wins on name collision). Static so callers that need the flag set before a
     * runner exists — e.g. the CLI resolving `@file`/flag args before session
     * creation — share this exact logic instead of duplicating it.
     */
    static aggregateFlags(extensions: readonly Extension[]): Map<string, ExtensionFlag>;
    getFlags(): Map<string, ExtensionFlag>;
    getFlagValues(): Map<string, boolean | string>;
    setFlagValue(name: string, value: boolean | string): void;
    getShortcuts(): Map<KeyId, ExtensionShortcut>;
    onError(listener: ExtensionErrorListener): () => void;
    emitError(error: ExtensionError): void;
    hasHandlers(eventType: string): boolean;
    getMessageRenderer(customType: string): MessageRenderer | undefined;
    getAssistantThinkingRenderers(): AssistantThinkingRenderer[];
    getRegisteredCommands(reserved?: ReadonlySet<string>): RegisteredCommand[];
    getCommandDiagnostics(): Array<{
        type: string;
        message: string;
        path: string;
    }>;
    getCommand(name: string): RegisteredCommand | undefined;
    /**
     * Creates an extension context, optionally scoped to a provider request model.
     *
     * `delegation` wires the same-tool `ctx.invokeTool` for a re-registered built-in: when `toolName`
     * names an existing native built-in, the context carries an `invokeTool` that runs it (see
     * {@link invokeNativeTool}). The rest inherits the wrapper's own call so a bare
     * `ctx.invokeTool(params)` behaves like the outer call — `context` preserves `toolCall`/provider
     * metadata, `signal`/`onUpdate` default to the wrapper's own channels so aborting the outer tool
     * call stops the native one and native progress still streams, and `depth` bounds recursion per
     * call chain. Explicit options passed to `invokeTool` override the inherited `signal`/`onUpdate`.
     */
    createContext(model?: Model, delegation?: {
        toolName: string;
        depth?: number;
        context?: AgentToolContext;
        signal?: AbortSignal;
        onUpdate?: AgentToolUpdateCallback;
    }): ExtensionContext;
    /**
     * Request a graceful shutdown. Called by extension tools and event handlers.
     */
    shutdown(): void;
    /**
     * Clear every timer scheduled through `ctx.setInterval` / `ctx.setTimeout`.
     * Called during session teardown so extension background work does not
     * outlive the session (a self-scheduling interval would otherwise keep
     * firing against a disposed session).
     */
    clearManagedTimers(): void;
    /**
     * Remove every file write and delete fallback this runner installed into the
     * process-wide registries. Called on session shutdown (and before reinstalling
     * on a re-{@link initialize}) so a handler bound to a torn-down session's
     * context can never fire for another session sharing this process.
     */
    disposeFileFallbacks(): void;
    createCommandContext(): ExtensionCommandContext;
    emit<TEvent extends RunnerEmitEvent>(event: TEvent): Promise<RunnerEmitResult<TEvent>>;
    emitToolResult(event: ToolResultEvent): Promise<ToolResultEventResult | undefined>;
    /**
     * Emit a `tool_call` event to every subscribed extension before the tool executes.
     *
     * Each handler is bounded by `extensionHandlers.toolCallTimeoutMs` (default
     * 30s). This matches the timeout policy already applied to `emitToolResult` and every
     * other handler routed through `#runHandlerWithTimeout`; without it a single
     * hung extension (unresolved `await`, network call with no timeout) would
     * park `ExtensionToolWrapper.execute` indefinitely and freeze tool
     * dispatch — see issue #3948.
     *
     * On-timeout policy: **fail-closed** (return `{ block: true }`). This is
     * symmetric with the existing error path below and safer for a
     * pre-execution gate — an unresponsive extension MUST NOT be treated as
     * silent consent to run the tool.
     */
    emitToolCall(event: ToolCallEvent, signal?: AbortSignal): Promise<ToolCallEventResult | undefined>;
    emitUserBash(event: UserBashEvent): Promise<UserBashEventResult | undefined>;
    emitUserPython(event: UserPythonEvent): Promise<UserPythonEventResult | undefined>;
    private emitUserEvent;
    emitResourcesDiscover(cwd: string, reason: ResourcesDiscoverEvent["reason"]): Promise<{
        skillPaths: Array<{
            path: string;
            extensionPath: string;
        }>;
        promptPaths: Array<{
            path: string;
            extensionPath: string;
        }>;
        themePaths: Array<{
            path: string;
            extensionPath: string;
        }>;
    }>;
    /** Emit input event. Transforms chain, "handled" short-circuits. */
    emitInput(text: string, images: ImageContent[] | undefined, source: "interactive" | "rpc" | "extension"): Promise<InputEventResult>;
    emitContext(messages: AgentMessage[]): Promise<AgentMessage[]>;
    /** Runs request payload hooks with the model used for that provider request. */
    emitBeforeProviderRequest(payload: unknown, model?: Model): Promise<BeforeProviderRequestEventResult>;
    /** Runs response hooks with the model that produced that provider response. */
    emitAfterProviderResponse(response: ProviderResponseMetadata, model?: Model): Promise<void>;
    emitBeforeAgentStart(prompt: string, images: ImageContent[] | undefined, systemPrompt: string[]): Promise<BeforeAgentStartCombinedResult | undefined>;
}
