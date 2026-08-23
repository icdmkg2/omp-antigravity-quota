/**
 * Manage bundled task agents.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Agents extends Command {
    static description: string;
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: "unpack"[];
        };
    };
    static flags: {
        force: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        dir: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        user: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        project: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
