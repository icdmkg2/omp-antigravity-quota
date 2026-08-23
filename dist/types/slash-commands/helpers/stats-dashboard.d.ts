export declare const DEFAULT_STATS_DASHBOARD_PORT = 3847;
export interface StatsDashboardArgs {
    port: number;
    host: string;
}
export interface StatsDashboardLaunchResult {
    url: string;
    message: string;
}
export declare function parseStatsDashboardArgs(args: string): StatsDashboardArgs | {
    error: string;
};
export declare function launchStatsDashboard(args: StatsDashboardArgs): Promise<StatsDashboardLaunchResult>;
export declare function stopStatsDashboard(): void;
