export declare function substitutePluginRoot<T>(value: T, rootPath: string): T;
/**
 * Where a relative, path-like `command` is rooted by {@link resolvePluginStdioPaths}.
 *
 * - `"config-dir"` (default): the directory of the config file that declared the
 *   server — the plugin package root for `.mcp.json`. A plugin can ship its
 *   executable at the package root (`command: "./bin/server"`) yet run from a
 *   data subdir (`cwd: "work"`); the command stays `<pkg>/bin/server`.
 * - `"cwd"`: the rooted `cwd`, falling back to the config dir when no `cwd` is
 *   set. This matches how the OS resolves a relative command against the
 *   subprocess's working directory, which is the Codex `config.toml` contract:
 *   `cwd = "server"`, `command = "./bin/mcp"` → `<configDir>/server/bin/mcp`.
 */
export type StdioCommandBase = "config-dir" | "cwd";
/**
 * Rebase relative filesystem values in a discovered stdio server config against
 * the directory of the config file (`.mcp.json`/`config.toml`) that declared them.
 *
 * External configs (bundled ChatGPT/Codex plugins, Claude marketplace plugins)
 * express `command`/`cwd` relative to their own config file, but MCP stdio
 * spawning roots relative values at the session cwd — so a server shipping
 * `command: "./bin/server"`, `cwd: "."` launches from the wrong directory and
 * fails with ENOENT. This resolves those against `configDir` instead:
 *
 * - relative `cwd` → resolved against `configDir`;
 * - path-like `command` (`./`, `../`, or the Windows `.\`/`..\` forms) →
 *   resolved against the base selected by `commandBase` (see {@link StdioCommandBase});
 * - bare executables (`npx`, `uvx`, …) and absolute paths are left untouched.
 */
export declare function resolvePluginStdioPaths(config: {
    command?: string;
    cwd?: string;
}, configDir: string, commandBase?: StdioCommandBase): {
    command?: string;
    cwd?: string;
};
