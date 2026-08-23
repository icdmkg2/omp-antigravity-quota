/**
 * List, search, and refresh available models.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Models extends Command {
    static description: string;
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
        pattern: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
    };
    static flags: {
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        extension: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
            multiple: true;
        };
        "no-extensions": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        config: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            multiple: true;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
