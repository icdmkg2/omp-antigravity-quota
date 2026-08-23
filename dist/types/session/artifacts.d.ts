/**
 * Manages artifact storage for a session.
 *
 * Artifacts are stored with sequential IDs in the session's artifact directory.
 * The directory is created lazily on first write.
 *
 * Subagents do not own their own `ArtifactManager`. The parent's instance is
 * adopted via `SessionManager.adoptArtifactManager`, so the whole parent +
 * subagent tree shares one ID space and one directory.
 */
export declare class ArtifactManager {
    #private;
    /**
     * @param dir Directory that will hold artifact files. Created lazily on first save.
     */
    constructor(dir: string);
    /**
     * Artifact directory path.
     * Directory may not exist until first artifact is saved.
     */
    get dir(): string;
    /**
     * Atomically allocate next artifact ID.
     * IDs are sequential within the session.
     */
    allocateId(): number;
    /**
     * Allocate a new artifact path and ID without writing content.
     *
     * @param toolType Tool name for file extension (e.g., "bash", "read")
     */
    allocatePath(toolType: string): Promise<{
        id: string;
        path: string;
    }>;
    /**
     * Save content as an artifact and return the artifact ID.
     *
     * @param content Full content to save
     * @param toolType Tool name for file extension (e.g., "bash", "read")
     * @returns Artifact ID (numeric string)
     */
    save(content: string, toolType: string): Promise<string>;
    /**
     * Check if an artifact exists.
     * @param id Artifact ID (numeric string)
     */
    exists(id: string): Promise<boolean>;
    /**
     * List all artifact files in the directory.
     * Returns empty array if directory doesn't exist.
     */
    listFiles(): Promise<string[]>;
    /**
     * Get the full path to an artifact file.
     * Returns null if artifact doesn't exist.
     *
     * @param id Artifact ID (numeric string)
     */
    getPath(id: string): Promise<string | null>;
}
