import type { AgentState } from "@oh-my-pi/pi-agent-core";
import type { SessionEntry, SessionHeader } from "../../session/session-entries.js";
import { SessionManager } from "../../session/session-manager.js";
import type { ExportThemeNames } from "./args.js";
export { type ExportThemeNames, parseExportArgs } from "./args.js";
/** Resolve a Bun file-loader value without parsing Windows drive letters as URL schemes. */
export declare function resolveBundledHtmlAssetPath(assetPath: string, moduleDir?: string): string;
/** Compose the standalone export template: minified CSS, tool renderers, and viewer JS inlined. */
export declare function getTemplate(): string;
export interface ExportOptions {
    outputPath?: string;
    /** `"web"` bundles the omp web themes; `"theme"` bundles TUI themes. */
    palette?: "web" | "theme";
    /** Legacy single TUI theme name. Prefer `themeNames` for dual-theme exports. */
    themeName?: string;
    /** Dark and light TUI themes to bundle when `palette` is `"theme"`. */
    themeNames?: ExportThemeNames;
    /** Embed subagent session transcripts found next to the session file (default true). */
    includeSubSessions?: boolean;
}
/**
 * Generate CSS custom properties for one export theme.
 *
 * The single-argument theme-name form remains available to callers that need
 * one TUI palette. Standalone HTML uses `generateThemeStyles()` below.
 */
export declare function generateThemeVars(palette?: "web" | "theme" | (string & {}), themeName?: string): Promise<string>;
/** Generate dark, light, and auto-following CSS rules for a standalone viewer. */
export declare function generateThemeStyles(palette: "web" | "theme", themeNames?: ExportThemeNames, legacyThemeName?: string): Promise<string>;
/** Embedded subagent session transcript, keyed by slash-joined agent path in `SessionData.subSessions`. */
export interface SubSession {
    /** Bare agent id (session file stem), e.g. "ToolAsk". */
    agentId: string;
    /** Key of the parent sub-session, or null when spawned by the main session. */
    parent: string | null;
    header: SessionHeader | null;
    entries: SessionEntry[];
    leafId: string | null;
}
export interface SessionData {
    header: SessionHeader | null;
    entries: SessionEntry[];
    leafId: string | null;
    systemPrompt?: string;
    tools?: {
        name: string;
        description: string;
    }[];
    subSessions?: Record<string, SubSession>;
}
/** Snapshot the session (plus optional agent state) into the JSON shape the viewer renders. */
export declare function buildSessionData(sm: SessionManager, state?: AgentState): SessionData;
/**
 * Collect subagent session transcripts stored next to a session file.
 *
 * A session at `<dir>/<name>.jsonl` keeps its subagent sessions at `<dir>/<name>/<AgentId>.jsonl`;
 * each subagent's own children nest the same way under `<dir>/<name>/<AgentId>/`. Keys in the
 * returned record are slash-joined ids relative to the main session ("ToolAsk", "ToolAsk/Helper").
 * Corrupt or empty files are skipped silently.
 */
export declare function collectSubSessions(sessionFile: string): Promise<Record<string, SubSession>>;
/** Export session to HTML using SessionManager and AgentState. */
export declare function exportSessionToHtml(sm: SessionManager, state?: AgentState, options?: ExportOptions | string): Promise<string>;
/** Export session file to HTML (standalone). */
export declare function exportFromFile(inputPath: string, options?: ExportOptions | string): Promise<string>;
