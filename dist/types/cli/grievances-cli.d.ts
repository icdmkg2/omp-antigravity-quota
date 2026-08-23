export interface ListGrievancesOptions {
    limit: number;
    tool?: string;
    json: boolean;
}
export interface CleanGrievancesOptions {
    /** Delete a single grievance by id. */
    id?: number;
    /** Delete every grievance recorded for this tool name. */
    tool?: string;
    /** Delete every grievance regardless of tool/id. */
    all?: boolean;
    /** Output the deletion count as JSON instead of a status message. */
    json?: boolean;
}
export interface PushGrievancesOptions {
    /** Emit the {@link FlushResult} as JSON instead of a status line. */
    json?: boolean;
}
export declare function listGrievances(options: ListGrievancesOptions): Promise<void>;
/**
 * Delete grievances from the auto-QA database.
 *
 * Selectors are mutually exclusive in intent — exactly one of `id`, `tool`, or
 * `all` is required. Multiple selectors are rejected to prevent ambiguous deletes
 * (e.g. `--id 5 --all` would be a footgun). Returns silently when the database
 * does not exist yet.
 */
export declare function cleanGrievances(options: CleanGrievancesOptions): Promise<void>;
/**
 * Manually drain every unpushed grievance to the configured backend,
 * ignoring the user-facing consent gate (manual push is the user's
 * explicit "yes ship these now" intent).
 *
 * Requires endpoint configuration (default `qa.omp.sh/v1/grievances`).
 */
export declare function pushGrievances(options: PushGrievancesOptions): Promise<void>;
