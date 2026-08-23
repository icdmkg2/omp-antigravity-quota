import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Cleanse extends Command {
    static description: string;
    static args: {
        request: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
    };
    static flags: {
        agents: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
            default: number;
        };
        model: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
            default: string;
        };
        tests: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
        all: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
