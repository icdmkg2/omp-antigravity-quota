/**
 * `omp auth-gateway` — run a forward proxy that injects auth from the broker.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
import { type AuthGatewayAction } from "../cli/auth-gateway-cli.js";
export default class AuthGateway extends Command {
    static description: string;
    static args: {
        action: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
            required: false;
            options: AuthGatewayAction[];
        };
    };
    static flags: {
        json: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        bind: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            char: string;
        };
        regenerate: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        "no-auth": import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
        strict: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"boolean"> & {
            description: string;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
