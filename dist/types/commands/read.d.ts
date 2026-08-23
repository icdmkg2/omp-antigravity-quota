/**
 * Show what the read tool will return for a path, URL, or internal URI.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Read extends Command {
    static description: string;
    static args: {
        path: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: true;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
