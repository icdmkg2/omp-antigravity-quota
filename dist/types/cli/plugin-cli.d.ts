/**
 * Plugin CLI command handlers.
 *
 * Handles `omp plugin <command>` subcommands for plugin lifecycle management.
 */
export type PluginAction = "install" | "uninstall" | "list" | "link" | "doctor" | "features" | "config" | "enable" | "disable" | "marketplace" | "discover" | "upgrade";
export interface PluginCommandArgs {
    action: PluginAction;
    args: string[];
    flags: {
        json?: boolean;
        fix?: boolean;
        force?: boolean;
        dryRun?: boolean;
        local?: boolean;
        enable?: string;
        disable?: string;
        set?: string;
        scope?: "user" | "project";
    };
}
/**
 * Parse plugin subcommand arguments.
 * Returns undefined if not a plugin command.
 */
export declare function parsePluginArgs(args: string[]): PluginCommandArgs | undefined;
export { classifyInstallTarget } from "./classify-install-target.js";
/**
 * Run a plugin command.
 */
export declare function runPluginCommand(cmd: PluginCommandArgs): Promise<void>;
export declare function printPluginHelp(): void;
