/**
 * Synthesize text with the local TTS engine and play it (or save it with --out).
 *
 * Text comes from the argument or --file. Input is segmented into
 * sentence-sized chunks ({@link SpeakableStream}) and synthesized through the
 * streaming TTS worker, so arbitrarily long text plays gaplessly instead of
 * hitting Kokoro's single-call ~510-phoneme truncation. --out concatenates the
 * streamed segments into one WAV. The first run downloads the configured local
 * model into the worker's cache.
 */
import { Command } from "@oh-my-pi/pi-utils/cli";
export default class Say extends Command {
    #private;
    static description: string;
    static args: {
        text: import("@oh-my-pi/pi-utils/cli").ArgDescriptor & {
            description: string;
        };
    };
    static flags: {
        voice: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
            options: readonly string[];
        };
        model: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            description: string;
        };
        file: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
        out: import("@oh-my-pi/pi-utils/cli").FlagDescriptor<"string"> & {
            char: string;
            description: string;
        };
    };
    static examples: string[];
    run(): Promise<void>;
}
