/**
 * Build a fresh, internally consistent desktop navigation fingerprint for one HTTP request.
 * By default, this randomizes across coherent modern Chrome, Firefox, and Safari profiles.
 * Set `randomized` to `false` when a fetch must preserve a stable Mac Chrome identity.
 */
export declare function buildBrowserNavigationHeaders(options?: {
    randomized?: boolean;
}): Record<string, string>;
