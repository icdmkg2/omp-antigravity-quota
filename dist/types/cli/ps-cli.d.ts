/**
 * CLI handler for `omp ps` — inspect and control processes supervised by the
 * daemon broker from outside the harness.
 *
 * A bare `omp ps` on a TTY opens the interactive alt-screen monitor
 * (`ps-tui.ts`); `--plain`, `--json`, and non-TTY outputs use the static
 * listing. Actions (`stop`, `kill`, `restart`, `logs`, `info`) connect through
 * the regular client, which revives a dead broker so it can re-adopt detached
 * daemons before acting on them.
 */
export type PsAction = "list" | "info" | "logs" | "stop" | "kill" | "restart";
export interface PsCommandArgs {
    action: PsAction;
    /** Daemon name; required for every action except `list`. */
    name?: string;
    flags: {
        /** list: include every project and global service scope on this machine. */
        all: boolean;
        json: boolean;
        /** list: force the static listing instead of the interactive monitor. */
        plain: boolean;
        /** Target another project directory instead of the current one. */
        dir?: string;
        /** Target a machine-global service scope (e.g. browser-relay). */
        global?: string;
        /** logs: keep streaming new output. */
        follow: boolean;
        /** logs: read from the beginning instead of the tail. */
        head: boolean;
        /** logs: number of lines. */
        lines?: number;
        /** logs: regex filter. */
        grep?: string;
        /** stop: grace period in seconds before hard kill. */
        timeout?: number;
    };
}
export declare function runPsCommand(cmd: PsCommandArgs): Promise<void>;
