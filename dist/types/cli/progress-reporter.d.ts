/** Minimal output contract used by the interactive progress reporter. */
export interface ProgressOutput {
    isTTY?: boolean;
    write(text: string): boolean;
}
/** Renders completed units of work on one transient terminal line. */
export interface ProgressReporter {
    readonly interactive: boolean;
    start(total: number): void;
    complete(): void;
    finish(): void;
}
/**
 * Create a TTY-only completion bar labelled `label`, e.g. `Repairing [████░░░░] 4/8`.
 *
 * Non-interactive output disables rendering entirely, so callers can print plain
 * per-item lines instead by checking {@link ProgressReporter.interactive}.
 */
export declare function createProgressReporter(label: string, output?: ProgressOutput): ProgressReporter;
