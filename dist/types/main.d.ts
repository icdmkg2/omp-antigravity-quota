import { type ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Model } from "@oh-my-pi/pi-ai";
import { type Args } from "./cli/args.js";
import { selectSession } from "./cli/session-picker.js";
import { ModelRegistry } from "./config/model-registry.js";
import { type ScopedModel } from "./config/model-resolver.js";
import { Settings } from "./config/settings.js";
import type { ExtensionUIContext } from "./extensibility/extensions/types.js";
import { InteractiveMode } from "./modes/interactive-mode.js";
import type { SubmittedUserInput } from "./modes/types.js";
import { type CreateAgentSessionOptions, type CreateAgentSessionResult, createAgentSession, discoverAuthStorage } from "./sdk.js";
import type { AgentSession } from "./session/agent-session.js";
import type { AuthStorage } from "./session/auth-storage.js";
import type { ForeignSessionSource, ForeignSessionStore } from "./session/foreign-session-store.js";
import { type SessionInfo } from "./session/session-listing.js";
import { SessionManager } from "./session/session-manager.js";
type RunAcpMode = (createSession: AcpSessionFactory) => Promise<never>;
export declare function writeStartupNotice(parsedArgs: Pick<Args, "mode">, text: string): void;
/** Reads a non-TTY stdin stream as prompt text. */
export declare function readPipedInput(): Promise<string | undefined>;
export interface InteractiveModeNotify {
    kind: "warn" | "error" | "info";
    message: string;
}
export declare function buildModelScopeNotification(scopedModelsForDisplay: readonly Pick<ScopedModel, "model" | "thinkingLevel" | "explicitThinkingLevel">[], startupQuiet: boolean): InteractiveModeNotify | null;
export declare function submitInteractiveInput(mode: Pick<InteractiveMode, "markPendingSubmissionStarted" | "finishPendingSubmission" | "showError" | "checkShutdownRequested">, session: Pick<AgentSession, "prompt" | "promptCustomMessage" | "isStreaming">, input: SubmittedUserInput): Promise<void>;
interface AcpSessionHandle {
    session: AgentSession;
    setToolUIContext: (uiContext: ExtensionUIContext, hasUI: boolean) => void;
}
type AcpSessionFactory = (cwd: string, options?: {
    interactivePrompts?: boolean;
}) => Promise<AcpSessionHandle>;
export interface AcpSessionFactoryOptions {
    baseOptions: CreateAgentSessionOptions;
    settings: Settings;
    sessionDir?: string;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
    parsedArgs: Pick<Args, "apiKey" | "trustedExtensions" | "tools">;
    rawArgs: string[];
    createSession: (options: CreateAgentSessionOptions) => Promise<CreateAgentSessionResult>;
}
/**
 * Build the per-`session/new` factory used by ACP mode.
 *
 * MCP servers in ACP sessions are owned exclusively by the ACP client, which
 * supplies them through `session/new.mcpServers` and re-applies them via
 * {@link AcpAgent#configureMcpServers}. We therefore force `enableMCP: false`
 * on every session created here so {@link createAgentSession} skips the on-disk
 * `.mcp.json` discovery path — otherwise host MCP tools land in the session's
 * tool registry and shadow the client-supplied servers (issue #1234).
 */
export declare function createAcpSessionFactory(args: AcpSessionFactoryOptions): AcpSessionFactory;
type SessionPromptResult = "accepted" | "declined" | "unavailable";
type SessionPrompt = (session: SessionInfo) => Promise<SessionPromptResult>;
/**
 * Friendly CLI failure raised by {@link createSessionManager} when the user's
 * session-resolution flags (`--resume`/`--fork`/missing-directory move prompts)
 * cannot be satisfied. {@link runRootCommand} catches it and prints a clean
 * stderr message instead of letting it surface as `[Uncaught Exception]`
 * (see issue #2084).
 */
export declare class SessionResolutionError extends Error {
    readonly hint?: string;
    constructor(message: string, hint?: string);
}
/**
 * Resolve the effective model allow-list from an explicit `--models` scope or,
 * failing that, the active project's `enabledModels`. A totally collapsed scope
 * gets one cache-aware discovery pass before session construction: otherwise an
 * all-discovery `--models` launch can select an unrelated static model before the
 * later background rebuild activates the requested scope. The pass only helps
 * providers already known to be discoverable (models.yml `discovery:`, runtime
 * managers); a scope naming only extension-supplied models stays empty here
 * because those providers register during `createAgentSession` — that case is
 * covered by deferring to the SDK's `modelPattern` resolution in
 * {@link buildSessionOptions}. Re-run after a resume switches projects so the
 * destination project's settings-derived scope wins over the launch directory's.
 */
export declare function resolveScopedModels(parsed: Args, modelRegistry: Pick<ModelRegistry, "getAvailable" | "getDiscoverableProviders" | "refresh">, activeSettings: Settings): Promise<ScopedModel[]>;
/**
 * Map resolver scope entries to the session's Ctrl+P cycle shape, filling in the
 * configured default thinking level for entries without an explicit `:level`
 * suffix. `auto` is session-level only, so it is coerced to a concrete default here.
 */
export declare function toSessionScopedModels(scopedModels: readonly ScopedModel[], activeSettings: Settings): Array<{
    model: Model;
    thinkingLevel?: ThinkingLevel;
}>;
/** Minimal session surface the post-discovery scope rebuild mutates. */
export interface ScopedModelSink {
    readonly isDisposed: boolean;
    readonly scopedModels: ReadonlyArray<{
        model: Model;
        thinkingLevel?: ThinkingLevel;
    }>;
    setScopedModels(scopedModels: Array<{
        model: Model;
        thinkingLevel?: ThinkingLevel;
    }>): void;
}
/**
 * Startup resolves the `--models`/`enabledModels` scope from the model registry
 * before background provider discovery runs — `createSession` fires
 * `refreshInBackground()` only after the session is built — so a scoped selector
 * whose model first materializes through runtime discovery (e.g.
 * `opencode-go/ox-alpha-free` on a fresh launch with no cache row) is absent from
 * the frozen scoped `/models` list even though it is in `enabledModels`, invokable
 * via `--model`, and listed by `omp models find`. Once the initial refresh settles,
 * re-resolve the scope and, when the set changed, push the fuller list into the
 * session so the scoped picker and Ctrl+P cycle include it. A scope that resolved
 * to zero models may become active here when the startup discovery pass returned
 * no models but the background pass succeeded. Fire-and-forget — never blocks the
 * prompt on background discovery latency. Issue #9220.
 */
export declare function rebuildScopedModelsAfterDiscovery(session: ScopedModelSink, parsed: Args, modelRegistry: Pick<ModelRegistry, "getAvailable" | "awaitBackgroundRefresh">, activeSettings: Settings): Promise<void>;
export declare function normalizeContinueSessionArgs(parsed: Args, rawArgs?: readonly string[]): void;
/** Resolves CLI session flags into an existing, forked, in-memory, or cancelled session manager. */
export declare function createSessionManager(parsed: Args, cwd: string, activeSettings?: Settings, askToMoveSession?: SessionPrompt): Promise<SessionManager | undefined>;
/** Apply resolved CLI/discovered prompt files without bypassing system prompt templates. */
export declare function applyResolvedSystemPromptInputs(options: CreateAgentSessionOptions, resolvedSystemPrompt: string | undefined, resolvedAppendPrompt: string | undefined): void;
/** Builds startup session options from parsed CLI flags, scoped models, and resolved session lineage. */
export declare function buildSessionOptions(parsed: Args, scopedModels: ScopedModel[], sessionManager: SessionManager | undefined, modelRegistry: ModelRegistry, activeSettings: Settings): Promise<CreateAgentSessionOptions>;
interface RunRootCommandDependencies {
    createAgentSession?: typeof createAgentSession;
    discoverAuthStorage?: typeof discoverAuthStorage;
    selectSession?: typeof selectSession;
    runAcpMode?: RunAcpMode;
    createForeignSessionStore?: (source: ForeignSessionSource) => ForeignSessionStore;
    settings?: Settings;
    forceSetupWizard?: boolean;
}
export declare function runRootCommand(parsed: Args, rawArgs: string[], deps?: RunRootCommandDependencies): Promise<void>;
export declare function main(args: string[]): Promise<void>;
export {};
