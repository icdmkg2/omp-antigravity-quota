import type { DapAdapterConfig, DapResolvedAdapter } from "./types.js";
export declare function getAdapterConfigs(cwd?: string): Record<string, DapAdapterConfig>;
export declare function resolveAdapter(adapterName: string, cwd: string): DapResolvedAdapter | null;
export declare function getAvailableAdapters(cwd: string): DapResolvedAdapter[];
/** Launch adapter selection, including a configured adapter whose command is unavailable. */
export type LaunchAdapterSelection = {
    kind: "adapter";
    adapter: DapResolvedAdapter;
} | {
    kind: "unavailable";
    adapterName: string;
    command: string;
} | {
    kind: "none";
};
/** Selects a launch adapter or reports why matching configuration cannot run. */
export declare function selectLaunchAdapter(program: string, cwd: string, adapterName?: string, programKind?: LaunchProgramKind): LaunchAdapterSelection;
export declare function selectAttachAdapter(cwd: string, adapterName?: string, port?: number): DapResolvedAdapter | null;
/** How the launch `program` resolves on disk. `"missing"` is reserved for
 *  programs the adapter creates on demand (rare); we treat them like files. */
export type LaunchProgramKind = "file" | "directory" | "missing";
/** Compute adapter-specific launch arguments that depend on the resolved
 *  program. Returned values are spread over `adapter.launchDefaults` so they
 *  take precedence over the static defaults but can still be overridden by
 *  the fields `DapSessionManager.launch` sets explicitly (program, cwd, args).
 *
 *  Currently scoped to dlv, where `mode` selects how the program path is
 *  interpreted: directories and `.go` source files debug as a Go package
 *  (`mode=debug`), anything else is treated as a compiled binary (`mode=exec`).
 */
export declare function resolveLaunchOverrides(adapter: DapResolvedAdapter, program: string, programKind: LaunchProgramKind): Record<string, unknown>;
