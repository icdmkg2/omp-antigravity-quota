import type { Agent, AgentTool } from "@oh-my-pi/pi-agent-core";
import type { Model } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings, SkillsSettings } from "../config/settings.js";
import type { CustomTool } from "../extensibility/custom-tools/types.js";
import type { ExtensionRunner, ToolInfo } from "../extensibility/extensions/index.js";
import { type Skill, type SkillWarning } from "../extensibility/skills.js";
import { type LocalProtocolOptions } from "../internal-urls/index.js";
import type { MemoryBackendStartOptions } from "../memory-backend/types.js";
import { type XdevState } from "../tools/xdev.js";
import { type EditMode } from "../utils/edit-mode.js";
import { type InspectImageMode } from "../utils/inspect-image-mode.js";
import type { ClientBridge } from "./client-bridge.js";
import type { CustomMessage } from "./messages.js";
import type { SessionManager } from "./session-manager.js";
/** Capabilities borrowed from the owning AgentSession. */
export interface SessionToolsHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    modelRegistry: ModelRegistry;
    extensionRunner(): ExtensionRunner | undefined;
    clientBridge(): ClientBridge | undefined;
    agentKind(): "main" | "sub";
    isDisposed(): boolean;
    isStreaming(): boolean;
    queuedMessageCount(): number;
    planModeEnabled(): boolean;
    model(): Model | undefined;
    memoryBackendSession(): MemoryBackendStartOptions["session"];
    clearInheritedProviderPromptCacheKey(): void;
    clearMemoryPromotionSnapshot(): void;
    captureMemoryPromotionSnapshot(prompt: string[]): void;
    emitNotice(level: "info" | "warning" | "error", message: string, source?: string): void;
    notifyCommandMetadataChanged(): void;
    localProtocolOptions(): LocalProtocolOptions;
    /** Session-scoped `/vision` override; undefined means "follow the persisted setting". */
    getInspectImageModeOverride(): InspectImageMode | undefined;
    setInspectImageModeOverride(mode: InspectImageMode | undefined): void;
    /** Publishes the current Codex Code Mode tool exposure snapshot for turn metadata; undefined clears it. */
    setCodeModeNamespacesInfo?(info: unknown): void;
}
interface SessionToolsOptions {
    autoApprove?: boolean;
    toolRegistry?: Map<string, AgentTool>;
    createVibeTools?: () => AgentTool[];
    createComputerTool?: () => Promise<AgentTool | null>;
    /** Creates the private `think` scratchpad tool for runtime setting changes. */
    createThinkTool?: () => Promise<AgentTool | null>;
    /** Creates the built-in `inspect_image` tool for session-scoped runtime enablement (see {@link SessionTools.setInspectImageMode}). */
    createInspectImageTool?: () => Promise<AgentTool | null>;
    builtInToolNames?: Iterable<string>;
    presentationPinnedToolNames?: ReadonlySet<string>;
    /** MCP tool names whose current registry entries came from the manager snapshot. */
    mcpManagerToolNames?: Iterable<string>;
    ensureWriteRegistered?: () => Promise<boolean>;
    /** Registers the hidden `goal` tool when goal mode is enabled at runtime. */
    ensureGoalRegistered?: () => Promise<boolean>;
    rebuildSystemPrompt?: (toolNames: string[], tools: Map<string, AgentTool>, options?: {
        directToolNames?: readonly string[];
    }) => Promise<{
        systemPrompt: string[];
        xdevCatalogNames?: readonly string[];
    }>;
    getMcpServerInstructions?: () => Map<string, string> | undefined;
    xdev?: XdevState;
    setActiveToolNames?: (names: Iterable<string>) => void;
    baseSystemPrompt: string[];
    skills?: Skill[];
    skillWarnings?: SkillWarning[];
    skillsSettings?: SkillsSettings;
    skillsReloadable?: boolean;
}
export interface MountedMCPToolRouteSource {
    readonly name: string;
    readonly mcpServerName?: unknown;
    readonly mcpToolName?: unknown;
}
export interface MountedMCPToolRoute {
    readonly mcpServerName: string;
    readonly mcpToolName: string;
    readonly name: string;
}
export interface MCPXdevGuidanceMapping extends MountedMCPToolRoute {
    readonly label: string;
    readonly path: string;
}
export interface MCPXdevGuidanceProjection {
    readonly mappings: readonly MCPXdevGuidanceMapping[];
    readonly hasOmittedMappings: boolean;
}
/** Yield exact mounted MCP ownership and route metadata. */
export declare function collectMountedMCPToolRoutes(tools: Iterable<MountedMCPToolRouteSource>): Generator<MountedMCPToolRoute>;
/**
 * Project exact live MCP routes into the bounded, Markdown-safe mapping data
 * rendered by the static MCP guidance prompt.
 */
export declare function projectMountedMCPXdevGuidance(routes: Iterable<MountedMCPToolRoute>): MCPXdevGuidanceProjection;
/**
 * Structured payload persisted on each {@link XDEV_MOUNT_NOTICE_MESSAGE_TYPE}
 * custom message. Lets a resumed session reconstruct which dynamic devices the
 * model has already been told about, so reconnecting hosts do not re-announce
 * (and re-splice a redundant developer message that busts the provider
 * prompt-cache prefix).
 */
interface XdevMountNoticeDetails {
    added: string[];
    removed: string[];
}
/** Owns tool registration, presentation, prompt rebuilding, skills, and permissions. */
export declare class SessionTools {
    #private;
    constructor(host: SessionToolsHost, options: SessionToolsOptions);
    /** Mutable registry shared with controller hosts that inspect available tools. */
    get registry(): Map<string, AgentTool>;
    /** Current stable base system prompt. */
    get baseSystemPrompt(): string[];
    /** Replaces the controller-owned base prompt without applying it to the agent. */
    setBaseSystemPrompt(prompt: string[]): void;
    /**
     * Registers the per-turn `before_agent_start` system-prompt override and
     * applies it to the agent. Base rebuilds during the turn preserve it until
     * {@link clearTurnSystemPromptOverride}.
     */
    setTurnSystemPromptOverride(prompt: string[]): void;
    /** Drops the active per-turn override; later rebuilds fall back to the base prompt. */
    clearTurnSystemPromptOverride(): void;
    /** Skills currently rendered into the system prompt. */
    get skills(): Skill[];
    /** Diagnostics produced while loading the current skills. */
    get skillWarnings(): SkillWarning[];
    /** Settings snapshot used for the current skill discovery. */
    get skillsSettings(): SkillsSettings | undefined;
    /** Drops cached per-session ACP `allow_always`/`reject_always` decisions. */
    clearAcpPermissionDecisions(): void;
    /** Drops cached ACP decisions and re-wraps active tools after the client changes. */
    refreshAcpPermissionGates(): void;
    /** Names of tools currently exposed at the top level. */
    getActiveToolNames(): string[];
    /** Enabled top-level, `xd://`, and Code Mode bridge tool names. */
    getEnabledToolNames(): string[];
    /** Names currently presented as `xd://` devices. */
    getMountedXdevToolNames(): string[];
    /** Whether the edit tool is registered. */
    get hasEditTool(): boolean;
    /** Looks up a registered tool by name. */
    getToolByName(name: string): AgentTool | undefined;
    /** Looks up an enabled tool through the same ACP permission gate as direct calls. */
    getToolForEvalBridge(name: string): AgentTool | undefined;
    /** Canonical allowlist advertised by and enforced for the eval bridge. */
    getEvalBridgeToolNames(): string[];
    /** Tools left directly model-visible by the last applied Code Mode partition; undefined when inactive. */
    getCodeModeDirectToolNames(): readonly string[] | undefined;
    /**
     * Whether a registry entry came from a built-in factory.
     *
     * Resolves `customWireName` aliases too: a built-in tool may present on the
     * wire under a different name (e.g. `edit` exposes itself as `apply_patch` in
     * apply_patch mode), and tool cards render the call under that wire name. An
     * extension registering the literal alias name shadows it — the agent loop
     * routes exact-name matches ahead of wire aliases — so a registered non-built-in
     * tool with that name wins and the alias no longer counts as built-in.
     */
    hasBuiltInTool(name: string): boolean;
    /** Updates source provenance when a live registry entry is replaced or restored. */
    setToolBuiltIn(name: string, builtIn: boolean): void;
    /** Whether the live registry entry is owned by the RPC host. */
    hasRpcHostTool(name: string): boolean;
    /** Whether the current MCP entry came from the manager snapshot. */
    hasMCPManagerTool(name: string): boolean;
    /** Restores manager ownership after a lifecycle registration rollback. */
    setMCPManagerTool(name: string, managerOwned: boolean): void;
    /** Current extension-owned MCP entry retained across manager refreshes. */
    getExtensionMCPTool(name: string): AgentTool | undefined;
    /** Updates extension ownership when a lifecycle registration commits or rolls back. */
    setExtensionMCPTool(name: string, tool: AgentTool | undefined): void;
    /** Serializes every registry and presentation mutation for this session. */
    runToolRegistryMutation<T>(mutation: () => Promise<T>, signal?: AbortSignal): Promise<T>;
    /** Names of every registered tool. */
    getAllToolNames(): string[];
    /**
     * Full metadata for every registered tool, including source provenance.
     *
     * Backs the `getAllTools()` ExtensionAPI method. Returns {@link ToolInfo}
     * objects (not bare names) so extensions authored against upstream
     * `@earendil-works/pi-coding-agent` — which promises `ToolInfo[]` — can read
     * `sourceInfo.source` unchanged.
     */
    getAllToolInfos(): ToolInfo[];
    /** Installs and activates the ephemeral vibe tool set. */
    activateVibeTools(baseToolNames: string[]): Promise<void>;
    /** Uninstalls vibe tools and activates the replacement set. */
    deactivateVibeTools(nextToolNames: string[]): Promise<void>;
    /** Removes vibe tools without restoring a source-session snapshot. */
    removeVibeToolsPreservingActive(): Promise<void>;
    /** Resolves the edit mode for the active model and settings. */
    resolveActiveEditMode(): EditMode;
    /** Rebuilds model-dependent tool prompts after a model change. */
    syncAfterModelChange(previousEditMode: EditMode): Promise<void>;
    /** Whether a model transition crosses a Code Mode presentation boundary. */
    codeModeChangesBetween(previousModel: Model | undefined, nextModel: Model): boolean;
    codeModeDirectWireMetadataChanged(): boolean;
    /** Reapplies the enabled set after model or Code Mode setting changes. */
    reconcileCodeMode(): Promise<void>;
    /** Enabled MCP tools in their current presentation partition. */
    getSelectedMCPToolNames(): string[];
    /** Applies an enabled tool set and reconciles its `xd://` partition. */
    applyActiveToolsByName(toolNames: string[], forcePromptRefresh?: boolean, signal?: AbortSignal): Promise<void>;
    /**
     * Forget the announced-mount baseline for a replaced transcript. Called when
     * session history is swapped wholesale (`/new`, `switchSession`, `branch`): the
     * previous transcript's persisted notices no longer apply, so the next notice
     * re-seeds from the new history and a device reconnecting into it announces
     * again.
     *
     * The pending delta is deliberately preserved: it holds mounts that are still
     * live but not yet delivered to the model, and `branch()` does not rebuild the
     * base system prompt, so dropping it would leave the branched transcript
     * unaware of a still-mounted device that no later refresh would re-queue.
     */
    resetAnnouncedMounts(): void;
    /** Consumes the hidden notice for unannounced `xd://` mount changes. */
    takePendingXdevMountNotice(baseCatalogDelivered: boolean): CustomMessage<XdevMountNoticeDetails> | undefined;
    /** Rediscovers reloadable skills and refreshes prompt metadata. */
    refreshSkills(): Promise<void>;
    /** Selects enabled tools, ignoring names absent from the registry. */
    setActiveToolsByName(toolNames: string[]): Promise<void>;
    /**
     * Restore an enabled tool set with its exact top-level versus `xd://` partition.
     *
     * Both inputs are required because {@link setActiveToolsByName} only receives the
     * enabled name list and classifies mounts from the current presentation set.
     * Rollback/restore callers must pass the snapshotted mounted subset so names that
     * were top-level stay pinned (`#runtimeSelectedToolNames`) and names that were under
     * `xd://` remain mount-eligible, even when the live mount set has drifted.
     *
     * Names outside `mountedToolNames` are pinned top-level for this application;
     * names in the mounted subset remain eligible for xdev mounting. Set
     * `forcePromptRefresh` when an enabled tool's schema or prompt-visible metadata
     * changed without changing its name or presentation.
     *
     * Delegates the actual apply through {@link applyActiveToolsByName} and restores
     * the prior runtime selection if that apply throws.
     */
    setActiveToolPresentation(toolNames: string[], mountedToolNames: string[], forcePromptRefresh?: boolean, signal?: AbortSignal): Promise<void>;
    /** Replaces memory-backend tools while preserving unrelated selections. */
    replaceMemoryTools(tools: AgentTool[]): Promise<void>;
    /**
     * Session-scoped enable/disable for the settings-gated `computer` tool.
     *
     * `createTools` derives the built-in slate once at session start, so a runtime
     * `computer.enabled` override alone never changes the active tools. Enabling
     * builds the tool through the config factory on first use (later toggles reuse
     * the registry entry, so only one desktop controller is ever registered) and
     * activates it; disabling drops it from the active set while keeping the
     * registry entry. Takes effect before the next model call.
     *
     * @returns false when enabling was requested but this session cannot build the
     * tool (e.g. restricted child sessions have no factory).
     */
    setComputerToolEnabled(enabled: boolean): Promise<boolean>;
    /**
     * Session-scoped enable/disable for the private `think` scratchpad tool.
     *
     * Enabling constructs the tool once and refreshes the model's tool contract;
     * disabling removes it from the active set while preserving its registry entry.
     *
     * @returns false when enabling was requested but this session cannot build the tool.
     */
    setThinkToolEnabled(enabled: boolean): Promise<boolean>;
    /** Reconciles the external scratchpad after the active model changes. */
    reconcileThinkTool(): Promise<boolean>;
    /** Current effective inspect_image state for `/vision status`. */
    inspectImageState(): {
        mode: InspectImageMode;
        active: boolean;
        model: string | undefined;
    };
    /**
     * Brings the active tool set in line with the effective inspect_image state
     * (mode setting, `/vision` override, active-model image capability).
     * Mirrors {@link setComputerToolEnabled}: enabling builds the tool through
     * the config factory on first use and reuses the registry entry afterwards.
     * Idempotent — safe to call from every model/settings change path.
     *
     * @returns false when the tool should be active but this session cannot
     *   build it (e.g. restricted child sessions have no factory).
     */
    reconcileInspectImageTool(): Promise<boolean>;
    /**
     * Reconciles inspect_image after a model change and surfaces a notice when
     * the visible tool set actually flipped. Called from every model-change
     * path — including retry-fallback switches that bypass
     * {@link syncAfterModelChange}.
     */
    reconcileInspectImageAfterModelChange(): Promise<void>;
    /**
     * Session-scoped `/vision` override. `auto` clears the override so the
     * persisted `inspect_image.mode` setting (itself possibly `auto`) decides;
     * `on`/`off` force the tool for this session only. Takes effect before the
     * next model call.
     *
     * @returns false when `on` was requested but the tool cannot be built here.
     */
    setInspectImageMode(mode: InspectImageMode): Promise<boolean>;
    /** Rebuilds the stable base prompt for the current tools and model. */
    refreshBaseSystemPrompt(): Promise<void>;
    /** Applies one-turn memory prompt injection before an agent run. */
    buildSystemPromptForAgentStart(promptText: string): Promise<string[]>;
    /**
     * Replace MCP tools in the registry and enable them immediately. Refreshes
     * are serialized so an older asynchronous prompt rebuild cannot commit
     * after a newer catalog snapshot. Every connected MCP tool becomes available
     * (mounted under `xd://` when that transport is active, else top-level).
     */
    refreshMCPTools(mcpTools: CustomTool[]): Promise<void>;
    /** Replaces RPC host-owned tools and refreshes the active set before the next model call. */
    refreshRpcHostTools(rpcTools: AgentTool[]): Promise<void>;
}
export {};
