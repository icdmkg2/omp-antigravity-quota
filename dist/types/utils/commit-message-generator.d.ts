import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
/**
 * Generate a commit message from a unified diff.
 * Returns null if generation fails (caller should fall back to generic message).
 */
export declare function generateCommitMessage(diff: string, registry: ModelRegistry, settings: Settings, sessionId?: string): Promise<string | null>;
