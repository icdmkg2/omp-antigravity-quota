import type { CustomCommandSource, CustomCommandsLoadResult } from "./types.js";
export interface DiscoverCustomCommandsOptions {
    /** Current working directory. Default: getProjectDir() */
    cwd?: string;
    /** Agent config directory. Default: from getAgentDir() */
    agentDir?: string;
}
export interface DiscoverCustomCommandsResult {
    /** Paths to command modules */
    paths: Array<{
        path: string;
        source: CustomCommandSource;
    }>;
}
/**
 * Discover custom command modules (TypeScript slash commands).
 * Markdown slash commands are handled by core/slash-commands.ts.
 */
export declare function discoverCustomCommands(options?: DiscoverCustomCommandsOptions): Promise<DiscoverCustomCommandsResult>;
export interface LoadCustomCommandsOptions {
    /** Current working directory. Default: getProjectDir() */
    cwd?: string;
    /** Agent config directory. Default: from getAgentDir() */
    agentDir?: string;
}
/**
 * Discover and load custom commands from standard locations.
 */
export declare function loadCustomCommands(options?: LoadCustomCommandsOptions): Promise<CustomCommandsLoadResult>;
