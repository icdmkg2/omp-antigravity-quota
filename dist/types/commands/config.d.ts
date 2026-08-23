/**
 * Manage configuration settings.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
import { type ConfigAction } from "../cli/config-cli.js";
export default class Config extends Command {
    static description: string;
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: ConfigAction[];
        };
        key: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
        value: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            multiple: true;
        };
    };
    static flags: {
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
    };
    run(): Promise<void>;
}
