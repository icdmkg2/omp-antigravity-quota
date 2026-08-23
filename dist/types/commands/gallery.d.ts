/**
 * Render every built-in tool's renderer across its lifecycle states.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Gallery extends Command {
    static description: string;
    static flags: {
        tool: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        state: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
            options: string[];
            multiple: true;
        };
        width: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
        };
        expanded: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
        plain: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
        screenshot: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
        out: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        font: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        "font-size": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
        };
    };
    run(): Promise<void>;
}
