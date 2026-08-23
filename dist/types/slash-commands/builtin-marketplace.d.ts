import type { InteractiveModeContext } from "../modes/types.js";
import type { SlashCommandSpec } from "./types.js";
/**
 * Reload the interactive session's plugin runtime: invalidate fs/plugin-root
 * caches, rediscover skills, file slash commands, and task agents, reset the
 * capability cache, and reconnect MCP servers (rebinding the session's MCP
 * tools). Shared by `/reload-plugins`'s TUI handler and the `handle`-adapter's
 * `reloadPlugins` hook so both honor the command's documented reload scope.
 */
export declare function reloadTuiPluginState(ctx: InteractiveModeContext): Promise<void>;
export declare const BUILTIN_MARKETPLACE_SLASH_COMMANDS: ReadonlyArray<SlashCommandSpec>;
