import type { ExtensionModule } from "../capability/extension-module.js";
import { type Rule } from "../capability/rule.js";
import type { Skill } from "../capability/skill.js";
import type { LoadContext, LoadResult, SourceMeta } from "../capability/types.js";
import type { MCPRequestIdFormat } from "../mcp/types.js";
import { type ConfiguredThinkingLevel } from "../thinking.js";
/**
 * Standard paths for each config source.
 */
export declare const SOURCE_PATHS: {
    readonly native: {
        readonly userBase: string;
        readonly userAgent: string;
        readonly projectDir: string;
    };
    readonly claude: {
        readonly userBase: ".claude";
        readonly userAgent: ".claude";
        readonly projectDir: ".claude";
    };
    readonly codex: {
        readonly userBase: ".codex";
        readonly userAgent: ".codex";
        readonly projectDir: ".codex";
    };
    readonly gemini: {
        readonly userBase: ".gemini";
        readonly userAgent: ".gemini";
        readonly projectDir: ".gemini";
    };
    readonly opencode: {
        readonly userBase: ".config/opencode";
        readonly userAgent: ".config/opencode";
        readonly projectDir: ".opencode";
    };
    readonly cursor: {
        readonly userBase: ".cursor";
        readonly userAgent: ".cursor";
        readonly projectDir: ".cursor";
    };
    readonly windsurf: {
        readonly userBase: ".codeium/windsurf";
        readonly userAgent: ".codeium/windsurf";
        readonly projectDir: ".windsurf";
    };
    readonly cline: {
        readonly userBase: ".cline";
        readonly userAgent: ".cline";
        readonly projectDir: null;
    };
    readonly github: {
        readonly userBase: null;
        readonly userAgent: null;
        readonly projectDir: ".github";
    };
    readonly vscode: {
        readonly userBase: ".vscode";
        readonly userAgent: ".vscode";
        readonly projectDir: ".vscode";
    };
};
export type SourceId = keyof typeof SOURCE_PATHS;
/**
 * Get user-level path for a source.
 */
export declare function getUserPath(ctx: LoadContext, source: SourceId, subpath: string): string | null;
/**
 * Get project-level path for a source (cwd only).
 */
export declare function getProjectPath(ctx: LoadContext, source: SourceId, subpath: string): string | null;
/**
 * Resolve GitHub Copilot CLI's user-global config root. Copilot stores per-user
 * instructions/prompts/agents/MCP under `~/.copilot`, relocatable via the
 * `COPILOT_HOME` env var (mirrors Copilot CLI's `--config-dir`). Falls back to
 * `<home>/.copilot` when the override is unset.
 */
export declare function resolveCopilotHome(home: string): string;
/**
 * Create source metadata for an item.
 */
export declare function createSourceMeta(provider: string, filePath: string, level: "user" | "project"): SourceMeta;
export declare function parseBoolean(value: unknown): boolean | undefined;
/**
 * Parse an MCP `requestIdFormat` value. Unrecognized values are dropped so a typo
 * degrades to the default integer ids rather than reaching a transport.
 */
export declare function parseRequestIdFormat(value: unknown): MCPRequestIdFormat | undefined;
/**
 * Parse a comma-separated string into an array of trimmed, non-empty strings.
 */
export declare function parseCSV(value: string): string[];
/**
 * Parse a value that may be an array of strings or a comma-separated string.
 * Returns undefined if the result would be empty.
 */
export declare function parseArrayOrCSV(value: unknown): string[] | undefined;
/**
 * Build a canonical rule item from a markdown/markdown-frontmatter document.
 */
export declare function buildRuleFromMarkdown(name: string, content: string, filePath: string, source: SourceMeta, options?: {
    ruleName?: string;
    stripNamePattern?: RegExp;
}): Rule;
/**
 * Parse model field into a prioritized list.
 */
export declare function parseModelList(value: unknown): string[] | undefined;
/** Parsed agent fields from frontmatter (excludes source/filePath/systemPrompt) */
export interface ParsedAgentFields {
    name: string;
    description: string;
    tools?: string[];
    spawns?: string[] | "*";
    model?: string[];
    output?: unknown;
    thinkingLevel?: ConfiguredThinkingLevel;
    autoloadSkills?: string[];
    readSummarize?: boolean;
    blocking?: boolean;
    /** `true` = prewalk into the default target; string = prewalk into that model pattern. */
    prewalk?: boolean | string;
    /** `true` = advise with the default advisor-role model; string = advise with that model pattern. */
    advisor?: boolean | string;
}
/**
 * Parse agent fields from frontmatter.
 * Returns null if required fields (name, description) are missing.
 */
export declare function parseAgentFields(frontmatter: Record<string, unknown>): ParsedAgentFields | null;
export interface ScanSkillsFromDirOptions {
    dir: string;
    providerId: string;
    level: "user" | "project";
    requireDescription?: boolean;
    /**
     * When true, treat a `SKILL.md` sitting directly under `dir` as a single skill in addition to
     * scanning `<dir>/<name>/SKILL.md` children. Matches the Claude plugin manifest convention
     * that lets a skill path point at a directory containing `SKILL.md` directly (e.g.
     * `"skills": ["./"]`), where the frontmatter `name` determines the invocation name and the
     * directory basename is the fallback. Default `false` preserves the strict child-scan
     * semantic every non-Claude provider relies on.
     */
    includeSelf?: boolean;
}
export declare function compareSkillOrder(aName: string, aPath: string, bName: string, bPath: string): number;
export declare function scanSkillsFromDir(_ctx: LoadContext, options: ScanSkillsFromDirOptions): Promise<LoadResult<Skill>>;
/**
 * Recursively expand environment variables in an object.
 */
export declare function expandEnvVarsDeep<T>(obj: T, extraEnv?: Record<string, string>): T;
/**
 * Load files from a directory matching extensions.
 * Uses native glob for fast filesystem scanning with gitignore support.
 */
export declare function loadFilesFromDir<T>(_ctx: LoadContext, dir: string, provider: string, level: "user" | "project", options: {
    /** File extensions to match (without dot) */
    extensions?: string[];
    /** Transform file to item (return null to skip) */
    transform: (name: string, content: string, path: string, source: SourceMeta) => T | null;
    /** Whether to recurse into subdirectories (default: false) */
    recursive?: boolean;
}): Promise<LoadResult<T>>;
/**
 * Calculate depth of target directory relative to current working directory.
 * Depth is the number of directory levels from cwd to target.
 * - Positive depth: target is above cwd (parent/ancestor)
 * - Zero depth: target is cwd
 * - This uses path splitting to count directory levels
 */
export declare function calculateDepth(cwd: string, targetDir: string, separator: string): number;
/**
 * Discover extension module entry points in a directory.
 *
 * Discovery rules:
 * 1. Direct files: `extensions/*.ts` or `*.js` → load
 * 2. Subdirectory with index: `extensions/<ext>/index.ts` or `index.js` → load
 * 3. Subdirectory with package.json: `extensions/<ext>/package.json` with "omp"/"pi" field → load declared paths
 *
 * No recursion beyond one level. Complex packages must use package.json manifest.
 * Uses native glob for fast filesystem scanning with gitignore support.
 */
export declare function discoverExtensionModulePaths(_ctx: LoadContext, dir: string): Promise<string[]>;
/**
 * Derive a stable extension name from a path.
 */
export declare function getExtensionNameFromPath(extensionPath: string): string;
/**
 * Build ExtensionModule items from discovered user/project paths.
 * Shared across providers that expose extension modules via user + project dirs.
 */
export declare function buildExtensionModuleItems(providerId: string, userPaths: string[], projectPaths: string[]): ExtensionModule[];
/**
 * Entry for an installed Claude Code plugin.
 */
export interface ClaudePluginEntry {
    /** Claude registry scope; project and local entries are restricted to their project path. */
    scope?: "user" | "project" | "local";
    installPath: string;
    version: string;
    installedAt: string;
    lastUpdated: string;
    gitCommitSha?: string;
    enabled?: boolean;
    /** Project root recorded by Claude for a project-bound installation. */
    projectPath?: string;
}
/**
 * Claude Code installed_plugins.json registry format.
 */
export interface ClaudePluginsRegistry {
    version: number;
    plugins: Record<string, ClaudePluginEntry[]>;
}
/**
 * Resolved plugin root for loading.
 */
export interface ClaudePluginRoot {
    /** Plugin ID (e.g., "simpleclaude-core@simpleclaude") */
    id: string;
    /** Marketplace name */
    marketplace: string;
    /** Plugin name */
    plugin: string;
    /** Version string */
    version: string;
    /** Absolute path to plugin root */
    path: string;
    /** Whether this is a user or project scope plugin */
    scope: "user" | "project";
}
/**
 * Parse Claude Code installed_plugins.json content.
 */
export declare function parseClaudePluginsRegistry(content: string): ClaudePluginsRegistry | null;
/**
 * Resolve the active project registry path by walking up from `cwd`.
 *
 * Walk order:
 * 1. Walk up from `cwd` looking for the nearest directory containing `.omp/`.
 *    The first match returns `<dir>/.omp/plugins/installed_plugins.json`.
 * 2. If no `.omp/` is found, rescan from `cwd` upward looking for `.git`.
 *    The git root is used as an anchor: `<gitRoot>/.omp/plugins/installed_plugins.json`.
 * 3. If neither is found, return `null` — no project context is active.
 *
 * This is the single source of truth for "active project root" used by install,
 * uninstall, list, upgrade, discovery, and doctor. Deterministic for a given `cwd`.
 */
export declare function resolveActiveProjectRegistryPath(cwd: string): Promise<string | null>;
/**
 * Like resolveActiveProjectRegistryPath, but falls back to `<cwd>/.omp/plugins/installed_plugins.json`
 * when no project anchor (.omp/ or .git/) is found.
 *
 * Use this when the caller accepts an explicit --scope project so that installing into a freshly
 * bootstrapped directory (no .omp/ or .git/ yet) works: writeInstalledPluginsRegistry auto-creates
 * the directory tree on first write.
 *
 * Returns undefined when cwd is os.homedir() — that path is already the user registry and must
 * never alias as the project registry.
 */
export declare function resolveOrDefaultProjectRegistryPath(cwd: string): Promise<string | undefined>;
/** Register a process-global plugin cache invalidator called whenever plugin roots are cleared. */
export declare function registerPluginCacheInvalidator(invalidator: () => void): void;
/**
 * List all installed Claude Code plugin roots from its active plugin cache and
 * ~/.omp/plugins/installed_plugins.json, plus the nearest project registry when present.
 *
 * Results are cached per Claude and OMP config directories, project registry, and canonical active project.
 */
export declare function listClaudePluginRoots(home: string, cwd?: string): Promise<{
    roots: ClaudePluginRoot[];
    warnings: string[];
}>;
/**
 * Clear the plugin roots cache (useful for testing or when plugins change).
 */
export declare function clearClaudePluginRootsCache(): void;
/**
 * Invalidate fs caches for installed-plugin registry files and reset the
 * in-memory plugin roots cache. Used by MarketplaceManager clients after
 * installing/uninstalling/enabling/disabling plugins.
 */
export declare function clearPluginRootsAndCaches(extraPaths?: readonly string[]): void;
/**
 * Populate the module-level plugin roots cache for sync consumers.
 * Call during session initialization, after dir resolution completes
 * but before any LSP config is read.
 */
export declare function preloadPluginRoots(home: string, cwd?: string): Promise<void>;
/**
 * Get pre-loaded plugin roots synchronously.
 * Returns empty array if preloadPluginRoots() hasn't been called.
 */
export declare function getPreloadedPluginRoots(): readonly ClaudePluginRoot[];
/**
 * Inject synthetic plugin roots from --plugin-dir paths.
 * These are prepended to the cache with highest precedence (before OMP/Claude entries).
 * Must be called before any listClaudePluginRoots() access.
 */
export declare function injectPluginDirRoots(home: string, dirs: string[], cwd?: string): Promise<void>;
