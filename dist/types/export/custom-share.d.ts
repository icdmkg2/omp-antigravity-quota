export interface CustomShareResult {
    /** URL to display/open (optional - script may handle everything itself) */
    url?: string;
    /** Additional message to show the user */
    message?: string;
}
export type CustomShareFn = (htmlPath: string) => Promise<CustomShareResult | string | undefined>;
export interface LoadedCustomShare {
    path: string;
    fn: CustomShareFn;
}
/**
 * Get the path to the custom share script if it exists.
 */
export declare function getCustomSharePath(): string | null;
/**
 * Load the custom share script if it exists.
 */
export declare function loadCustomShare(): Promise<LoadedCustomShare | null>;
