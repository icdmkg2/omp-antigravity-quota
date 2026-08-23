/**
 * Test grep tool.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Grep extends Command {
    static description: string;
    static args: {
        pattern: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
        path: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
    };
    static flags: {
        glob: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        limit: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
            default: number;
        };
        context: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
            default: number;
        };
        files: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        count: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        "no-gitignore": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
    };
    run(): Promise<void>;
}
