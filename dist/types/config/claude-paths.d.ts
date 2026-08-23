/** Paths to Claude Code's user data and configuration file. */
export interface ClaudePaths {
    configDir: string;
    configFile: string;
}
/** Resolves Claude Code's user paths, honoring `CLAUDE_CONFIG_DIR`. */
export declare function resolveClaudePaths(home?: string): ClaudePaths;
