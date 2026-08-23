import type { TerminalOutputOptions } from "./terminal-output.js";
/** Replay legacy broker PTY bytes without evaluating xterm in the client process. */
export declare function renderTerminalOutputIsolated(output: string, options: TerminalOutputOptions): Promise<string[] | undefined>;
/** Distribution smoke for source, npm-bundle, and compiled worker routing. */
export declare function smokeTestTerminalOutputWorker(): Promise<void>;
