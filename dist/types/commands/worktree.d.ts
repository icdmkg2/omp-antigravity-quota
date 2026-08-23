/**
 * List and clean up agent-managed git worktrees under `~/.omp/wt`.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Worktree extends Command {
    static description: string;
    static aliases: string[];
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: string[];
            default: string;
        };
    };
    static flags: {
        all: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
        "dry-run": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
