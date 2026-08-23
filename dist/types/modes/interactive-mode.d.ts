import { type Agent, type AgentMessage } from "@oh-my-pi/pi-agent-core";
import type { CompactionOutcome } from "@oh-my-pi/pi-agent-core/compaction";
import type { AssistantMessage, ImageContent, Message, Usage, UsageReport } from "@oh-my-pi/pi-ai";
import type { Component, EditorTheme } from "@oh-my-pi/pi-tui";
import { Container, Loader, Spacer, Text, type TUI } from "@oh-my-pi/pi-tui";
import type { CollabGuestLink } from "../collab/guest.js";
import type { CollabHost } from "../collab/host.js";
import { KeybindingsManager } from "../config/keybindings.js";
import { Settings } from "../config/settings.js";
import type { AutocompleteProviderFactory, ExtensionCustomOptions, ExtensionUIContext, ExtensionUIDialogOptions, ExtensionUISelectItem, ExtensionWidgetContent, ExtensionWidgetOptions } from "../extensibility/extensions/index.js";
import type { CompactOptions } from "../extensibility/extensions/types.js";
import type { Skill } from "../extensibility/skills.js";
import type { FileSlashCommand } from "../extensibility/slash-commands.js";
import type { MCPManager } from "../mcp/index.js";
import { type PlanApprovalDetails } from "../plan-mode/approved-plan.js";
import { type AgentSession } from "../session/agent-session.js";
import type { CompactMode } from "../session/compact-modes.js";
import type { ForeignSessionSource } from "../session/foreign-session-store.js";
import { HistoryStorage } from "../session/history-storage.js";
import type { SessionContext } from "../session/session-context.js";
import type { SessionManager } from "../session/session-manager.js";
import type { ShakeMode } from "../session/shake-types.js";
import type { LspStartupServerInfo } from "../tools/index.js";
import { type StartupChangelogSelection } from "../utils/changelog.js";
import type { EventBus } from "../utils/event-bus.js";
import type { AssistantMessageComponent } from "./components/assistant-message.js";
import type { BashExecutionComponent } from "./components/bash-execution.js";
import { CustomEditor } from "./components/custom-editor.js";
import type { EvalExecutionComponent } from "./components/eval-execution.js";
import type { HookEditorComponent } from "./components/hook-editor.js";
import type { HookInputComponent } from "./components/hook-input.js";
import type { HookSelectorComponent, HookSelectorSlider } from "./components/hook-selector.js";
import { type PlanReviewAnnotationState } from "./components/plan-review-overlay.js";
import { StatusLineComponent } from "./components/status-line/index.js";
import { type ToolExecutionHandle } from "./components/tool-execution.js";
import { TranscriptContainer } from "./components/transcript-container.js";
import { Composer } from "./composer.js";
import { EventController } from "./controllers/event-controller.js";
import { type LoopLimitRuntime } from "./loop-limit.js";
import { OAuthManualInputManager } from "./oauth-manual-input.js";
import { type ObservableSession } from "./session-observer-registry.js";
import type { Theme } from "./theme/theme.js";
import type { CompactionQueuedMessage, InteractiveModeContext, InteractiveModeInitOptions, InteractiveSelectorDialogOptions, RenderSessionContextOptions, SubmittedUserInput, TodoItem, TodoPhase } from "./types.js";
/**
 * Editor max-height cap for a terminal of `terminalRows` rows.
 *
 * Roomy terminals get the comfortable [6, 18] band. Small terminals shrink the
 * cap so the editor leaves at least EDITOR_MIN_CHROME_ROWS rows for the
 * transcript + status line. The editor is bordered, so it never renders fewer
 * than EDITOR_MIN_RENDERED_ROWS rows; once the terminal is too small for both
 * (terminalRows < EDITOR_MIN_RENDERED_ROWS + EDITOR_MIN_CHROME_ROWS) the cap is
 * pinned to that floor — returning a smaller number would not shrink the editor
 * any further, it would only misreport the rows it actually occupies.
 */
export declare function computeEditorMaxHeight(terminalRows: number): number;
/** Suggested save filename for an approved plan: `<TOPIC>_PLAN.md` from the
 *  tiny-model topic (e.g. `PYO3_METHODS_PLAN.md`), trimmed to a word boundary
 *  when a verbose fallback title sneaks through. */
export declare function planSaveFileName(title: string): string;
export declare function shouldEnterPlanModeOnStartup(sessionManager: Pick<SessionManager, "buildSessionContext" | "getEntries">, sessionSettings: Pick<Settings, "get">): boolean;
/** Options for creating an InteractiveMode instance (for future API use) */
export interface InteractiveModeOptions {
    /** Providers that were migrated during startup */
    migratedProviders?: string[];
    /** Warning message if model fallback occurred */
    modelFallbackMessage?: string;
    /** Initial message to send */
    initialMessage?: string;
    /** Initial images to include with the message */
    initialImages?: ImageContent[];
    /** Additional initial messages to queue */
    initialMessages?: string[];
}
export declare const TODO_COMPACT_TERMINAL_ROWS_THRESHOLD = 18;
/**
 * Build the anchored subagent HUD block: a bold accent "Subagents" header plus
 * a bounded set of running-agent rows in the same `Id ⟨role⟩: description` shape
 * the inline task rows use (muted task preview when no description was given).
 * Layout mirrors the Todos HUD exactly: unindented header, then
 * `renderTreeList` rows (dim connectors) shifted right by one space.
 * Only detached background spawns are listed: a sync task call blocks the
 * parent turn and its inline tool block already renders progress live, and
 * eval `agent()` spawns are rendered by their own eval cell tree.
 * Returns an empty array when nothing is running so the container can clear.
 */
export declare function renderSubagentHudLines(sessions: ObservableSession[], columns: number): string[];
export declare class InteractiveMode implements InteractiveModeContext {
    #private;
    session: AgentSession;
    sessionManager: SessionManager;
    settings: Settings;
    keybindings: KeybindingsManager;
    agent: Agent;
    historyStorage?: HistoryStorage;
    /** Canonical composer shared by cold prepaint and the session-aware runtime. */
    readonly composer: Composer;
    ui: TUI;
    chatContainer: TranscriptContainer;
    pendingMessagesContainer: Container;
    statusContainer: Container;
    todoContainer: Container;
    subagentContainer: Container;
    btwContainer: Container;
    omfgContainer: Container;
    cleanseContainer: Container;
    errorBannerContainer: Container;
    modelCycleContainer: Container;
    deferredCommandContainer: Container;
    editor: CustomEditor;
    editorContainer: Container;
    /** Composer attachment band (chip cards) rendered directly above the prompt box. */
    attachmentChipsContainer: Container;
    hookWidgetContainerAbove: Container;
    hookWidgetContainerBelow: Container;
    statusLine: StatusLineComponent;
    isInitialized: boolean;
    initialChatRendered: boolean;
    isBashMode: boolean;
    toolOutputExpanded: boolean;
    hideToolActivity: boolean;
    todoExpanded: boolean;
    planModeEnabled: boolean;
    planModePaused: boolean;
    goalModeEnabled: boolean;
    goalModePaused: boolean;
    vibeModeEnabled: boolean;
    planModePlanFilePath: string | undefined;
    loopModeEnabled: boolean;
    loopModePaused: boolean;
    loopPrompt: string | undefined;
    loopLimit: LoopLimitRuntime | undefined;
    todoPhases: TodoPhase[];
    hideThinkingBlock: boolean;
    /** Whether the visible session has produced thinking content the user can reveal. */
    get hasDisplayableThinkingContent(): boolean;
    /** Record received reasoning content so Ctrl+T can reveal it even when model metadata says thinking is off. */
    noteDisplayableThinkingContent(message: AgentMessage): boolean;
    /**
     * Effective thinking-block visibility: hidden when the user's setting is on,
     * or while thinking is "off" before the session has actually produced
     * displayable thinking content. Some providers return thinking blocks without
     * advertising reasoning support, so observed content unlocks the visibility
     * toggle.
     */
    get effectiveHideThinkingBlock(): boolean;
    proseOnlyThinking: boolean;
    compactionQueuedMessages: CompactionQueuedMessage[];
    pendingTools: Map<string, ToolExecutionHandle>;
    transcriptMessageComponents: WeakMap<AgentMessage, Component>;
    pendingBashComponents: BashExecutionComponent[];
    bashComponent: BashExecutionComponent | undefined;
    pendingPythonComponents: EvalExecutionComponent[];
    pythonComponent: EvalExecutionComponent | undefined;
    isPythonMode: boolean;
    streamingComponent: AssistantMessageComponent | undefined;
    streamingMessage: AssistantMessage | undefined;
    lastAssistantUsage: Usage | undefined;
    loadingAnimation: Loader | undefined;
    autoCompactionLoader: Loader | undefined;
    retryLoader: Loader | undefined;
    unsubscribe?: () => void;
    onInputCallback?: (input: SubmittedUserInput) => void;
    optimisticUserMessageSignature: string | undefined;
    locallySubmittedUserSignatures: Set<string>;
    /** True while an optimistically-rendered `/skill:` row awaits its canonical
     *  `message_start`. Read by the event controller to reconcile the row. */
    optimisticSkillMessagePending: boolean;
    lastSigintTime: number;
    lastEscapeTime: number;
    /** Owns Esc for every `/mcp test` that is active or whose cancellation hint may still be visible. */
    mcpTestEscapeHandlers: Set<() => void>;
    lastLeftTapTime: number;
    shutdownRequested: boolean;
    /** True once `shutdown()` has begun teardown. Surfaced to the input
     *  controller so a Ctrl+C arriving while teardown is in flight can hard-
     *  abort the remaining work instead of stacking another no-op call. */
    get isShuttingDown(): boolean;
    hookSelector: HookSelectorComponent | undefined;
    hookInput: HookInputComponent | undefined;
    hookEditor: HookEditorComponent | undefined;
    lastStatusSpacer: Spacer | undefined;
    lastStatusText: Text | undefined;
    fileSlashCommands: Set<string>;
    skillCommands: Map<string, Skill>;
    oauthManualInput: OAuthManualInputManager;
    collabHost?: CollabHost;
    collabGuest?: CollabGuestLink;
    readonly lspServers: LspStartupServerInfo[] | undefined;
    mcpManager?: MCPManager;
    get eventController(): EventController;
    get eventBus(): EventBus | undefined;
    get viewSession(): AgentSession;
    get focusedAgentId(): string | undefined;
    get sessionName(): string | undefined;
    focusAgentSession(id: string): Promise<void>;
    focusParentSession(): Promise<void>;
    unfocusSession(): Promise<void>;
    clearTransientSessionUi(): void;
    constructor(session: AgentSession, version: string, startupChangelog?: StartupChangelogSelection | undefined, setToolUIContext?: (uiContext: ExtensionUIContext, hasUI: boolean) => void, lspServers?: LspStartupServerInfo[] | undefined, mcpManager?: MCPManager, eventBus?: EventBus, composer?: Composer);
    playWelcomeIntro(): void;
    init(options?: InteractiveModeInitOptions): Promise<void>;
    /** Reload the title-generation system prompt override for the provided working
     *  directory and stash it on the session so first-input titling
     *  ({@link input-controller}) and replan-driven refresh
     *  ({@link AgentSession.#refreshTitleAfterReplan}) share one source
     *  ({@link discoverTitleSystemPromptFile}; issue #3734). */
    refreshTitleSystemPrompt(cwd?: string): Promise<void>;
    /** Reload session skills and the `/skill:<name>` command list. */
    refreshSkillState(): Promise<void>;
    /** Reload slash commands and autocomplete for the provided working directory. */
    refreshSlashCommandState(cwd?: string, preloaded?: ReadonlyArray<FileSlashCommand>): Promise<void>;
    /** Stack extension autocomplete behavior on top of the built-in editor provider (#4919). */
    addAutocompleteProvider(factory: AutocompleteProviderFactory): void;
    /**
     * Re-point the process and every cwd-derived cache at `newCwd` after the
     * active session's working directory changed (`/move` relocation or resuming
     * a session from another project). The SessionManager's cwd MUST already
     * reflect `newCwd` before this is called.
     */
    applyCwdChange(newCwd: string): Promise<void>;
    getUserInput(): Promise<SubmittedUserInput>;
    disableLoopMode(message?: string): void;
    setLoopPrompt(prompt: string): void;
    /**
     * Pause the loop without exiting it: drops the captured prompt and any
     * pending auto-resubmit. Loop mode stays enabled — the next prompt the
     * user submits becomes the new loop prompt and resumes iteration.
     */
    pauseLoop(): void;
    handleLoopCommand(args?: string): Promise<string | undefined>;
    recordLocalSubmission(text: string, imageCount?: number): () => void;
    withLocalSubmission<T>(text: string, fn: () => Promise<T>, options?: {
        imageCount?: number;
    }): Promise<T>;
    clearOptimisticUserMessage(): void;
    replaceOptimisticUserMessage(message: AgentMessage, options?: {
        imageLinks?: readonly (string | undefined)[];
    }): void;
    /**
     * Optimistically render a user-invoked `/skill:` row before its awaited
     * dispatch so a slow preflight (memory recall, `before_agent_start` hooks,
     * auto-thinking classification, pre-prompt compaction) does not leave the
     * submission invisible — normal prompts paint their row via
     * {@link startPendingSubmission} the same way (issue #8895). The canonical
     * skill `message_start` swaps this row in place via
     * {@link reconcileOptimisticSkillMessage}; a failed or bailed dispatch drops
     * it via {@link clearOptimisticSkillMessage}.
     */
    renderOptimisticSkillMessage(message: AgentMessage, options?: {
        imageLinks?: readonly (string | undefined)[];
    }): void;
    /** Replace the optimistic `/skill:` row with the canonical message emitted by
     *  the session, mirroring {@link replaceOptimisticUserMessage} for skills. */
    reconcileOptimisticSkillMessage(message: AgentMessage): void;
    /** Drop the optimistic `/skill:` row when dispatch fails or bails before the
     *  message reaches the agent (aborted preflight, streaming-race requeue). */
    clearOptimisticSkillMessage(): void;
    startPendingSubmission(input: {
        text: string;
        images?: ImageContent[];
        imageLinks?: (string | undefined)[];
        customType?: string;
        display?: boolean;
        streamingBehavior?: "steer" | "followUp";
    }, options?: {
        preserveDraft?: boolean;
    }): SubmittedUserInput;
    cancelPendingSubmission(): boolean;
    markPendingSubmissionStarted(input: SubmittedUserInput): boolean;
    finishPendingSubmission(input: SubmittedUserInput): void;
    syncEditorSpelling(): void;
    syncComposerShape(): void;
    updateEditorBorderColor(): void;
    /** Refresh the running-subagents status badge from the active local or collab registry. */
    syncRunningSubagentBadge(options?: {
        requestRender?: boolean;
    }): void;
    rebuildChatFromMessages(options?: {
        reuseSettledComponents?: boolean;
    }): void;
    /**
     * Render the ctrl+p model-role cycle chip track into its own anchored
     * container (just above the editor), mirroring the todo HUD: the container is
     * cleared and rebuilt in place on every cycle, so rapid presses or concurrent
     * chat activity can never stack duplicate tracks into the scrollback.
     */
    showModelCycleTrack(track: string): void;
    isCompactTodoMode(): boolean;
    renderCompactStatusLine(width: number, childLines: readonly string[]): readonly string[];
    /** Apply any deferred model switch after the current stream ends. */
    flushPendingModelSwitch(): Promise<void>;
    showPlanReview(planContent: string, title: string, options: string[], dialogOptions?: {
        helpText?: string;
        disabledIndices?: number[];
        onExternalEditor?: () => void;
        onPlanEdited?: (content: string) => void;
        onFeedbackChange?: (feedback: string) => void;
        annotationState?: PlanReviewAnnotationState;
        onAnnotationStateChange?: (state: PlanReviewAnnotationState) => void;
        initialIndex?: number;
    }, extra?: {
        slider?: HookSelectorSlider;
    }): Promise<string | undefined>;
    handlePlanModeCommand(initialPrompt?: string, input?: Pick<SubmittedUserInput, "images" | "imageLinks">): Promise<boolean>;
    /**
     * `/vibe` toggle. Entering installs the ephemeral vibe tools, strips the
     * active toolset down to `read`, optional parent-owned `todo`, plus those
     * tools, and injects the director context. Exiting unregisters them, restores
     * the previous toolset, and kills every worker session so workers cannot
     * outlive the mode that directs them.
     */
    handleVibeModeCommand(initialPrompt?: string, input?: Pick<SubmittedUserInput, "images" | "imageLinks">): Promise<boolean>;
    handleGoalModeCommand(rest?: string, input?: Pick<SubmittedUserInput, "images" | "imageLinks">): Promise<boolean>;
    handleGuidedGoalCommand(rest?: string, input?: Pick<SubmittedUserInput, "images" | "imageLinks">): Promise<boolean>;
    /** Manually (re-)open the plan-review overlay — bound to `/plan-review`. Lets
     *  the operator pull the review back up after dismissing it, or review a plan
     *  the agent wrote without dispatching approval. There is no fixed plan filename:
     *  `getPlanReferencePath()` is empty until a plan is actually approved (and does
     *  not survive a restart), so this drives off the newest `local://<slug>-plan.md`
     *  the agent wrote — the files persist in the session artifacts dir, so the scan
     *  works before any review and across restarts. */
    openPlanReview(): Promise<void>;
    handlePlanApproval(details: PlanApprovalDetails): Promise<void>;
    stop(): void;
    shutdown(): Promise<void>;
    checkShutdownRequested(): Promise<void>;
    setToolUIContext(uiContext: ExtensionUIContext, hasUI: boolean): void;
    initializeHookRunner(uiContext: ExtensionUIContext, hasUI: boolean): void;
    setEditorComponent(factory: ((tui: TUI, theme: EditorTheme, keybindings: KeybindingsManager) => CustomEditor) | undefined): void;
    present(content: Component | readonly Component[]): void;
    /**
     * Defer transcript command panels while the agent is streaming, then mount
     * them at the next settle, terminal or not. A non-terminal settle is only a
     * scheduling pause, so resumed streaming can still land below a panel
     * flushed there. That is preferred over leaving it queued behind a command
     * the user runs during the pause, which mounts immediately and would put the
     * older panel out of order.
     *
     * The deferral is acknowledged in {@link deferredCommandContainer}, an
     * anchored container above the editor. Nothing is mounted into the
     * transcript: a mid-turn mount changes the active frame while streaming,
     * which is why the earlier `showStatus` acknowledgment was reverted. An
     * anchored container is cleared and rebuilt in place without adding history
     * rows — the same reason the ctrl+p role-cycle track lives there.
     */
    presentCommandOutput(content: Component | readonly Component[]): void;
    /** Mount every command panel queued for the current session while the agent was streaming. */
    flushPendingCommandOutput(): void;
    resetTranscript(): void;
    showStatus(message: string, options?: {
        dim?: boolean;
    }): void;
    showError(message: string): void;
    showPinnedError(message: string): void;
    clearPinnedError(): void;
    showWarning(message: string, options?: {
        hideWithToolActivity?: boolean;
    }): void;
    ensureLoadingAnimation(): void;
    setWorkingMessage(message?: string): void;
    applyPendingWorkingMessage(): void;
    showNewVersionNotification(newVersion: string): void;
    clearEditor(): void;
    updatePendingMessagesDisplay(): void;
    queueCompactionMessage(text: string, mode: "steer" | "followUp", images?: ImageContent[]): void;
    flushCompactionQueue(options?: {
        willRetry?: boolean;
    }): Promise<void>;
    flushPendingBashComponents(): void;
    isKnownSlashCommand(text: string): boolean;
    addMessageToChat(message: AgentMessage, options?: {
        imageLinks?: readonly (string | undefined)[];
        reuseSettledComponent?: boolean;
    }): Component[];
    renderSessionContext(sessionContext: SessionContext, options?: RenderSessionContextOptions): void;
    /** Build a session context in bounded chunks so terminal input runs between event-loop turns. */
    renderSessionContextIncrementally(sessionContext: SessionContext, options: RenderSessionContextOptions, renderChunk?: () => void): Promise<void>;
    renderInitialMessages(options?: {
        preserveExistingChat?: boolean;
        clearTerminalHistory?: boolean;
    }): Promise<void>;
    truncateTranscriptFromMessage(message: AgentMessage): boolean;
    getUserMessageText(message: Message): string;
    findLastAssistantMessage(): AssistantMessage | undefined;
    extractAssistantText(message: AssistantMessage): string;
    handleExportCommand(text: string): Promise<void>;
    handleDumpCommand(): Promise<void>;
    handleAdvisorDumpCommand(isRaw?: boolean): void;
    handleDebugTranscriptCommand(): Promise<void>;
    handleShareCommand(): Promise<void>;
    handleTodoCommand(args: string): Promise<void>;
    handleSessionCommand(): Promise<void>;
    handleAdvisorStatusCommand(): Promise<void>;
    handleJobsCommand(): Promise<void>;
    handleUsageCommand(reports?: UsageReport[] | null): Promise<void>;
    handleChangelogCommand(showFull?: boolean): Promise<void>;
    handleHotkeysCommand(): void;
    handleToolsCommand(): void;
    handleContextCommand(): void;
    handleClearCommand(): Promise<void>;
    handleFreshCommand(): Promise<void>;
    handleResetContextCommand(): Promise<void>;
    handleDropCommand(): Promise<void>;
    handleForkCommand(): Promise<void>;
    handleMoveCommand(targetPath?: string): Promise<void>;
    handleRenameCommand(title: string): Promise<void>;
    handleMemoryCommand(text: string): Promise<void>;
    handleSTTToggle(): Promise<void>;
    /** Start or stop the Codex-backed realtime voice surface. */
    handleLiveCommand(): Promise<void>;
    showDebugSelector(): Promise<void>;
    showAgentHub(options?: {
        requireContent?: boolean;
        armCloseTap?: boolean;
    }): void;
    resetObserverRegistry(): void;
    handleBashCommand(command: string, excludeFromContext?: boolean): Promise<void>;
    handlePythonCommand(code: string, excludeFromContext?: boolean): Promise<void>;
    handleMCPCommand(text: string): Promise<void>;
    handleSSHCommand(text: string): Promise<void>;
    handleCompactCommand(customInstructions?: string, mode?: CompactMode, beforeFlush?: (outcome: CompactionOutcome) => void | Promise<void>, internalGuidance?: string): Promise<CompactionOutcome>;
    handleHandoffCommand(customInstructions?: string): Promise<void>;
    handleShakeCommand(mode: ShakeMode): Promise<void>;
    executeCompaction(customInstructionsOrOptions?: string | CompactOptions, isAuto?: boolean): Promise<CompactionOutcome>;
    openInBrowser(urlOrPath: string): void;
    showSettingsSelector(): void;
    showAdvisorConfigure(): void;
    showHistorySearch(): void;
    showExtensionsDashboard(): void;
    showAgentsDashboard(): void;
    showModelSelector(options?: {
        temporaryOnly?: boolean;
    }): void;
    showPluginSelector(mode?: "install" | "uninstall"): void;
    showUserMessageSelector(): void;
    showCopySelector(): void;
    showTreeSelector(): void;
    showSessionSelector(source?: ForeignSessionSource): void;
    handleResumeSession(sessionPath: string): Promise<void>;
    handleSessionDeleteCommand(): Promise<void>;
    showOAuthSelector(mode: "login" | "logout", providerId?: string): Promise<void>;
    showSessionPinSelector(): Promise<void>;
    showResetUsageSelector(): Promise<void>;
    showProviderSetup(): Promise<void>;
    showHookConfirm(title: string, message: string): Promise<boolean>;
    handleCtrlC(): void;
    handleCtrlD(): void;
    handleCtrlZ(): void;
    resetDisplayAfterAppearanceRefresh(): void;
    handleDequeue(): void;
    handleImagePaste(): Promise<boolean>;
    /** Queue slash-command input behind the active turn. */
    handleQueueCommand(message: string): Promise<void>;
    handleBtwCommand(question: string): Promise<void>;
    handleTanCommand(work: string): Promise<void>;
    hasActiveBtw(): boolean;
    handleBtwEscape(): boolean;
    canBranchBtw(): boolean;
    /** Reserves plain `b` only after /btw has a completed branch action to handle. */
    handlesBtwBranchKey(): boolean;
    handleBtwBranchKey(): Promise<boolean>;
    canCopyBtw(): boolean;
    handleBtwCopyKey(): Promise<boolean>;
    handleBtwBranch(question: string, assistantMessage: AssistantMessage, leafId: string, sessionId: string): Promise<void>;
    handleOmfgCommand(complaint: string): Promise<void>;
    hasActiveOmfg(): boolean;
    handleOmfgEscape(): boolean;
    handleCleanseCommand(args: string): Promise<void>;
    hasActiveCleanse(): boolean;
    handleCleanseEscape(): boolean;
    cycleThinkingLevel(): void;
    cycleRoleModel(direction?: "forward" | "backward"): Promise<void>;
    toggleToolOutputExpansion(): void;
    setToolsExpanded(expanded: boolean): void;
    toggleThinkingBlockVisibility(): void;
    toggleTodoExpansion(): void;
    setTodos(todos: TodoItem[] | TodoPhase[]): void;
    reloadTodos(): Promise<void>;
    openExternalEditor(): void;
    registerExtensionShortcuts(): void;
    initHooksAndCustomTools(): Promise<void>;
    getToolUIContext(): ExtensionUIContext | undefined;
    emitCustomToolSessionEvent(reason: "start" | "switch" | "branch" | "tree" | "shutdown", previousSessionFile?: string): Promise<void>;
    setHookWidget(key: string, content: ExtensionWidgetContent, options?: ExtensionWidgetOptions): void;
    setHookStatus(key: string, text: string | undefined): void;
    showHookSelector(title: string, options: ExtensionUISelectItem[], dialogOptions?: InteractiveSelectorDialogOptions, extra?: {
        slider?: HookSelectorSlider;
    }): Promise<string | undefined>;
    hideHookSelector(): void;
    showHookInput(title: string, placeholder?: string): Promise<string | undefined>;
    hideHookInput(): void;
    showHookEditor(title: string, prefill?: string, dialogOptions?: ExtensionUIDialogOptions, editorOptions?: {
        promptStyle?: boolean;
    }): Promise<string | undefined>;
    hideHookEditor(): void;
    showHookNotify(message: string, type?: "info" | "warning" | "error"): void;
    showHookCustom<T>(factory: (tui: TUI, theme: Theme, keybindings: KeybindingsManager, done: (result: T) => void) => (Component & {
        dispose?(): void;
    }) | Promise<Component & {
        dispose?(): void;
    }>, options?: ExtensionCustomOptions): Promise<T>;
    showExtensionError(extensionPath: string, error: string): void;
    showToolError(toolName: string, error: string): void;
}
