/** Controls which virtual terminal rows a launch log exposes. */
export interface TerminalOutputOptions {
    head: boolean;
    maxRows: number;
}
/** Replays daemon bytes with the same xterm screen renderer used by PTY mode. */
export declare function renderTerminalOutput(output: string, options: TerminalOutputOptions): Promise<string[] | undefined>;
