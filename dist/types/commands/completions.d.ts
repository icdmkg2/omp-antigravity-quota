/**
 * `omp completions <bash|zsh|fish>` — print a shell completion script.
 *
 * The script is derived entirely from the declarative command/flag metadata
 * (see `cli/completion-gen.ts`), so it never drifts from the actual CLI surface.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
import { type Shell } from "../cli/completion-gen.js";
/** Generate a completion script from the live command registry. */
export declare function generateLiveCompletion(shell: Shell): Promise<string>;
export default class Completions extends Command {
    static description: string;
    static args: {
        shell: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: true;
            options: readonly ["bash", "zsh", "fish"];
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
