import type { CustomMessagePayload } from "../../session/messages.js";
import type { HookMessageRenderer, RegisteredCommand } from "./types.js";
/**
 * Generic handler function type.
 */
type HandlerFn = (...args: unknown[]) => Promise<unknown>;
/**
 * Send message handler type for pi.sendMessage().
 */
export type SendMessageHandler = <T = unknown>(message: CustomMessagePayload<T>, options?: {
    triggerTurn?: boolean;
    deliverAs?: "steer" | "followUp";
}) => void;
/**
 * Append entry handler type for pi.appendEntry().
 */
export type AppendEntryHandler = <T = unknown>(customType: string, data?: T) => void;
export type { BranchHandler, NavigateTreeHandler, NewSessionHandler } from "../session-handler-types.js";
/**
 * Registered handlers for a loaded hook.
 */
export interface LoadedHook {
    /** Original path from config */
    path: string;
    /** Resolved absolute path */
    resolvedPath: string;
    /** Map of event type to handler functions */
    handlers: Map<string, HandlerFn[]>;
    /** Map of customType to hook message renderer */
    messageRenderers: Map<string, HookMessageRenderer>;
    /** Map of command name to registered command */
    commands: Map<string, RegisteredCommand>;
    /** Set the send message handler for this hook's pi.sendMessage() */
    setSendMessageHandler: (handler: SendMessageHandler) => void;
    /** Set the append entry handler for this hook's pi.appendEntry() */
    setAppendEntryHandler: (handler: AppendEntryHandler) => void;
}
/**
 * Result of loading hooks.
 */
export interface LoadHooksResult {
    /** Successfully loaded hooks */
    hooks: LoadedHook[];
    /** Errors encountered during loading */
    errors: Array<{
        path: string;
        error: string;
    }>;
}
/**
 * Load all hooks from configuration.
 * @param paths - Array of hook file paths
 * @param cwd - Current working directory for resolving relative paths
 */
export declare function loadHooks(paths: string[], cwd: string): Promise<LoadHooksResult>;
/**
 * Discover and load hooks from all registered providers.
 * Uses the capability API to discover hook paths from:
 * 1. OMP native configs (.omp/.pi hooks/)
 * 2. Installed plugins
 * 3. Other editor/IDE configurations
 *
 * Plus any explicitly configured paths from settings.
 */
export declare function discoverAndLoadHooks(configuredPaths: string[], cwd: string): Promise<LoadHooksResult>;
