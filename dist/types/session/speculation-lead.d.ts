/** Floor of the speculation band; also the armed-summary refresh budget floor. */
export declare const SPECULATION_LEAD_MIN_TOKENS = 8192;
/** Tokens the threshold band spans: speculation fires inside `[threshold − lead, threshold)`. */
export declare function resolveSpeculationLeadTokens(thresholdTokens: number): number;
