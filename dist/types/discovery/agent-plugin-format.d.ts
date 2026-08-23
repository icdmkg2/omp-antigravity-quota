/** Canonical `plugin.json` `$schema` identifier for Agent Plugins 1.0.0 (spec §5.2). */
export declare const AGENT_PLUGIN_MANIFEST_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
/** Canonical `mcp.json` `$schema` identifier for Agent Plugins 1.0.0 (spec §7.2.1). */
export declare const AGENT_PLUGIN_MCP_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json";
/** Validated portable manifest fields from a plugin's root `plugin.json` (spec §5). */
export interface AgentPluginManifest {
    name: string;
    version?: string;
    description?: string;
    author?: {
        name?: string;
        email?: string;
        url?: string;
    };
    homepage?: string;
    repository?: string;
    license?: string;
    keywords?: string[];
    /**
     * Client-owned data keyed by reverse-domain namespace. Member values are
     * opaque: this client implements no namespace, and §8.1/§11.1 require
     * ignoring unimplemented namespaces without validating their values.
     */
    extensions?: Record<string, unknown>;
}
/**
 * Outcome of parsing a candidate `plugin.json`:
 * - `none` — the document does not target Agent Plugins (no recognized `$schema`);
 *   legacy plugin conventions may still apply to the directory.
 * - `valid` — a conformant manifest; `warnings` carries the non-fatal violations
 *   the spec requires reporting (unknown top-level fields, non-object `extensions`).
 * - `invalid` — the document targets Agent Plugins but violates the closed schema
 *   fatally; the plugin must be rejected and none of its components loaded (spec §5.2).
 */
type AgentPluginManifestResult = {
    status: "none";
} | {
    status: "valid";
    manifest: AgentPluginManifest;
    warnings: string[];
} | {
    status: "invalid";
    reason: string;
};
/**
 * Validate `SKILL.md` frontmatter against the Agent Skills specification
 * (https://agentskills.io/specification), the source of truth for skill
 * validity under Agent Plugins §7.1, mirroring the official skills-ref
 * reference validator: the frontmatter schema is CLOSED to its six fields and
 * any unexpected key rejects the skill. Returns the first violation, or `null`
 * when the skill conforms. Frontmatter keys must be raw (unnormalized).
 */
export declare function validateAgentSkillFrontmatter(frontmatter: Record<string, unknown>, dirName: string): string | null;
/**
 * Parse and validate a root `plugin.json` document against the closed
 * Agent Plugins 1.0.0 manifest schema (spec §5.2–§5.5, §8.1).
 */
export declare function parseAgentPluginManifest(raw: string): AgentPluginManifestResult;
/** A validated `mcp.json` server entry, resolved to launch-ready values. */
interface AgentPluginMcpServer {
    name: string;
    transport: "stdio" | "http" | "sse";
    /** Absolute path for `./`-relative commands; bare executable token otherwise. */
    command?: string;
    args?: string[];
    /** Expanded configured env plus the client-supplied `PLUGIN_ROOT`/`PLUGIN_DATA`. */
    env?: Record<string, string>;
    /** Absolute working directory; defaults to the plugin root for stdio servers. */
    cwd?: string;
    url?: string;
    headers?: Record<string, string>;
}
/**
 * Outcome of parsing a plugin's `mcp.json`:
 * - `disabled` — the top-level document is invalid, so MCP is disabled for the
 *   plugin while other component types keep loading (spec §7.2.2 rule 2).
 * - `ok` — the document is valid; individually invalid server entries are
 *   skipped with a warning (spec §7.2.2 rule 3).
 */
type AgentPluginMcpResult = {
    status: "disabled";
    reason: string;
} | {
    status: "ok";
    servers: AgentPluginMcpServer[];
    warnings: string[];
};
interface AgentPluginMcpOptions {
    /** Filesystem-resolved plugin root. */
    pluginRoot: string;
    /** Client-managed persistent data directory for this plugin (spec §9.1). */
    pluginData: string;
}
/**
 * Parse and validate a plugin's `mcp.json` against the closed Agent Plugins
 * 1.0.0 MCP configuration (spec §7.2), resolving stdio commands and working
 * directories against the plugin root and expanding plugin variables.
 */
export declare function parseAgentPluginMcp(raw: string, options: AgentPluginMcpOptions): Promise<AgentPluginMcpResult>;
/**
 * Classification of a plugin root directory against the Agent Plugins standard:
 * - `none` — no Agent Plugins manifest; legacy plugin conventions govern.
 * - `standard` — a valid Agent Plugin; the standard governs its portable
 *   components (skills and MCP servers). `realRoot` is the filesystem-resolved
 *   plugin root every package path is contained within.
 * - `invalid` — the root claims Agent Plugins conformance but its manifest is
 *   fatally invalid; no component may be discovered or executed (spec §11.3).
 */
type AgentPluginRootStatus = {
    kind: "none";
} | {
    kind: "standard";
    manifest: AgentPluginManifest;
    warnings: string[];
    realRoot: string;
} | {
    kind: "invalid";
    reason: string;
};
/** Drop cached classifications (tests, or after plugin installs outside the shared registry flow). */
export declare function clearAgentPluginRootCache(): void;
/**
 * Determine whether a plugin root is governed by the Agent Plugins standard.
 * Results are cached per root path; the cache clears with the shared plugin
 * roots cache and via {@link clearAgentPluginRootCache}.
 */
export declare function classifyAgentPluginRoot(rootPath: string): Promise<AgentPluginRootStatus>;
/**
 * Whether a legacy plugin provider (claude-plugins, omp-plugins) may process a
 * root for the given surface. Roots governed by the Agent Plugins standard keep
 * their portable components (`skills`, `mcp`) exclusive to the standard loader,
 * while client-specific surfaces (commands, hooks, tools, …) still load from
 * hybrid packages. Fatally invalid Agent Plugins packages are rejected entirely.
 */
export declare function legacyProviderAllowed(rootPath: string, surface: "skills" | "mcp" | "other"): Promise<boolean>;
export {};
