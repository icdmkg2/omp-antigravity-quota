/**
 * Interactive shell console.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Shell extends Command {
    static description: string;
    static flags: {
        cwd: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        timeout: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
        };
        "no-snapshot": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
    };
    run(): Promise<void>;
}
