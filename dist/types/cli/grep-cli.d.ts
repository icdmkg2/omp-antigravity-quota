import { GrepOutputMode } from "@oh-my-pi/pi-natives";
export interface GrepCommandArgs {
    pattern: string;
    path: string;
    glob?: string;
    limit: number;
    context: number;
    mode: GrepOutputMode;
    gitignore: boolean;
}
/**
 * Parse grep subcommand arguments.
 * Returns undefined if not a grep command.
 */
export declare function parseGrepArgs(args: string[]): GrepCommandArgs | undefined;
export declare function runGrepCommand(cmd: GrepCommandArgs): Promise<void>;
export declare function printGrepHelp(): void;
