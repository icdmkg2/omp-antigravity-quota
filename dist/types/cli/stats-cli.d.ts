/**
 * Stats CLI command handlers.
 *
 * Handles `omp stats` subcommand for viewing AI usage statistics.
 */
export interface StatsCommandArgs {
    port: number;
    host: string;
    json: boolean;
    summary: boolean;
}
export declare function runStatsCommand(cmd: StatsCommandArgs): Promise<void>;
