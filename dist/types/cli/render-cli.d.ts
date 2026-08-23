export interface RenderCommandArgs {
    /** Session file path or id prefix; default: most recent session for cwd. */
    session?: string;
    /** Terminal width in columns. Default: current terminal width, else 120. */
    width?: number;
    /** Terminal height in rows. Default: current terminal height, else 40. */
    height?: number;
    /** Print phase timings and byte counts to stderr. */
    timing?: boolean;
    /** Re-run the full clear-scrollback repaint N times and report each cost. */
    repaint?: number;
    /** Strip ANSI styling from the printed transcript. */
    plain?: boolean;
    /** Suppress the transcript output (timing/benchmark runs). */
    quiet?: boolean;
}
/** Render the resolved session and report timings. Returns the exit code. */
export declare function runRenderCommand(args: RenderCommandArgs): Promise<number>;
