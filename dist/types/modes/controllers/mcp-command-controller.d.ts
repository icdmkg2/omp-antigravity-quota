import { type Component } from "@oh-my-pi/pi-tui";
import type { MCPAuthChallenge, MCPConfigFile, MCPServerConfig } from "../../mcp/types.js";
import type { InteractiveModeContext } from "../types.js";
/**
 * Renders the MCP OAuth fallback URL. Always shows the full authorization URL
 * as the primary `Copy URL:` target — that works from any machine, including
 * SSH/WSL/headless sessions where the OMP-hosted `/launch` loopback URL would
 * resolve against the user's local browser and fail.
 *
 * The render is `width`-aware: on any viewport narrower than the composed row
 * ({@link TUI#prepareLine} truncates anything wider with `Ellipsis.Omit`, no
 * marker), the URL is hard-wrapped into width-fitted rows so the primary copy
 * target can never silently lose trailing OAuth parameters — the failure mode
 * that motivated #4418 in the first place. Browsers strip whitespace when a
 * multi-row selection is pasted into the address bar, so the reassembled URL
 * is byte-identical to what we rendered.
 *
 * When the flow's callback server hosts a short `launchUrl`, it is offered
 * as an additional local shortcut for wide-terminal local users. The OSC 8
 * hyperlink continues to carry the full URL for terminals that support it.
 */
export declare class MCPAuthorizationLinkPrompt implements Component {
    #private;
    constructor(url: string, launchUrl?: string);
    invalidate(): void;
    render(width: number): readonly string[];
}
/**
 * Thrown by {@link MCPCommandController}'s OAuth handler when the user (or a
 * caller-supplied {@link AbortSignal}) cancels the in-flight flow. Distinct
 * from network/timeout failures so callers can surface a neutral
 * "cancelled" status instead of an error banner.
 */
export declare class MCPOAuthCancelledError extends Error {
    constructor(message?: string);
}
/**
 * Collect the de-duplicated union of every MCP server name we know about:
 * user config, project config, and any runtime-discovered servers not
 * already present in either config (`ctx.mcpManager.getAllServerNames()`
 * covers connections, pending connections, and discovered-but-not-yet-
 * connected sources).
 *
 * `includeDisabledOnly` controls names found only in
 * `userConfig.disabledServers`, while `includeDisabledConfigured` controls
 * config entries whose `enabled` flag is false. Both default to true because
 * callers such as `/mcp list` need the complete union. Autocomplete callers
 * must disable the categories their target operation cannot accept.
 *
 * This is the single source of truth for "every known server name": both
 * `MCPCommandController#handleList()` and the `/mcp` slash-command argument
 * completer (server-name autocomplete for `enable`/`disable`/`test`/etc.)
 * call this instead of re-deriving the union themselves.
 *
 * `preloaded` lets a caller that already read both config files (e.g.
 * `#handleList()`) pass them in and skip the redundant re-read.
 */
export declare function collectMcpServerNames(ctx: InteractiveModeContext, preloaded?: {
    userConfig: MCPConfigFile;
    projectConfig: MCPConfigFile;
}, includeDisabledOnly?: boolean, includeDisabledConfigured?: boolean): Promise<string[]>;
export declare class MCPCommandController {
    #private;
    private ctx;
    constructor(ctx: InteractiveModeContext);
    /**
     * Handle /mcp command and route to subcommands
     */
    handle(text: string): Promise<void>;
    /** Reauthorize a server after a tool-level OAuth challenge. */
    handleMCPAuthChallenge(name: string, challenge: MCPAuthChallenge): Promise<MCPServerConfig | undefined>;
    /**
     * Reconnect every configured MCP server and rebind the session's MCP tools.
     *
     * Disconnects all live connections, rediscovers `.mcp.json` configs, and
     * calls `session.refreshMCPTools(...)` so config edits take effect without a
     * restart. Public because `/reload-plugins` reuses it alongside `/mcp reload`
     * and the config-mutation flows in this controller.
     *
     * Discovery options are derived from settings so the reload honors the same
     * opt-outs as startup — notably `mcp.enableProjectConfig: false`, which must
     * keep project `.mcp.json` servers from being started on reload.
     */
    reloadServers(): Promise<void>;
}
