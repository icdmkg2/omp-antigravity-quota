import { Command } from "@oh-my-pi/pi-utils/cli";
import { type TinyModelsAction } from "../cli/tiny-models-cli.js";
export default class TinyModels extends Command {
    static description: string;
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: TinyModelsAction[];
        };
        model: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
        };
    };
    static flags: {
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
    };
    run(): Promise<void>;
}
