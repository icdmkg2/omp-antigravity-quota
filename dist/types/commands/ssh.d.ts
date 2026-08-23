/**
 * Manage SSH host configurations.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
import { type SSHAction } from "../cli/ssh-cli.js";
export default class SSH extends Command {
    static description: string;
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: SSHAction[];
        };
        targets: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            multiple: true;
        };
    };
    static flags: {
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        host: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        user: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        port: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        key: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        desc: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        compat: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        scope: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            options: string[];
        };
    };
    run(): Promise<void>;
}
