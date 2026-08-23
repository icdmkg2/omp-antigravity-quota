/**
 * Config CLI command handlers.
 *
 * Handles `omp config <command>` subcommands for managing settings.
 * Uses the settings schema as the source of truth for available settings.
 */
export type ConfigAction = "list" | "get" | "set" | "reset" | "path" | "init-xdg";
export interface ConfigCommandArgs {
    action: ConfigAction;
    key?: string;
    value?: string;
    flags: {
        json?: boolean;
    };
}
/**
 * Parse config subcommand arguments.
 * Returns undefined if not a config command.
 */
export declare function parseConfigArgs(args: string[]): ConfigCommandArgs | undefined;
export declare function runConfigCommand(cmd: ConfigCommandArgs): Promise<void>;
export declare function printConfigHelp(): void;
