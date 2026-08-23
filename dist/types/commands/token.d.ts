/**
 * Get the API key or OAuth token for a provider.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Token extends Command {
    static description: string;
    static args: {
        provider: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: true;
        };
    };
    static flags: {
        raw: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
        "force-refresh": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
        account: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
        };
        list: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
            default: boolean;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
