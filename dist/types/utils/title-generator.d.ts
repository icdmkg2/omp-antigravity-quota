import { type Api, type Model } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
/**
 * Generate a title for a session based on the first user message.
 *
 * @param firstMessage The first user message
 * @param registry Model registry
 * @param settings Settings used to resolve the smol role
 * @param sessionId Optional session id for sticky API key selection
 * @param currentModel Current model (used to derive title model)
 * @param metadataResolver Optional resolver evaluated after credential selection
 *   to produce request metadata (e.g. user_id for session attribution). Using a
 *   resolver instead of a pre-evaluated value ensures the metadata's account_uuid
 *   reflects the credential actually selected for this request.
 * @param customSystemPrompt Optional title-specific system prompt override
 * @param signal Session-lifecycle cancellation for background title requests
 */
export declare function generateSessionTitle(firstMessage: string, registry: ModelRegistry, settings: Settings, sessionId?: string, currentModel?: Model<Api>, metadataResolver?: (provider: string) => Record<string, unknown> | undefined, customSystemPrompt?: string, signal?: AbortSignal): Promise<string | null>;
export declare function generateTitleOnline(firstMessage: string, registry: ModelRegistry, settings: Settings, sessionId?: string, currentModel?: Model<Api>, metadataResolver?: (provider: string) => Record<string, unknown> | undefined, signal?: AbortSignal, customSystemPrompt?: string): Promise<string | null>;
export declare function formatSessionTerminalTitle(sessionName: string | undefined, cwd?: string): string;
/**
 * Set the terminal title through the native Win32 API or OSC 0.
 *
 * Repeating the same sanitized title is a no-op on every platform.
 */
export declare function setTerminalTitle(title: string): void;
export declare function setSessionTerminalTitle(sessionName: string | undefined, cwd?: string): void;
/**
 * Set a terminal title from an extension's `setTitle()`. Unlike the session base
 * title, this owns the terminal verbatim: periodic and run-state updates will not
 * rewrite it. Cleared when the app next sets an authoritative session title via
 * {@link setSessionTerminalTitle}.
 */
export declare function setExtensionTerminalTitle(title: string): void;
export type TerminalTitleState = "idle" | "working" | "attention";
/**
 * Compose the terminal title from the `π` brand, a state-carrying separator, and
 * the session label. Pure (no I/O) so the state→separator contract is testable:
 *   - `idle` (user's turn):  `π > label`;
 *   - `working`:             `π ⠋ label` (`π : label` on Windows);
 *   - `attention`:           `π ! label`;
 *   - disabled:              `π: label`.
 * Without a label the separator trails the brand (`π >`) so the state stays visible.
 */
export declare function buildTerminalTitleWithState(label: string | undefined, state: TerminalTitleState, frame: number, enabled: boolean, platform?: NodeJS.Platform): string;
/**
 * Reflect the agent run state in the terminal title's separator: `working`
 * animates outside Windows and stays `:` on Windows, `idle` shows `>` (your
 * turn), and `attention` shows `!` (agent blocked on you). Gated off by
 * `tui.titleState`.
 */
export declare function setTerminalTitleState(state: TerminalTitleState): void;
/** Enable/disable the run-state separator (driven by the `tui.titleState` setting). */
export declare function setTerminalTitleStateEnabled(enabled: boolean): void;
/** Release terminal-title runtime resources. */
export declare function disposeTerminalTitleState(): void;
/**
 * Save the current terminal title on terminals that support xterm window ops.
 */
export declare function pushTerminalTitle(): void;
/**
 * Restore the previously saved terminal title on terminals that support xterm window ops.
 */
export declare function popTerminalTitle(): void;
