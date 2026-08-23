/**
 * Manages agent output ID allocation to ensure uniqueness.
 *
 * The first allocation of a given name keeps the name as-is; subsequent
 * allocations of the same name get a `-2`, `-3`, … suffix. On resume, scans
 * existing output and child-session files so prior state is never overwritten.
 */
export declare class AgentOutputManager {
    #private;
    constructor(getArtifactsDir: () => string | null, options?: {
        parentPrefix?: string;
    });
    /** Reserve final IDs discovered outside the output directory scan. */
    reserve(ids: Iterable<string>): Promise<void>;
    /**
     * Allocate a unique ID.
     *
     * @param id Requested ID (e.g., "Anna")
     * @returns Unique ID ("Anna" first, then "Anna-2", "Anna-3", …)
     */
    allocate(id: string): Promise<string>;
}
