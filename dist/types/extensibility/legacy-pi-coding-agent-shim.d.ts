/**
 * Compatibility shim for legacy extensions importing the package root of
 * `@oh-my-pi/pi-coding-agent` (or one of its aliased scopes like
 * `@earendil-works/pi-coding-agent` or `@mariozechner/pi-coding-agent`).
 *
 * The coding-agent package's own barrel (`./src/index.ts`) cannot be listed
 * as a `bun --compile` extra entrypoint alongside the CLI entry without
 * silently breaking the main binary's startup (see issue #1474 follow-up).
 * Routing legacy plugin imports through this sibling shim sidesteps that
 * conflict: bun bundles a distinct entry whose path differs from the CLI
 * entry, while still re-exporting the canonical surface so plugins observe
 * the same module identity as a direct `@oh-my-pi/pi-coding-agent` import.
 */
import { type AgentMessage, type MessageCountOptions, Tokenizer } from "@oh-my-pi/pi-agent-core";
import { type AuthCredential, type TSchema } from "@oh-my-pi/pi-ai";
import { type Keybinding } from "@oh-my-pi/pi-tui";
import type { PromptTemplate } from "../config/prompt-templates.js";
import { Settings } from "../config/settings.js";
import type { CreateAgentSessionOptions, CreateAgentSessionResult, LoadExtensionsResult } from "../sdk.js";
import { EventBus } from "../utils/event-bus.js";
import { ExtensionRuntime } from "./extensions/loader.js";
import type { BashToolResultEvent, EditToolResultEvent, ExtensionFactory, GrepToolResultEvent, ReadToolResultEvent, ToolDefinition, ToolResultEvent, WriteToolResultEvent } from "./extensions/types.js";
import type { Skill } from "./skills.js";
export interface BashSpawnContext {
    command: string;
    cwd: string;
    env: NodeJS.ProcessEnv;
}
export type BashSpawnHook = (context: BashSpawnContext) => BashSpawnContext;
export interface BashOperations {
    exec: (command: string, cwd: string, options: {
        onData: (data: Buffer) => void;
        signal?: AbortSignal;
        timeout?: number;
        env?: NodeJS.ProcessEnv;
    }) => Promise<{
        exitCode: number | null;
    }>;
}
export interface BashToolOptions {
    operations?: BashOperations;
    commandPrefix?: string;
    spawnHook?: BashSpawnHook;
}
export interface ReadToolOptions {
    /** Auto-resize large images; maps onto the `images.autoResize` setting. Default: true. */
    autoResizeImages?: boolean;
}
export interface GrepToolOptions {
    /**
     * Unsupported. The historical grep operations seam (isDirectory/readFile for
     * context lines) never delegated the search itself — ripgrep always ran
     * locally — and the built-in native grep tool exposes no filesystem seam at
     * all. Supplying operations throws at tool creation instead of silently
     * searching the local filesystem.
     */
    operations?: unknown;
}
export interface FindOperations {
    exists: (absolutePath: string) => Promise<boolean> | boolean;
    glob: (pattern: string, cwd: string, options: {
        ignore: string[];
        limit: number;
    }) => Promise<string[]> | string[];
}
export interface FindToolOptions {
    operations?: FindOperations;
}
export interface LsOperations {
    exists: (absolutePath: string) => Promise<boolean> | boolean;
    stat: (absolutePath: string) => Promise<{
        isDirectory(): boolean;
    }> | {
        isDirectory(): boolean;
    };
    readdir: (absolutePath: string) => Promise<string[]> | string[];
}
export interface LsToolOptions {
    operations?: LsOperations;
}
export interface EditOperations {
    readFile: (absolutePath: string) => Promise<Buffer>;
    writeFile: (absolutePath: string, content: string) => Promise<void>;
    access: (absolutePath: string) => Promise<void>;
}
export interface EditToolOptions {
    operations?: EditOperations;
}
export interface WriteOperations {
    writeFile: (absolutePath: string, content: string) => Promise<void>;
    mkdir: (dir: string) => Promise<void>;
}
export interface WriteToolOptions {
    operations?: WriteOperations;
}
/**
 * Convert an image attachment to PNG using the legacy package-root contract.
 *
 * Invalid or unsupported image data returns `null`, matching Pi's historical
 * helper instead of surfacing Bun's decoder error to extensions.
 */
export declare function convertToPng(base64Data: string, mimeType: string): Promise<{
    data: string;
    mimeType: string;
} | null>;
/** Format the active shortcut for legacy extensions that render keybinding hints. */
export declare function keyText(action: Keybinding): string;
/** Parse frontmatter using the historical Pi package-root helper. */
export interface ParsedFrontmatter<T extends Record<string, unknown> = Record<string, unknown>> {
    frontmatter: T;
    body: string;
}
/** Parse YAML frontmatter and throw on invalid metadata. */
export declare function parseFrontmatter<T extends Record<string, unknown> = Record<string, unknown>>(content: string): ParsedFrontmatter<T>;
/** Return content without YAML frontmatter. */
export declare function stripFrontmatter(content: string): string;
/** Mark an extension-authored tool as a Pi-compatible tool definition. */
export declare function defineTool<TParams extends TSchema = TSchema, TDetails = unknown>(tool: ToolDefinition<TParams, TDetails>): ToolDefinition<TParams, TDetails>;
/** Create the legacy read tool definition. */
export declare function createReadToolDefinition(cwd: string, options?: ReadToolOptions): ToolDefinition;
/** Create the legacy read tool. */
export declare function createReadTool(cwd: string, options?: ReadToolOptions): ToolDefinition;
/** Create the legacy bash tool definition. */
export declare function createBashToolDefinition(cwd: string, options?: BashToolOptions): ToolDefinition;
/** Create the legacy bash tool. */
export declare function createBashTool(cwd: string, options?: BashToolOptions): ToolDefinition;
/** Create the legacy grep tool definition. */
export declare function createGrepToolDefinition(cwd: string, options?: GrepToolOptions): ToolDefinition;
/** Create the legacy grep tool. */
export declare function createGrepTool(cwd: string, options?: GrepToolOptions): ToolDefinition;
/** Create the legacy find tool definition. */
export declare function createFindToolDefinition(cwd: string, options?: FindToolOptions): ToolDefinition;
/** Create the legacy find tool. */
export declare function createFindTool(cwd: string, options?: FindToolOptions): ToolDefinition;
/** Create the legacy ls tool definition. */
export declare function createLsToolDefinition(cwd: string, options?: LsToolOptions): ToolDefinition;
/** Create the legacy ls tool. */
export declare function createLsTool(cwd: string, options?: LsToolOptions): ToolDefinition;
/** Create the legacy edit tool definition. */
export declare function createEditToolDefinition(cwd: string, options?: EditToolOptions): ToolDefinition;
/** Create the legacy edit tool. */
export declare function createEditTool(cwd: string, options?: EditToolOptions): ToolDefinition;
/** Create the legacy write tool definition. */
export declare function createWriteToolDefinition(cwd: string, options?: WriteToolOptions): ToolDefinition;
/** Create the legacy write tool. */
export declare function createWriteTool(cwd: string, options?: WriteToolOptions): ToolDefinition;
/** Create legacy read, bash, edit, and write tools. */
export declare function createCodingTools(cwd: string): ToolDefinition[];
/** Create legacy read, grep, find, and ls tools. */
export declare function createReadOnlyTools(cwd: string): ToolDefinition[];
export declare const SettingsManager: {
    readonly create: (cwd: string, agentDir?: string) => Promise<Settings>;
    readonly inMemory: () => Settings;
};
/** Scope used by the legacy package manager for discovered resources. */
export type SourceScope = "user" | "project" | "temporary";
/** Discovery metadata exposed alongside a legacy package resource path. */
export interface PathMetadata {
    source: string;
    scope: SourceScope;
    origin: "package" | "top-level";
    baseDir?: string;
}
/** One extension, skill, prompt, or theme resolved by the legacy package manager. */
export interface ResolvedResource {
    path: string;
    enabled: boolean;
    metadata: PathMetadata;
}
/** Resource groups returned by {@link DefaultPackageManager.resolve}. */
export interface ResolvedPaths {
    extensions: ResolvedResource[];
    skills: ResolvedResource[];
    prompts: ResolvedResource[];
    themes: ResolvedResource[];
}
/** Action a legacy caller requests when a configured package is unavailable. */
export type MissingSourceAction = "install" | "skip" | "error";
/** Construction inputs accepted by the legacy package manager. */
export interface DefaultPackageManagerOptions {
    cwd: string;
    agentDir: string;
    settingsManager: Settings | Promise<Settings>;
}
/**
 * Enumerates the extensions OMP would load through the historical package
 * manager surface used by legacy extensions.
 */
export declare class DefaultPackageManager {
    #private;
    constructor(options: DefaultPackageManagerOptions);
    /** Resolve enabled extension paths with their OMP plugin provenance. */
    resolve(_onMissing?: (source: string) => Promise<MissingSourceAction>): Promise<ResolvedPaths>;
}
/**
 * Resource-loader compatibility layer for legacy pi extensions.
 *
 * Upstream `@earendil-works/pi-coding-agent` centralizes extension / skill /
 * prompt / theme / AGENTS.md discovery inside a `DefaultResourceLoader`
 * instance that the caller constructs, `reload()`s, and hands to
 * `createAgentSession({ resourceLoader })`. Every published version of
 * pi-schedule-prompt (≥0.2.0) and other pi extensions that spawn subagents
 * import the class at module scope; a missing export takes the whole
 * extension down at parse time (issue #4567).
 *
 * OMP does the same discovery inline inside `createAgentSession()`, so this
 * shim intentionally does NOT re-implement pi's ResourceLoader plumbing.
 * Instead the loader captures the caller's intent (`no*` flags, `*Override`
 * callbacks, `additional*Paths`, `extensionFactories`, `settingsManager`,
 * `eventBus`) plus the discovery results, and the sibling `createAgentSession`
 * override below translates them into OMP's native session options
 * (`disableExtensionDiscovery`, `preloadedExtensionPaths`, `extensions`,
 * `skills`, `promptTemplates`, `contextFiles`, `settings`, `eventBus`,
 * `systemPrompt`) before delegating to `../sdk`.
 *
 * The pi surface it emulates is the intersection actually used by real
 * extensions in the wild — themes are silently dropped (OMP has no
 * session-level themes surface); `extendResources`, `loadProjectTrustExtensions`,
 * and provider-trust hooks are omitted.
 */
export type ResourceDiagnostic = {
    type: "error" | "warning" | "info";
    message: string;
    path?: string;
};
export interface AgentsFile {
    path: string;
    content: string;
}
/** Marker interface preserved for pi extensions that type against upstream. */
export interface Theme {
    name: string;
}
export interface DefaultResourceLoaderOptions {
    cwd?: string;
    agentDir?: string;
    settingsManager?: Settings | Promise<Settings>;
    eventBus?: EventBus;
    additionalExtensionPaths?: string[];
    additionalSkillPaths?: string[];
    additionalPromptTemplatePaths?: string[];
    additionalThemePaths?: string[];
    extensionFactories?: ExtensionFactory[];
    noExtensions?: boolean;
    noSkills?: boolean;
    noPromptTemplates?: boolean;
    noThemes?: boolean;
    noContextFiles?: boolean;
    systemPrompt?: string;
    appendSystemPrompt?: string | string[];
    extensionsOverride?: (base: LoadExtensionsResult) => LoadExtensionsResult;
    skillsOverride?: (base: {
        skills: Skill[];
        diagnostics: ResourceDiagnostic[];
    }) => {
        skills: Skill[];
        diagnostics: ResourceDiagnostic[];
    };
    promptsOverride?: (base: {
        prompts: PromptTemplate[];
        diagnostics: ResourceDiagnostic[];
    }) => {
        prompts: PromptTemplate[];
        diagnostics: ResourceDiagnostic[];
    };
    themesOverride?: (base: {
        themes: Theme[];
        diagnostics: ResourceDiagnostic[];
    }) => {
        themes: Theme[];
        diagnostics: ResourceDiagnostic[];
    };
    agentsFilesOverride?: (base: {
        agentsFiles: AgentsFile[];
    }) => {
        agentsFiles: AgentsFile[];
    };
    systemPromptOverride?: (base: string | undefined) => string | undefined;
    appendSystemPromptOverride?: (base: string[]) => string[];
}
/**
 * The subset of {@link DefaultResourceLoader} state consumed by the
 * {@link createAgentSession} adapter. Kept as an explicit interface so tests
 * (and any future third-party ResourceLoader passed to `createAgentSession`)
 * only need to satisfy the read surface — not the reload lifecycle.
 */
export interface ResourceLoader {
    getExtensions(): LoadExtensionsResult;
    getSkills(): {
        skills: Skill[];
        diagnostics: ResourceDiagnostic[];
    };
    getPrompts(): {
        prompts: PromptTemplate[];
        diagnostics: ResourceDiagnostic[];
    };
    getThemes(): {
        themes: Theme[];
        diagnostics: ResourceDiagnostic[];
    };
    getAgentsFiles(): {
        agentsFiles: AgentsFile[];
    };
    getSystemPrompt(): string | undefined;
    getAppendSystemPrompt(): string[];
    reload(): Promise<void>;
    /** @internal — used by the shim's createAgentSession to detect its own loaders. */
    readonly __ompLegacyPiLoader?: true;
}
/** Create a pre-initialization runtime for legacy extension resource loaders. */
export declare function createExtensionRuntime(): ExtensionRuntime;
export declare class DefaultResourceLoader implements ResourceLoader {
    #private;
    readonly __ompLegacyPiLoader: true;
    constructor(options?: DefaultResourceLoaderOptions);
    getExtensions(): LoadExtensionsResult;
    getSkills(): {
        skills: Skill[];
        diagnostics: ResourceDiagnostic[];
    };
    getPrompts(): {
        prompts: PromptTemplate[];
        diagnostics: ResourceDiagnostic[];
    };
    getThemes(): {
        themes: Theme[];
        diagnostics: ResourceDiagnostic[];
    };
    getAgentsFiles(): {
        agentsFiles: AgentsFile[];
    };
    getSystemPrompt(): string | undefined;
    getAppendSystemPrompt(): string[];
    /**
     * Discovery snapshot used to seed the session. Emulates upstream pi's
     * `reload()` lifecycle: run every enabled discovery arm against the
     * resolved cwd/agentDir, then thread each result through the caller's
     * `*Override` callback. Discovery arms guarded by an `no*` flag start from
     * an empty base — callers that flipped the flag off still get the override
     * hook, so overrides can inject synthetic entries without triggering a
     * filesystem scan they explicitly opted out of.
     */
    reload(): Promise<void>;
    /** Test seam: whether `reload()` has completed at least once. */
    get loaded(): boolean;
    /** @internal — used by the shim's createAgentSession to translate options. */
    __getResolverState(): {
        cwd: string;
        agentDir: string;
        settingsPromise?: Promise<Settings>;
        eventBus: EventBus;
        extensionsResult: LoadExtensionsResult;
        skills: Skill[];
        prompts: PromptTemplate[];
        agentsFiles: AgentsFile[];
        systemPrompt: string | undefined;
        appendSystemPrompt: string[];
        extensionFactories: ExtensionFactory[];
    };
}
/**
 * Legacy pi extensions call `createAgentSession({ resourceLoader })`. OMP's
 * native option surface has no such field — extension / skill / prompt /
 * context-file discovery are configured directly on the session options — so
 * an untranslated call would silently ignore the loader (including its
 * `noExtensions`/`noSkills` opt-outs), re-run OMP's own discovery, and
 * happily re-load the calling extension into the subagent. That's exactly
 * the recursion the caller passed the loader to prevent.
 *
 * Translate the loader's captured state into OMP's option fields, then
 * delegate to the underlying SDK. Explicit fields on `options` override the
 * loader (matches upstream pi semantics — a caller can partially override a
 * shared loader).
 *
 * `resourceLoader` is not part of {@link CreateAgentSessionOptions}, so it's
 * accepted through a widened alias and stripped before the underlying call.
 */
export type LegacyPiCreateAgentSessionOptions = CreateAgentSessionOptions & {
    resourceLoader?: ResourceLoader;
};
export declare function createAgentSession(options?: LegacyPiCreateAgentSessionOptions): Promise<CreateAgentSessionResult>;
/**
 * Synchronous auth storage surface retained for legacy extensions.
 *
 * Modern OMP auth storage is asynchronous, while older provider extensions
 * call `AuthStorage.create().get()` during module initialization.
 */
export declare class AuthStorage {
    constructor();
    static create(): AuthStorage;
    get(provider: string): AuthCredential | undefined;
    set(provider: string, credential: AuthCredential): void;
}
/** Read the first active credential for a legacy extension provider. */
export declare function readStoredCredential(provider: string): AuthCredential | undefined;
export { getProjectDir } from "@oh-my-pi/pi-utils";
/**
 * Coding-agent package install directory, matching pi's string-valued
 * `getPackageDir()` contract (extensions do `path.join(getPackageDir(), ...)`
 * to auto-allow bundled docs/resources).
 *
 * omp's canonical `getPackageDir()` (`../config`) returns `undefined` inside a
 * `bun --compile` binary — `import.meta.dir` is `/$bunfs/root` and no owning
 * `package.json` exists (issue #1423). Returning `undefined` there would crash
 * every legacy `path.join(getPackageDir(), ...)` at runtime in the shipped
 * binary, the primary distribution. So fall back to the executable's own
 * directory in compiled mode, where the binary *is* the install root. The
 * `PI_PACKAGE_DIR` override and dev/source/npm-dist walk-up still win via the
 * canonical helper.
 */
export declare function getPackageDir(): string;
export { compact, serializeConversation } from "@oh-my-pi/pi-agent-core/compaction";
/**
 * Legacy `estimateTokens(message, tokenizer?, options?)` export. The core API
 * became `Tokenizer.countMessage`, but legacy pi extensions still import this
 * free function by name (issues #6583, #7174, #7403), so the export surface
 * must survive; a shared model-agnostic Tokenizer backs the tokenizer-less
 * legacy call shape.
 */
export declare function estimateTokens(message: AgentMessage, tokenizer?: Tokenizer, options?: MessageCountOptions): number;
export { CONFIG_DIR_NAME } from "@oh-my-pi/pi-utils";
export { parseArgs } from "../cli/args.js";
export * from "../index.js";
export { formatBytes as formatSize } from "../tools/render-utils.js";
export { copyToClipboard } from "../utils/clipboard.js";
export { Type } from "./legacy-typebox.js";
/** Narrow a `tool_result` event to the `bash` tool. */
export declare function isBashToolResult(e: ToolResultEvent): e is BashToolResultEvent;
/** Narrow a `tool_result` event to the `read` tool. */
export declare function isReadToolResult(e: ToolResultEvent): e is ReadToolResultEvent;
/** Narrow a `tool_result` event to the `edit` tool. */
export declare function isEditToolResult(e: ToolResultEvent): e is EditToolResultEvent;
/** Narrow a `tool_result` event to the `write` tool. */
export declare function isWriteToolResult(e: ToolResultEvent): e is WriteToolResultEvent;
/** Narrow a `tool_result` event to the `grep` tool. */
export declare function isGrepToolResult(e: ToolResultEvent): e is GrepToolResultEvent;
/** Legacy `find` result event represented by omp's custom-event branch. */
export type FindToolResultEvent = ToolResultEvent & {
    toolName: "find";
};
/** Narrow a `tool_result` event to the legacy `find` tool. */
export declare function isFindToolResult(e: ToolResultEvent): e is FindToolResultEvent;
/** Legacy `ls` result event represented by omp's custom-event branch. */
export type LsToolResultEvent = ToolResultEvent & {
    toolName: "ls";
};
/** Narrow a `tool_result` event to the legacy `ls` tool. */
export declare function isLsToolResult(e: ToolResultEvent): e is LsToolResultEvent;
