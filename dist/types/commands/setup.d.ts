/**
 * Run onboarding setup or install dependencies for optional features.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
import { type SetupComponent } from "../cli/setup-cli.js";
import { runRootCommand } from "../main.js";
export interface OnboardingSetupDependencies {
    runRoot?: typeof runRootCommand;
    stdinIsTTY?: boolean;
    stdoutIsTTY?: boolean;
    writeStderr?: (text: string) => void;
    exit?: (code: number) => never;
}
export declare function runOnboardingSetup(deps?: OnboardingSetupDependencies): Promise<void>;
export default class Setup extends Command {
    static description: string;
    static args: {
        component: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: SetupComponent[];
        };
    };
    static flags: {
        check: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            char: string;
            description: string;
        };
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
    };
    run(): Promise<void>;
}
