/**
 * Test web search providers.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Search extends Command {
    static description: string;
    static aliases: string[];
    static args: {
        query: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            multiple: true;
        };
    };
    static flags: {
        provider: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            options: string[];
        };
        recency: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            options: NonNullable<"day" | "month" | "week" | "year" | undefined>[];
        };
        limit: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"integer"> & {
            char: string;
            description: string;
        };
        compact: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
    };
    run(): Promise<void>;
}
