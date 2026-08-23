import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { HookUIContext } from "../../extensibility/hooks/types.js";
import * as PiCodingAgent from "../../index.js";
import type { LoadedCustomTool, ToolLoadError } from "./types.js";
/** Tool path with optional source metadata, suitable for forwarding from a
 * parent session to a subagent so the subagent can re-bind tools to its own
 * `CustomToolAPI` without redoing the filesystem scan. */
export interface ToolPathWithSource {
    path: string;
    source?: {
        provider: string;
        providerName: string;
        level: "user" | "project";
    };
}
/**
 * Loads custom tools from paths with conflict detection and error handling.
 *
 * Manages a shared API instance passed to all tool factories, providing access to
 * execution context, UI, logger, and injected dependencies. The UI context can be
 * updated after loading via setUIContext().
 */
export declare class CustomToolLoader {
    #private;
    tools: LoadedCustomTool[];
    errors: ToolLoadError[];
    constructor(pi: typeof PiCodingAgent, cwd: string, builtInToolNames: string[], pushPendingAction?: (action: {
        label: string;
        sourceToolName: string;
        apply(reason: string): Promise<AgentToolResult<unknown>>;
        reject?(reason: string): Promise<AgentToolResult<unknown> | undefined>;
    }) => void);
    load(pathsWithSources: ToolPathWithSource[]): Promise<void>;
    setUIContext(uiContext: HookUIContext, hasUI: boolean): void;
}
/**
 * Load all tools from configuration.
 * @param pathsWithSources - Array of tool paths with optional source metadata
 * @param cwd - Current working directory for resolving relative paths
 * @param builtInToolNames - Names of built-in tools to check for conflicts
 */
export declare function loadCustomTools(pathsWithSources: ToolPathWithSource[], cwd: string, builtInToolNames: string[], pushPendingAction?: (action: {
    label: string;
    sourceToolName: string;
    apply(reason: string): Promise<AgentToolResult<unknown>>;
    reject?(reason: string): Promise<AgentToolResult<unknown> | undefined>;
}) => void): Promise<{
    tools: LoadedCustomTool<import("@oh-my-pi/pi-ai").TSchema, any>[];
    errors: ToolLoadError[];
    setUIContext: (uiContext: HookUIContext, hasUI: boolean) => void;
}>;
/**
 * Collect the absolute tool-source paths to load, without importing or
 * binding factories. Hot path on session startup — the scan walks
 * `.omp/tools/`, `.claude/tools/`, the plugin tree, and any configured paths.
 *
 * Subagents reuse the parent's collected paths via the SDK's
 * `preloadedCustomToolPaths` option, then call `loadCustomTools` themselves
 * so each session re-binds factories with its own session-scoped
 * `CustomToolAPI` (cwd, exec, pushPendingAction, UI).
 *
 * @param configuredPaths - Explicit paths from settings.json and CLI --tool flags
 * @param cwd - Current working directory
 */
export declare function discoverCustomToolPaths(configuredPaths: string[], cwd: string): Promise<ToolPathWithSource[]>;
/**
 * Discover and load tools from standard locations via capability system:
 * 1. User and project tools discovered by capability providers
 * 2. Installed plugins (~/.omp/plugins/node_modules/*)
 * 3. Explicitly configured paths from settings or CLI
 *
 * Composed of {@link discoverCustomToolPaths} (FS scan) + {@link loadCustomTools}
 * (per-session binding). Subagents skip the first step and just call
 * `loadCustomTools` against the parent's collected paths.
 *
 * @param configuredPaths - Explicit paths from settings.json and CLI --tool flags
 * @param cwd - Current working directory
 * @param builtInToolNames - Names of built-in tools to check for conflicts
 */
export declare function discoverAndLoadCustomTools(configuredPaths: string[], cwd: string, builtInToolNames: string[], pushPendingAction?: (action: {
    label: string;
    sourceToolName: string;
    apply(reason: string): Promise<AgentToolResult<unknown>>;
    reject?(reason: string): Promise<AgentToolResult<unknown> | undefined>;
}) => void): Promise<{
    tools: LoadedCustomTool<import("@oh-my-pi/pi-ai").TSchema, any>[];
    errors: ToolLoadError[];
    setUIContext: (uiContext: HookUIContext, hasUI: boolean) => void;
}>;
