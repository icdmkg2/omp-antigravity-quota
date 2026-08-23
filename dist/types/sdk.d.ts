import { Agent, type AgentOptions, type AgentTelemetryConfig, type AgentTool, type ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Effort, Model, ServiceTier, SimpleStreamOptions } from "@oh-my-pi/pi-ai";
import type { Dialect } from "@oh-my-pi/pi-ai/dialect";
import { type Rule } from "./capability/rule.js";
import { ModelRegistry } from "./config/model-registry.js";
import { type PromptTemplate } from "./config/prompt-templates.js";
import { Settings, type SkillsSettings } from "./config/settings.js";
import "./discovery/index.js";
import { type CustomCommandsLoadResult } from "./extensibility/custom-commands/index.js";
import { type ToolPathWithSource } from "./extensibility/custom-tools/index.js";
import type { CustomTool } from "./extensibility/custom-tools/types.js";
import { type ExtensionFactory, type ExtensionUIContext, type LoadExtensionsResult, type ToolDefinition } from "./extensibility/extensions/index.js";
import { type Skill, type SkillWarning } from "./extensibility/skills.js";
import { type FileSlashCommand } from "./extensibility/slash-commands.js";
import type { HindsightSessionState } from "./hindsight/state.js";
import { type LocalProtocolOptions } from "./internal-urls/index.js";
import { MCPManager, type MCPToolsLoadResult } from "./mcp/index.js";
import type { MnemopiSessionState } from "./mnemopi/state.js";
import { type AgentRef, AgentRegistry } from "./registry/agent-registry.js";
import { AgentSession, type PlanYolo, type Prewalk } from "./session/agent-session.js";
import type { AuthStorage } from "./session/auth-storage.js";
import { SessionManager } from "./session/session-manager.js";
import { type BuildSystemPromptResult } from "./system-prompt.js";
import type { StructuredSubagentSchemaMode } from "./task/types.js";
import { type ConfiguredThinkingLevel } from "./thinking.js";
import { BashTool, BUILTIN_TOOLS, createTools, EditTool, EvalTool, GlobTool, GrepTool, HIDDEN_TOOLS, type LspStartupServerInfo, ReadTool, type Tool, type ToolSession, WebSearchTool, WriteTool } from "./tools/index.js";
import { EventBus } from "./utils/event-bus.js";
import { type WorkspaceTree } from "./workspace-tree.js";
export interface CreateAgentSessionOptions {
    /** Working directory for project-local discovery. Default: getProjectDir() */
    cwd?: string;
    /** Additional workspace directories beyond cwd (multi-root), absolute or cwd-relative. */
    additionalDirectories?: string[];
    /** Global config directory. Default: ~/.omp/agent */
    agentDir?: string;
    /** Spawns to allow. Default: "*" */
    spawns?: string;
    /** Auth storage for credentials. Default: discoverAuthStorage(agentDir) */
    authStorage?: AuthStorage;
    /** Model registry. Default: discoverModels(authStorage, agentDir) */
    modelRegistry?: ModelRegistry;
    /**
     * Request credential resolver. Defaults to the model registry's normal
     * session-affine resolver. Security scans use this narrow seam to keep one
     * durable OAuth row pinned for the operation without changing ordinary
     * provider routing.
     */
    getApiKey?: AgentOptions["getApiKey"];
    /** Model to use. Default: from settings, else first available */
    model?: Model;
    /** Raw model pattern(s) (e.g. from --model CLI flag) to resolve after extensions load.
     * Used when model lookup is deferred because extension-provided models aren't registered yet. */
    modelPattern?: string | string[];
    /** Authenticated fallback selector for deferred subagent model patterns. */
    modelPatternAuthFallback?: string;
    /** Role name used to install retry fallbacks after deferred subagent patterns resolve. */
    modelPatternFallbackRole?: string;
    /** Validated default retry chain to install when a deferred singleton pattern resolves. */
    modelPatternDefaultFallbackChain?: string[];
    /** Thinking selector. Default: from settings, else unset */
    thinkingLevel?: ConfiguredThinkingLevel;
    /** Hard ceiling on the session's thinking effort (e.g. a task spawn's `task.maxEffort`-capped hint); retry-fallback recovery re-clamps to it. */
    thinkingLevelCeiling?: Effort;
    /** OpenAI service-tier override for this session. `null` omits `service_tier`. */
    openAIServiceTier?: ServiceTier | null;
    /** Models available for cycling (Ctrl+P in interactive mode) */
    scopedModels?: Array<{
        model: Model;
        thinkingLevel?: ThinkingLevel;
    }>;
    /** Prewalk from the starting model to a fast/cheap target at the first edit/write once the todo list exists. */
    prewalk?: Prewalk;
    /** Force read-only plan mode at start, auto-approve on the model's first resolve call, then switch to execute. */
    planYolo?: PlanYolo;
    /** Provider-facing system prompt override. Replaces the fully rendered default blocks. */
    systemPrompt?: string | string[] | ((defaultPrompt: string[]) => string | string[]);
    /** Already-loaded custom prompt text rendered through the bundled custom system prompt template. */
    customSystemPrompt?: string;
    /** Already-loaded text appended through the bundled system prompt templates. */
    appendSystemPrompt?: string;
    /**
     * Already-loaded title-generation system prompt override (typically
     * {@link discoverTitleSystemPromptFile} → {@link resolvePromptInput}). When
     * set, every automatic session-title generation path on this session — the
     * first-input title and the replan-driven refresh — uses this prompt
     * instead of the bundled default. Refresh on cwd change via
     * {@link AgentSession.setTitleSystemPrompt}.
     */
    titleSystemPrompt?: string;
    /** Optional provider-facing session identifier for prompt caches and sticky auth selection.
     * Keeps persisted session files isolated while reusing provider-side caches. */
    providerSessionId?: string;
    /** Optional provider-facing prompt cache key, distinct from request lineage. */
    providerPromptCacheKey?: string;
    /** Whether `providerPromptCacheKey` is caller-pinned or inherited from a full fork. */
    providerPromptCacheKeySource?: "explicit" | "fork";
    /** Absolute wall-clock deadline in Unix epoch milliseconds. */
    deadline?: number;
    /** Custom tools to register (in addition to built-in tools). Accepts both CustomTool and ToolDefinition. */
    customTools?: (CustomTool | ToolDefinition)[];
    /** Inline extensions (merged with discovery). */
    extensions?: ExtensionFactory[];
    /** Additional extension paths to load (merged with discovery). */
    additionalExtensionPaths?: string[];
    /** Disable extension discovery (explicit paths still load). */
    disableExtensionDiscovery?: boolean;
    /**
     * Pre-loaded extensions (skips file discovery and the per-session factory
     * call). Used by the CLI when extensions are loaded early to parse custom
     * flags — the same process owns the returned instances, so reusing them is
     * safe.
     *
     * NEVER pass this across session boundaries (e.g. parent → subagent).
     * `Extension` instances close over a parent-bound `ExtensionAPI` (cwd,
     * eventBus, runtime), and reusing them would route tools/handlers/commands
     * back through the parent. For subagents, forward
     * {@link preloadedExtensionPaths} instead.
     *
     * @internal
     */
    preloadedExtensions?: LoadExtensionsResult;
    /**
     * Pre-discovered extension source paths. When provided, the filesystem-scan
     * inside `discoverExtensionPaths()` is skipped — the session still calls
     * `loadExtensions()` itself so each `Extension` is bound to THIS session's
     * `ExtensionAPI` (cwd, eventBus, runtime).
     *
     * This is the safe pass-through for parent → subagent forwarding.
     */
    preloadedExtensionPaths?: string[];
    /**
     * Pre-discovered custom-tool source paths from `.omp/tools/`, `.claude/tools/`,
     * plugins, etc. When provided, the filesystem-scan inside
     * `discoverCustomToolPaths()` is skipped — subagents inherit the parent's
     * scan result and call `loadCustomTools()` themselves so each session binds
     * tools to its OWN `CustomToolAPI` (cwd, exec, pushPendingAction, UI).
     *
     * Forwarding the loaded `LoadedCustomTool[]` instances directly would reuse
     * the parent's session-bound API and route tool execution back through the
     * parent — wrong for isolated tasks and for pending-action routing.
     */
    preloadedCustomToolPaths?: ToolPathWithSource[];
    /** Shared event bus for tool/extension communication. Default: creates new bus. */
    eventBus?: EventBus;
    /** Skills. Default: discovered from multiple locations */
    skills?: Skill[];
    /** Rules. Default: discovered from multiple locations */
    rules?: Rule[];
    /** Context files (AGENTS.md content). Default: discovered walking up from cwd */
    contextFiles?: Array<{
        path: string;
        content: string;
    }>;
    /** Pre-built workspace tree (skips re-scanning; passed by parents to subagents). */
    workspaceTree?: WorkspaceTree;
    /** Prompt templates. Default: discovered from cwd/.omp/prompts/ + agentDir/prompts/ */
    promptTemplates?: PromptTemplate[];
    /** File-based slash commands. Default: discovered from commands/ directories */
    slashCommands?: FileSlashCommand[];
    /**
     * Enable MCP capabilities. `false` skips MCP discovery and ignores
     * `mcpManager`, preventing process-global or inherited MCP access. Default:
     * true.
     */
    enableMCP?: boolean;
    /** Existing MCP manager to reuse when MCP is enabled (skips discovery, propagates to toolSession). */
    mcpManager?: MCPManager;
    /** Enable LSP integration (tool, formatting, diagnostics, warmup). Default: true */
    enableLsp?: boolean;
    /** Restrict LSP to navigation and diagnostics even when enabled. Defaults to true for restricted sessions. */
    lspReadOnly?: boolean;
    /** Whether this invocation may expose IRC. `false` removes it even for subagents. */
    enableIrc?: boolean;
    /** Skip subprocess-kernel availability checks and prelude warmup */
    skipPythonPreflight?: boolean;
    /** Tool names explicitly requested (enables disabled-by-default tools) */
    toolNames?: string[];
    /** Limit the session to explicitly supplied tool names, without discovered extras. */
    restrictToolNames?: boolean;
    /**
     * Permit only caller-supplied SDK custom tools inside a restricted session.
     * They must still be named in {@link toolNames}; discovered extensions, MCP,
     * and ambient custom tools remain disabled. Default: false.
     */
    allowRestrictedCustomTools?: boolean;
    /** Output schema for structured completion (subagents). */
    outputSchema?: unknown;
    /** Enforcement policy for {@link outputSchema}; defaults to legacy permissive behavior. */
    outputSchemaMode?: StructuredSubagentSchemaMode;
    /** Whether to include the yield tool by default */
    requireYieldTool?: boolean;
    /** Task recursion depth (for subagent sessions). Default: 0 */
    taskDepth?: number;
    /** Parent Hindsight state to alias for subagent memory tools. */
    parentHindsightSessionState?: HindsightSessionState;
    /** Parent Mnemopi state to alias for subagent memory tools. */
    parentMnemopiSessionState?: MnemopiSessionState;
    /** Pre-allocated agent identity for IRC routing. Default: "Main" for top-level, parentTaskPrefix-derived for sub. */
    agentId?: string;
    /** Display name for the agent in IRC. Default: "main" or "sub". */
    agentDisplayName?: string;
    /** Optional shared agent registry for IRC routing. Default: AgentRegistry.global(). */
    agentRegistry?: AgentRegistry;
    /**
     * Registry generation authorized for this creation. `null` requires the id
     * to be absent; an AgentRef allows a parked revival to reuse only that ref.
     * Undefined preserves legacy unconditional registration for external SDK callers.
     * @internal
     */
    expectedAgentRef?: AgentRef | null;
    /** Parent task ID prefix for nested artifact naming (e.g., "Extensions") */
    parentTaskPrefix?: string;
    /**
     * Registry id of the spawning agent, recorded as this subagent's parent in
     * the agent registry. Distinct from `parentTaskPrefix`, which is this agent's
     * own artifact/output-id prefix (the executor passes the child's own id
     * there, so it must never double as the parent link). Undefined for the
     * top-level "Main" session, which has no parent.
     */
    parentAgentId?: string;
    /** Inherited eval executor session id for subagents sharing parent eval state. */
    parentEvalSessionId?: string;
    /** Session manager. Default: session stored under the configured agentDir sessions root */
    sessionManager?: SessionManager;
    /** Override local:// protocol options for subagent local:// sharing. Default: uses the session's own artifacts dir and session ID. */
    localProtocolOptions?: LocalProtocolOptions;
    /** Settings instance. Default: Settings.init({ cwd, agentDir }) */
    settings?: Settings;
    /**
     * Legacy alias for `settings`. Older Pi extensions pass SettingsManager.create(...)
     * through this field; accept it so their SDK calls keep the configured settings.
     */
    settingsManager?: Settings | Promise<Settings>;
    /** Whether UI is available (enables interactive tools like ask). Default: false */
    hasUI?: boolean;
    /**
     * A human can answer synchronous prompts even without a terminal UI (e.g. an
     * ACP client rendering elicitation forms). Enables `ask` without enabling
     * TUI-only session behavior such as eager LSP warmup. Default: `hasUI`.
     */
    interactivePrompts?: boolean;
    /**
     * Defer `confirm` reserve-policy fallback until AgentSession prompt-time UI is configured.
     * ACP uses this while capabilities are negotiated without enabling UI-only tools.
     */
    deferUsageReserveConfirmation?: boolean;
    /**
     * Opt-in OpenTelemetry instrumentation forwarded to the underlying Agent.
     * Passing `{}` enables the loop's GenAI-semantic-convention spans. See
     * {@link AgentTelemetryConfig} for the full surface (hooks, content capture,
     * cost estimator, agent identity).
     *
     * Safe to enable without an OTEL SDK registered in the host: the
     * `@opentelemetry/api` package returns a no-op tracer in that case.
     */
    telemetry?: AgentTelemetryConfig;
    /**
     * Fired once, when the agent loop hands its first request to the provider
     * transport (i.e. the `streamFn` wrapper is first invoked). Used to measure
     * subagent launch latency — the boundary between "session built" and "model
     * call dispatched". This is the loop's dispatch point, slightly before the
     * actual provider HTTP call (per-request prep, identical across all
     * requests, follows it), which is the right granularity for launch timing.
     */
    onFirstChatDispatch?: () => void;
    /** Whether to auto-approve all tool calls (--auto-approve CLI flag). Default: false */
    autoApprove?: boolean;
}
/** Result from createAgentSession */
export interface CreateAgentSessionResult {
    /** The created session */
    session: AgentSession;
    /** Extensions result (loaded extensions + runtime) */
    extensionsResult: LoadExtensionsResult;
    /** Update tool UI context (interactive mode) */
    setToolUIContext: (uiContext: ExtensionUIContext, hasUI: boolean) => void;
    /** MCP manager for server lifecycle management (undefined if MCP disabled) */
    mcpManager?: MCPManager;
    /** Warning if session was restored with a different model than saved */
    modelFallbackMessage?: string;
    /** LSP servers detected for startup; warmup may continue in the background */
    lspServers?: LspStartupServerInfo[];
    /** Start cache-aware online runtime model discovery after the first UI paint. */
    startBackgroundModelDiscovery?: () => Promise<void>;
    /** Shared event bus for tool/extension communication */
    eventBus: EventBus;
}
export type DialectFormat = "auto" | "native" | Dialect;
export declare function resolveDialect(format: DialectFormat, model: (Pick<Model, "supportsTools"> & Partial<Pick<Model, "id">>) | undefined): Dialect | undefined;
export type { PromptTemplate } from "./config/prompt-templates.js";
export { Settings, type SkillsSettings } from "./config/settings.js";
export type { CustomCommand, CustomCommandFactory } from "./extensibility/custom-commands/types.js";
export type { CustomTool, CustomToolFactory } from "./extensibility/custom-tools/types.js";
export type * from "./extensibility/extensions/index.js";
export type { Skill } from "./extensibility/skills.js";
export type { FileSlashCommand } from "./extensibility/slash-commands.js";
export type { MCPManager, MCPServerConfig, MCPServerConnection, MCPToolsLoadResult } from "./mcp/index.js";
export { type AgentRef, AgentRegistry, MAIN_AGENT_ID } from "./registry/agent-registry.js";
export type { Tool } from "./tools/index.js";
export { buildDirectoryTree, buildWorkspaceTree, type DirectoryTree, type WorkspaceTree } from "./workspace-tree.js";
export { BashTool, BUILTIN_TOOLS, createTools, EditTool, EvalTool, GlobTool, GrepTool, HIDDEN_TOOLS, ReadTool, type ToolSession, WebSearchTool, WriteTool, };
/**
 * Create an AuthStorage instance.
 *
 * Default: local SQLite store at `<agentDir>/agent.db`.
 *
 * Broker mode: when `OMP_AUTH_BROKER_URL` is set, credentials are pulled from
 * a remote auth-broker over the wire. Refresh tokens never leave the broker;
 * the client receives access tokens with `refresh = "__remote__"` and calls
 * back into the broker through the {@link AuthStorageOptions.refreshOAuthCredential}
 * override to re-mint access tokens when needed.
 *
 * Delegates to {@link ./session/auth-broker-config} so the TUI and the catalog
 * generator share the same credential-discovery logic.
 */
export declare function discoverAuthStorage(agentDir?: string): Promise<AuthStorage>;
/**
 * Discover extensions from cwd.
 */
export declare function discoverExtensions(cwd?: string): Promise<LoadExtensionsResult>;
/**
 * Path-only counterpart of {@link loadSessionExtensions}: the FS-heavy scan
 * without the per-session module load. Subagents reuse the parent's path list
 * (cached on {@link ToolSession.extensionPaths}) and rebuild Extension
 * instances themselves so each session's `ExtensionAPI` (cwd, eventBus,
 * runtime) is its own.
 */
export declare function discoverSessionExtensionPaths(options: Pick<CreateAgentSessionOptions, "disableExtensionDiscovery" | "additionalExtensionPaths">, cwd: string, settings: Settings): Promise<string[]>;
/**
 * Load the discovered/configured extensions for a session — everything {@link
 * createAgentSession} would load except the inline factory extensions it appends
 * itself. Extracted so the CLI can resolve extension-registered flags (and thus
 * classify `@file` arguments extension-aware) *before* a session — and its
 * terminal breadcrumb — is created, then hand the result back through
 * {@link CreateAgentSessionOptions.preloadedExtensions} so the work is not
 * repeated. Keep this the single source of the discovery branch logic.
 */
export declare function loadSessionExtensions(options: Pick<CreateAgentSessionOptions, "disableExtensionDiscovery" | "additionalExtensionPaths">, cwd: string, settings: Settings, eventBus: EventBus): Promise<LoadExtensionsResult>;
/**
 * Load discovered/configured extensions and register their providers into
 * `modelRegistry`, then discover the dynamic provider catalogs. One-shot CLIs
 * (`omp bench`, dry-balance) build a bare {@link ModelRegistry} that only knows
 * built-in catalog providers; without this, providers contributed by an
 * extension (e.g. a custom OpenAI-compatible provider under
 * `~/.omp/agent/extensions/`) never reach model resolution. Mirrors the
 * session / `omp models` path: drain the queued provider registrations, then
 * `refreshRuntimeProviders` so dynamically-discovered models exist before
 * selectors are resolved.
 */
export declare function loadCliExtensionProviders(modelRegistry: ModelRegistry, settings: Settings, cwd: string, options?: Pick<CreateAgentSessionOptions, "disableExtensionDiscovery" | "additionalExtensionPaths">): Promise<void>;
/**
 * Discover skills from cwd and agentDir.
 */
export declare function discoverSkills(cwd?: string, _agentDir?: string, settings?: SkillsSettings): Promise<{
    skills: Skill[];
    warnings: SkillWarning[];
}>;
/**
 * Discover context files (AGENTS.md) walking up from cwd.
 * Returns files sorted by depth (farther from cwd first, so closer files appear last/more prominent).
 */
export declare function discoverContextFiles(cwd?: string, _agentDir?: string, disabledExtensions?: string[]): Promise<Array<{
    path: string;
    content: string;
    depth?: number;
}>>;
/**
 * Discover prompt templates from cwd and agentDir.
 */
export declare function discoverPromptTemplates(cwd?: string, agentDir?: string): Promise<PromptTemplate[]>;
/**
 * Discover file-based slash commands from commands/ directories.
 */
export declare function discoverSlashCommands(cwd?: string): Promise<FileSlashCommand[]>;
/**
 * Discover custom commands (TypeScript slash commands) from cwd and agentDir.
 */
export declare function discoverCustomTSCommands(cwd?: string, agentDir?: string): Promise<CustomCommandsLoadResult>;
/**
 * Discover MCP servers from .mcp.json files.
 * Returns the manager and loaded tools.
 */
export declare function discoverMCPServers(cwd?: string): Promise<MCPToolsLoadResult>;
export interface BuildSystemPromptOptions {
    tools?: Tool[];
    skills?: Skill[];
    contextFiles?: Array<{
        path: string;
        content: string;
    }>;
    cwd?: string;
    customPrompt?: string;
    appendPrompt?: string;
    inlineToolDescriptors?: boolean;
    includeWorkspaceTree?: boolean;
    /** Include the read-only security:// resource inventory entry. Default: false. */
    securityEnabled?: boolean;
}
/**
 * Build the default provider-facing system prompt blocks.
 *
 * The returned `systemPrompt` preserves the stable harness prompt and dynamic project context
 * as separate entries so providers can cache prompt prefixes without concatenating blocks.
 */
export declare function buildSystemPrompt(options?: BuildSystemPromptOptions): Promise<BuildSystemPromptResult>;
export declare function customToolToDefinition(tool: CustomTool): ToolDefinition;
/** Dependencies used to construct an isolated auto-learn capture agent. */
export interface AutoLearnCaptureRunnerOptions {
    sourceAgent: Agent;
    captureTools: AgentTool[];
    createAgent: (options: AgentOptions) => Agent;
    onPayload?: SimpleStreamOptions["onPayload"];
    onResponse?: SimpleStreamOptions["onResponse"];
    createSessionId?: () => string;
}
/** Build a private capture runner over a detached message snapshot and provider session. */
export declare function createAutoLearnCaptureRunner(options: AutoLearnCaptureRunnerOptions): (content: string, signal?: AbortSignal) => Promise<void>;
/**
 * Create an AgentSession with the specified options.
 *
 * @example
 * ```typescript
 * // Minimal - uses defaults
 * const { session } = await createAgentSession();
 *
 * // With explicit model
 * import { getModel } from '@oh-my-pi/pi-ai';
 * const { session } = await createAgentSession({
 *   model: getModel('anthropic', 'claude-opus-4-5'),
 *   thinkingLevel: 'high',
 * });
 *
 * // Continue previous session
 * const { session, modelFallbackMessage } = await createAgentSession({
 *   continueSession: true,
 * });
 *
 * // Full control
 * const { session } = await createAgentSession({
 *   model: myModel,
 *   getApiKey: async () => Bun.env.MY_KEY,
 *   systemPrompt: ['You are helpful.'],
 *   tools: codingTools({ cwd: getProjectDir() }),
 *   skills: [],
 *   sessionManager: SessionManager.inMemory(),
 * });
 * ```
 */
export declare function createAgentSession(options?: CreateAgentSessionOptions): Promise<CreateAgentSessionResult>;
