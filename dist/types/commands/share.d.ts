/**
 * Share a saved session as an encrypted link without launching the agent.
 *
 * `omp share <session>` accepts a session id (prefix) or a path to a session
 * `.jsonl` and uploads the sealed snapshot exactly like the `/share` slash
 * command, honoring `share.serverUrl`, `share.store`, and
 * `share.redactSecrets`.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Share extends Command {
    static description: string;
    static args: {
        session: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: true;
        };
    };
    static flags: {
        gist: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
            default: boolean;
        };
    };
    run(): Promise<void>;
}
