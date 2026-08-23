/**
 * Codex Code Mode: collapse the direct tool surface for code_mode_only models
 * to a small keep-set and expose every other session tool through the eval
 * bridge, mirroring codex-rs ToolMode::CodeModeOnly.
 */
/**
 * Tool names that always stay directly model-visible under code mode. The
 * `__*__` names are the eval bridge's own internal operations (declared in
 * `eval/*-bridge.ts`, spelled out here to keep this module free of eval
 * imports): `callSessionTool` consumes them before the registry, so a
 * registered tool sharing one of those names is only reachable while it stays
 * on the direct surface.
 */
export declare const CODE_MODE_KEEP_TOOLS: Record<string, true>;
export interface CodeModeResolution {
    active: boolean;
    /** Names that remain directly model-visible. All enabled names when inactive. */
    directToolNames: Set<string>;
}
export declare function resolveCodeMode(args: {
    provider: string;
    toolMode?: string;
    setting: "off" | "on" | "auto";
    extraDirectTools?: readonly string[];
    enabledToolNames: readonly string[];
    evalTransportAvailable: boolean;
}): CodeModeResolution;
/** codex-rs TurnToolFunctionInfo shape (snake_case on the wire). */
export interface ToolNamespaceFunctionInfo {
    name: string;
    direct: boolean;
    code_mode_name: string | null;
    deferred: boolean;
    source: {
        kind: "harness";
    } | {
        kind: "mcp";
        server_name: string;
    };
}
/** codex-rs TurnToolNamespacesInfo shape. */
export interface ToolNamespacesInfo {
    [namespace: string]: {
        name: string;
        functions: Record<string, ToolNamespaceFunctionInfo>;
    };
}
export declare function buildToolNamespacesInfo(args: {
    tools: ReadonlyArray<{
        name: string;
        customWireName?: string;
        loadMode?: string;
        mcpServerName?: string;
    }>;
    directToolNames: ReadonlySet<string>;
}): ToolNamespacesInfo;
