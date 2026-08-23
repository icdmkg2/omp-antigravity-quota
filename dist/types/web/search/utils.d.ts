/** Calculate age in seconds from an ISO date string. Returns undefined on invalid input. */
export declare function dateToAgeSeconds(dateStr: string | null | undefined): number | undefined;
/** Clamp a result count to [1, maxVal], returning defaultVal when value is absent or NaN. */
export declare function clampNumResults(value: number | undefined, defaultVal: number, maxVal: number): number;
