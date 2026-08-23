/**
 * View usage statistics dashboard.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Stats extends Command {
    static description: string;
    static flags: {
        port: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
            default: number;
        };
        host: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            default: string;
        };
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
        summary: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
    };
    run(): Promise<void>;
}
