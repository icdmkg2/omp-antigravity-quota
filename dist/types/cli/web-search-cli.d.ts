/**
 * Web search CLI command handlers.
 *
 * Handles `omp q`/`omp web-search` subcommands for testing web search providers.
 */
import type { SearchProviderId } from "../web/search/types.js";
export interface SearchCommandArgs {
    query: string;
    provider?: SearchProviderId | "auto";
    recency?: "day" | "week" | "month" | "year";
    limit?: number;
    expanded: boolean;
}
/**
 * Parse web search subcommand arguments.
 * Returns undefined if not a web search command.
 */
export declare function parseSearchArgs(args: string[]): SearchCommandArgs | undefined;
export declare function runSearchCommand(cmd: SearchCommandArgs): Promise<void>;
export declare function printSearchHelp(): void;
