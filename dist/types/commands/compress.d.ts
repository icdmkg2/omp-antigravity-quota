import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Compress extends Command {
    static description: string;
    static args: {
        files: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: true;
            multiple: true;
        };
    };
    static flags: {
        out: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        inPlace: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        rounds: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
            default: number;
        };
        agents: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
            default: number;
        };
        model: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
