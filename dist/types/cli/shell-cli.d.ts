export interface ShellCommandArgs {
    cwd?: string;
    timeoutMs?: number;
    noSnapshot?: boolean;
}
export declare function parseShellArgs(args: string[]): ShellCommandArgs | undefined;
export declare function runShellCommand(cmd: ShellCommandArgs): Promise<void>;
export declare function printShellHelp(): void;
