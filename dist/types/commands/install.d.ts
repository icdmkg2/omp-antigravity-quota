/**
 * `omp install <target>` — top-level convenience over `omp plugin install` /
 * `omp plugin link`.
 *
 * The docs (omp.sh/docs/extension-authoring) advertise
 *
 *   omp install ./my-extension
 *
 * as a third loading mechanism that "symlinks the directory into the plugin
 * set and watches it for changes". Before this command existed, `install` was
 * not a registered subcommand, so the CLI runner forwarded the argv to the
 * default `launch` command and the model received `install ./my-extension`
 * as an initial prompt — see #1496.
 *
 * Local-path targets (`./foo`, `/abs/foo`, `~/foo`, or an existing directory)
 * route to `plugin link` so they are symlinked into the plugin set, matching
 * the documented behavior. Everything else (`pkg`, `pkg@1.2.3`,
 * `name@marketplace`) routes to `plugin install`.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
/**
 * Heuristic used to decide whether `omp install <target>` should `link` a
 * local directory or `install` a remote spec. Exported for tests.
 */
export declare function looksLikeLocalPath(target: string, cwd?: string): boolean;
export default class Install extends Command {
    static description: string;
    static args: {
        targets: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            multiple: true;
        };
    };
    static flags: {
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        force: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "dry-run": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        scope: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            options: string[];
        };
    };
    run(): Promise<void>;
}
