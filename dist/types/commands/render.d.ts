/**
 * Draw a session's entire thread through the production transcript pipeline.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Render extends Command {
    static description: string;
    static args: {
        session: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
        };
    };
    static flags: {
        width: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
        };
        height: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
        };
        timing: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        repaint: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
        };
        plain: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
        quiet: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
