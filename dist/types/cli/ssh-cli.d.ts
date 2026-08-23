/**
 * SSH CLI command handlers.
 *
 * Handles `omp ssh <command>` subcommands for SSH host configuration management.
 */
export type SSHAction = "add" | "remove" | "list";
export interface SSHCommandArgs {
    action: SSHAction;
    args: string[];
    flags: {
        json?: boolean;
        host?: string;
        user?: string;
        port?: string;
        key?: string;
        desc?: string;
        compat?: boolean;
        scope?: "project" | "user";
    };
}
export declare function runSSHCommand(cmd: SSHCommandArgs): Promise<void>;
