/**
 * Helper for wiring the `compact` action of an {@link ExtensionContext}.
 *
 * Extension-facing APIs accept `string | CompactOptions`, but `AgentSession.compact`
 * takes two positional arguments `(instructions, options)`. This helper splits the
 * union so the same adapter can be reused by print-mode, rpc-mode, and the executor.
 */
import type { Model } from "@oh-my-pi/pi-ai";
import type { CompactOptions } from "./types.js";
interface CompactableSession {
    compact(instructions?: string, options?: CompactOptions): Promise<unknown>;
}
export declare function runExtensionCompact(session: CompactableSession, instructionsOrOptions: string | CompactOptions | undefined): Promise<void>;
interface SetModelCapableSession {
    modelRegistry: {
        getApiKey(model: Model): Promise<string | undefined>;
    };
    setModel(model: Model): Promise<unknown>;
}
/**
 * Helper for wiring the `setModel` action of an {@link ExtensionContext}.
 *
 * Returns false when no API key is available for the requested model.
 */
export declare function runExtensionSetModel(session: SetModelCapableSession, model: Model): Promise<boolean>;
export {};
