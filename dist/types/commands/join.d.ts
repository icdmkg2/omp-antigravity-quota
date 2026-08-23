/**
 * Join a shared collab session from the CLI: launches the interactive TUI and
 * immediately runs `/join <link>`.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Join extends Command {
    static description: string;
    static args: {
        link: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: true;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
