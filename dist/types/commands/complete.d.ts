import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Complete extends Command {
    static hidden: true;
    static strict: boolean;
    run(): Promise<void>;
}
