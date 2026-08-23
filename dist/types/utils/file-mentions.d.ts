import { type SnapshotStore } from "@oh-my-pi/hashline";
import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
/** Extract all @filepath mentions from text */
export declare function extractFileMentions(text: string): string[];
/**
 * Generate a FileMentionMessage containing the contents of mentioned files.
 * Returns empty array if no files could be read.
 */
export declare function generateFileMentionMessages(filePaths: string[], cwd: string, options?: {
    autoResizeImages?: boolean;
    useHashLines?: boolean;
    snapshotStore?: SnapshotStore;
}): Promise<AgentMessage[]>;
