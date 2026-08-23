/**
 * Check for and install updates.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Update extends Command {
    static description: string;
    static flags: {
        force: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
        check: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
        plugins: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
        canary: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
        stable: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
