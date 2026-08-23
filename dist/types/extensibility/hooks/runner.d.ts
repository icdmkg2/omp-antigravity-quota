/**
 * Hook runner - executes hooks and manages their lifecycle.
 */
import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import type { Model } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../../config/model-registry.js";
import type { SessionManager } from "../../session/session-manager.js";
import type { AppendEntryHandler, BranchHandler, LoadedHook, NavigateTreeHandler, NewSessionHandler, SendMessageHandler } from "./loader.js";
import type { BeforeAgentStartEventResult, HookCommandContext, HookError, HookEvent, HookMessageRenderer, HookUIContext, RegisteredCommand, SessionBeforeCompactResult, SessionBeforeTreeResult, SessionCompactingResult, ToolCallEvent, ToolCallEventResult, ToolResultEventResult } from "./types.js";
/**
 * Listener for hook errors.
 */
export type HookErrorListener = (error: HookError) => void;
export { execCommand } from "../../exec/exec.js";
/**
 * HookRunner executes hooks and manages event emission.
 */
export declare class HookRunner {
    #private;
    private readonly hooks;
    private readonly cwd;
    private readonly sessionManager;
    private readonly modelRegistry;
    constructor(hooks: LoadedHook[], cwd: string, sessionManager: SessionManager, modelRegistry: ModelRegistry);
    /**
     * Initialize HookRunner with all required context.
     * Modes call this once the agent session is fully set up.
     */
    initialize(options: {
        /** Function to get the current model */
        getModel: () => Model | undefined;
        /** Handler for hooks to send messages */
        sendMessageHandler: SendMessageHandler;
        /** Handler for hooks to append entries */
        appendEntryHandler: AppendEntryHandler;
        /** Handler for creating new sessions (for HookCommandContext) */
        newSessionHandler?: NewSessionHandler;
        /** Handler for branching sessions (for HookCommandContext) */
        branchHandler?: BranchHandler;
        /** Handler for navigating session tree (for HookCommandContext) */
        navigateTreeHandler?: NavigateTreeHandler;
        /** Function to check if agent is idle */
        isIdle?: () => boolean;
        /** Function to wait for agent to be idle */
        waitForIdle?: () => Promise<void>;
        /** Function to abort current operation (fire-and-forget) */
        abort?: () => void;
        /** Function to check if there are queued messages */
        hasQueuedMessages?: () => boolean;
        /** UI context for interactive prompts */
        uiContext?: HookUIContext;
        /** Whether UI is available */
        hasUI?: boolean;
    }): void;
    /**
     * Get the UI context (set by mode).
     */
    getUIContext(): HookUIContext | null;
    /**
     * Get whether UI is available.
     */
    getHasUI(): boolean;
    /**
     * Get the paths of all loaded hooks.
     */
    getHookPaths(): string[];
    /**
     * Subscribe to hook errors.
     * @returns Unsubscribe function
     */
    onError(listener: HookErrorListener): () => void;
    /**
     * Emit an error to all listeners.
     */
    /**
     * Emit an error to all error listeners.
     */
    emitError(error: HookError): void;
    /**
     * Check if any hooks have handlers for the given event type.
     */
    hasHandlers(eventType: string): boolean;
    /**
     * Get a message renderer for the given customType.
     * Returns the first renderer found across all hooks, or undefined if none.
     */
    getMessageRenderer(customType: string): HookMessageRenderer | undefined;
    /**
     * Get all registered commands from all hooks.
     */
    getRegisteredCommands(): RegisteredCommand[];
    /**
     * Get a registered command by name.
     * Returns the first command found across all hooks, or undefined if none.
     */
    getCommand(name: string): RegisteredCommand | undefined;
    /**
     * Create the command context for slash command handlers.
     * Extends HookContext with session control methods that are only safe in commands.
     */
    createCommandContext(): HookCommandContext;
    /**
     * Emit an event to all hooks.
     * Returns the result from session before_* / tool_result events (if any handler returns one).
     */
    emit(event: HookEvent): Promise<SessionBeforeCompactResult | SessionBeforeTreeResult | SessionCompactingResult | ToolResultEventResult | undefined>;
    /**
     * Emit a tool_call event to all hooks.
     * No timeout - user prompts can take as long as needed.
     * Errors are thrown (not swallowed) so caller can block on failure.
     */
    emitToolCall(event: ToolCallEvent): Promise<ToolCallEventResult | undefined>;
    /**
     * Emit a context event to all hooks.
     * Handlers are chained - each gets the previous handler's output (if any).
     * Returns the final modified messages, or the original if no modifications.
     *
     * Note: Messages are already deep-copied by the caller (pi-ai preprocessor).
     */
    emitContext(messages: AgentMessage[]): Promise<AgentMessage[]>;
    /**
     * Emit before_agent_start event to all hooks.
     * Returns the first message to inject (if any handler returns one).
     */
    emitBeforeAgentStart(prompt: string, images?: import("@oh-my-pi/pi-ai").ImageContent[]): Promise<BeforeAgentStartEventResult | undefined>;
}
