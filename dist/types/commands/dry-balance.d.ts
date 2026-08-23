import { Command } from "@oh-my-pi/pi-utils/cli";
export default class DryBalance extends Command {
    static description: string;
    static args: {
        model: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
    };
    static flags: {
        model: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        count: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
            default: number;
        };
        concurrency: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
            default: number;
        };
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        bench: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
