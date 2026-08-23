/**
 * Inspect and control daemon-broker supervised processes from outside the harness.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
import { type PsAction } from "../cli/ps-cli.js";
export default class Ps extends Command {
    static description: string;
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: PsAction[];
        };
        name: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
    };
    static flags: {
        all: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        plain: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        dir: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        global: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        follow: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        head: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        lines: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
        };
        grep: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        timeout: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
