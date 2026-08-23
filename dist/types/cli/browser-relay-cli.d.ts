export declare const BROWSER_RELAY_ACTIONS: readonly ["serve", "install"];
export type BrowserRelayAction = (typeof BROWSER_RELAY_ACTIONS)[number];
export interface BrowserRelayCommandArgs {
    action: BrowserRelayAction;
    port: number;
    token?: string;
    /** Install target directory; defaults to ~/.omp/browser-relay/extension. */
    dir?: string;
    /** Gather tabs the agent actively drives into an 'omp' Chrome tab group (default true). */
    group?: boolean;
    verbose?: boolean;
}
/** Default port of the relay endpoint (kept in sync with DEFAULT_RELAY_URL). */
export declare const DEFAULT_RELAY_PORT: number;
export declare function runBrowserRelayCommand(args: BrowserRelayCommandArgs): Promise<void>;
