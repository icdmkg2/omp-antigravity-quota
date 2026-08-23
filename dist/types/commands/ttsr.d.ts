/**
 * `omp ttsr` — inspect and test Time-Traveling Stream Rules.
 *
 * `omp ttsr test` feeds a snippet (inline, --file, or stdin) through the real
 * TTSR matching pipeline and reports which rules would trigger. `omp ttsr list`
 * shows every TTSR-registered rule the current project/user config would load.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Ttsr extends Command {
    static description: string;
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: import("../cli/ttsr-cli.js").TtsrAction[];
        };
        snippet: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
    };
    static flags: {
        file: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        rule: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        source: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            options: import("../cli/ttsr-cli.js").TtsrMatchSource[];
        };
        tool: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        path: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        verbose: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "no-gitignore": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "max-bytes": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            description: string;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
