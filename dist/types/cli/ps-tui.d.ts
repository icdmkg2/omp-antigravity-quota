import { type PsTarget } from "./ps-data.js";
/** Options accepted by the interactive monitor: scope selection from the list flags. */
export interface PsTopOptions extends PsTarget {
    all: boolean;
}
/** Run the fullscreen interactive process monitor until the user quits. */
export declare function runPsTop(options: PsTopOptions): Promise<void>;
