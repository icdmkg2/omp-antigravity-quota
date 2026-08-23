/**
 * TUI rendering for MCP tools.
 *
 * Provides structured display of MCP tool calls and results,
 * showing args and output in JSON tree format similar to task tool.
 */
import { type Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import { type Theme } from "../modes/theme/theme.js";
import type { MCPToolDetails } from "./tool-bridge.js";
/**
 * Render MCP tool call.
 */
export declare function renderMCPCall(args: Record<string, unknown>, theme: Theme, label: string): Component;
/**
 * Render MCP tool result.
 */
export declare function renderMCPResult(result: {
    content: Array<{
        type: string;
        text?: string;
    }>;
    details?: MCPToolDetails;
    isError?: boolean;
}, options: RenderResultOptions, theme: Theme, args?: Record<string, unknown>): Component;
