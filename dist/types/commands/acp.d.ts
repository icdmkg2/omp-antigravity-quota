/**
 * Run Oh My Pi as an ACP (Agent Client Protocol) server over stdio.
 *
 * Thin wrapper around the launch flow that forces `mode: "acp"` unless the
 * ACP terminal-auth flag asks the same command to open the interactive TUI.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Acp extends Command {
    static description: string;
    static strict: boolean;
    run(): Promise<void>;
}
