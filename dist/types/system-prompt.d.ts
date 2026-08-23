/**
 * System prompt construction and project context loading
 */
import type { AgentTool } from "@oh-my-pi/pi-agent-core";
import type { ToolExample, TSchema } from "@oh-my-pi/pi-ai";
import type { Personality, SkillsSettings } from "./config/settings.js";
import { type Skill } from "./extensibility/skills.js";
import { type ActiveRepoContext } from "./utils/active-repo-context.js";
import { type WorkspaceTree } from "./workspace-tree.js";
interface AlwaysApplyRule {
    name: string;
    content: string;
    path: string;
}
/** Discover TITLE_SYSTEM.md file for automatic session-title prompt overrides */
export declare function discoverTitleSystemPromptFile(cwd?: string): string | undefined;
/** Resolve input as file path or literal string */
export declare function resolvePromptInput(input: string | undefined, description: string): Promise<string | undefined>;
export interface LoadContextFilesOptions {
    /** Working directory to start walking up from. Default: getProjectDir() */
    cwd?: string;
    /** Disabled extension IDs to honor instead of the process-global settings. */
    disabledExtensions?: string[];
}
/**
 * Deduplicate context files by paragraph containment.
 *
 * Files are sorted by depth descending (farther from cwd first) so that a
 * file is omitted only when a more-authoritative (closer-to-cwd) file
 * contains its entire normalized paragraph sequence as a contiguous run.
 * This makes the function self-contained — it does not rely on callers
 * pre-sorting the array, which matters because some callers concatenate
 * independently sorted workspace roots where array position does not reflect
 * authority. Files whose paragraphs are merely paraphrased or interleaved are
 * kept — containment is exact after normalization, not fuzzy.
 *
 * @internal Exported for testing.
 */
export declare function dedupeContainedContextFiles(contextFiles: Array<{
    path: string;
    content: string;
    depth?: number;
}>): Array<{
    path: string;
    content: string;
    depth?: number;
}>;
/**
 * Load all project context files using the capability API.
 * Returns {path, content, depth} entries for all discovered context files.
 * Files are sorted by depth (descending) so files closer to cwd appear last/more prominent.
 */
export declare function loadProjectContextFiles(options?: LoadContextFilesOptions): Promise<Array<{
    path: string;
    content: string;
    depth?: number;
}>>;
/**
 * Load the effective system prompt customization from SYSTEM.md.
 * Project-level SYSTEM.md overrides user-level SYSTEM.md.
 */
export declare function loadSystemPromptFiles(options?: LoadContextFilesOptions): Promise<string | null>;
export declare const DEFAULT_SYSTEM_PROMPT_TOOL_NAMES: readonly ["read", "bash", "edit", "write"];
export interface SystemPromptToolMetadata {
    label: string;
    description: string;
    /** Tool name the model sees on the provider wire. Defaults to the internal tool name. */
    wireName?: string;
    /** Tool parameters schema (Zod or JSON Schema), fed to the verbose inventory renderer. */
    parameters?: TSchema;
    /** Illustrative examples rendered into the verbose inventory. */
    examples?: readonly ToolExample[];
}
export type SystemPromptToolMetadataProjection = {
    mode: "compact";
    toolNames: readonly string[];
    overrides?: Partial<Record<string, Partial<SystemPromptToolMetadata>>>;
} | {
    mode: "full";
    overrides?: Partial<Record<string, Partial<SystemPromptToolMetadata>>>;
};
export declare function buildSystemPromptToolMetadata(tools: Map<string, AgentTool>, overrides?: Partial<Record<string, Partial<SystemPromptToolMetadata>>>): Map<string, SystemPromptToolMetadata>;
/** Builds a mode-specific metadata snapshot for internal prompt assembly. */
export declare function projectSystemPromptToolMetadata(tools: Map<string, AgentTool>, projection: SystemPromptToolMetadataProjection): Map<string, SystemPromptToolMetadata>;
export interface BuildSystemPromptOptions {
    /** Custom system prompt (replaces default). */
    customPrompt?: string;
    /** Already-loaded custom system prompt text; bypasses path resolution. */
    resolvedCustomPrompt?: string;
    /** Tools to include in prompt. */
    tools?: Map<string, SystemPromptToolMetadata>;
    /** Tool names to include in prompt. */
    toolNames?: string[];
    /**
     * Names actually exposed as provider-callable tools. Defaults to `toolNames`.
     * Code Mode passes its direct keep-set so the rendered tool inventory matches
     * the wire surface while capability and safety gates still see every
     * bridge-reachable tool in `toolNames`.
     */
    directToolNames?: readonly string[];
    /** Text to append to system prompt. */
    appendSystemPrompt?: string;
    /** Already-loaded append prompt text; bypasses path resolution. */
    resolvedAppendSystemPrompt?: string;
    /** Inline full tool descriptors in the system prompt. Default: false */
    inlineToolDescriptors?: boolean;
    /**
     * Whether provider-native tool calling is active (no owned/in-band syntax).
     * When true and `inlineToolDescriptors` is false, the inventory renders as a
     * compact tool-name list; otherwise it renders the full Harmony-style
     * `namespace functions { … }` catalog. Default: true
     */
    nativeTools?: boolean;
    /** Skills settings for discovery. */
    skillsSettings?: SkillsSettings;
    /** Working directory. Default: getProjectDir() */
    cwd?: string;
    /** Additional workspace directories beyond cwd (multi-root), absolute. Injected into the project prompt. */
    additionalWorkspaceRoots?: string[];
    /** Pre-loaded context files (skips discovery if provided). */
    contextFiles?: Array<{
        path: string;
        content: string;
        depth?: number;
    }>;
    /** Skills provided directly to system prompt construction. */
    skills?: readonly Skill[];
    /** Pre-loaded rulebook rules (descriptions, excluding TTSR and always-apply). */
    rules?: Array<{
        name: string;
        description?: string;
        path: string;
        globs?: string[];
    }>;
    /** Intent field name injected into every tool schema. If set, explains the field in the prompt. */
    intentField?: string;
    /** Encourage the agent to delegate via tasks unless changes are trivial. */
    eagerTasks?: boolean;
    /** When true, the Eager Tasks section uses the hard MUST/ONLY wording (`task.eager: always`) rather than the softer `preferred` nudge. */
    eagerTasksAlways?: boolean;
    /** Whether `task.batch` is enabled; selects the centralized delegation guidance's call shape. */
    taskBatch?: boolean;
    /** Effective task concurrency limit displayed in centralized delegation guidance. Zero means unlimited. */
    taskMaxConcurrency?: number;
    /** Whether IRC-backed parallel coordination can be included in delegation policy. */
    taskIrcEnabled?: boolean;
    /** Whether the read-only `scout` subagent is spawnable (not disabled, allowed by spawn policy). Defaults to true. */
    scoutAvailable?: boolean;
    /** Rules with alwaysApply=true — their full content is injected into the prompt. */
    alwaysApplyRules?: AlwaysApplyRule[];
    /** Whether secret obfuscation is active. When true, explains the redaction format in the prompt. */
    secretsEnabled?: boolean;
    /** Pre-loaded workspace tree (skips discovery if provided). May be a Promise to allow early kick-off. */
    workspaceTree?: WorkspaceTree | Promise<WorkspaceTree>;
    /** Whether the local memory://root summary is active. */
    memoryRootEnabled?: boolean;
    /** Whether the read-only security:// resource namespace is active. */
    securityEnabled?: boolean;
    /** Active model identifier (e.g. "anthropic/claude-opus-4") used by prompt policy and optionally surfaced. */
    model?: string;
    /** Whether to surface `model` in the workstation block. Model-specific prompt policy still uses it. Default: true. */
    includeModelInPrompt?: boolean;
    /** Personality preset rendered into the default system prompt. "none" omits the block. Default: "default" */
    personality?: Personality;
    /** Whether to include the workspace directory tree in the system prompt. Default: false */
    includeWorkspaceTree?: boolean;
    /** Whether Mermaid fenced blocks render as terminal ASCII diagrams. Default: true */
    renderMermaid?: boolean;
    /** Pre-resolved nested active repo context. Undefined resolves from cwd. */
    activeRepoContext?: ActiveRepoContext | null;
    /** Tools mounted under `xd://`; renders the protocol section when non-empty. `dynamic` marks external devices whose summary is third-party metadata. */
    xdevTools?: Array<{
        name: string;
        summary: string;
        dynamic?: boolean;
    }>;
    /** Full docs + JSON schema for every `xd://`-mounted tool, inlined into the protocol section so no discovery `read` is needed. */
    xdevDocs?: string;
    /** Whether Auto-QA grievance reporting is enabled; renders the `xd://report_issue` note. */
    autoQaEnabled?: boolean;
}
/** Result of building provider-facing system prompt messages. */
export interface BuildSystemPromptResult {
    /** Ordered system prompt blocks. Providers should preserve entries as distinct messages/blocks. */
    systemPrompt: string[];
    /**
     * Names of `xd://` devices whose catalog/protocol section this prompt renders.
     * Empty/undefined when no catalog was emitted (no mounted devices, or a custom
     * prompt template that omits the section). Lets the session fold these devices
     * into its announced-mount baseline so a same-turn mount notice does not re-list
     * a catalog the prompt already carries (issue #7139).
     */
    xdevCatalogNames?: readonly string[];
}
/** Build the system prompt with tools, guidelines, and context */
export declare function buildSystemPrompt(options?: BuildSystemPromptOptions): Promise<BuildSystemPromptResult>;
export {};
