/**
 * View, clean, and push reported tool issues from automated QA.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Grievances extends Command {
    static description: string;
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: string[];
            default: string;
        };
    };
    static flags: {
        limit: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
            default: number;
        };
        tool: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
        id: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
        };
        all: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
