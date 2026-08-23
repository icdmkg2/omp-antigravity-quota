/**
 * Generate and optionally push a commit with changelog updates.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Commit extends Command {
    static description: string;
    static flags: {
        push: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "dry-run": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "no-changelog": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        legacy: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        context: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        model: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
    };
    run(): Promise<void>;
}
