import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
/** True when a generated label is just the spawn handle, including `Name-2`. */
export declare function labelEchoesHandle(handle: string | undefined, label: string): boolean;
/** Compresses a delegated assignment into a one-sentence UI label via the tiny title model — fired by the executor spawn path because the task wire schema no longer carries a `description`; null on empty input or failure. */
export declare function generateTaskLabel(assignment: string, registry: ModelRegistry, settings: Settings, sessionId?: string, signal?: AbortSignal): Promise<string | null>;
