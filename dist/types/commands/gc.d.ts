/**
 * Run on-disk storage maintenance.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Gc extends Command {
    static description: string;
    static flags: {
        apply: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "agent-dir": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        blobs: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        archive: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        wal: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "cold-archive-after-days": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
        };
        "retain-newest-global": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
        };
        "retain-newest-per-cwd": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
        };
    };
    run(): Promise<void>;
}
