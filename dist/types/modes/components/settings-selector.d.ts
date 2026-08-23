import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Effort } from "@oh-my-pi/pi-ai";
import { type Component, type ImageBudget } from "@oh-my-pi/pi-tui";
import type { ShapeTarget } from "@oh-my-pi/snapcompact";
import { type SettingPath } from "../../config/settings.js";
import type { ContextLineMode, StatusLinePreset, StatusLineSegmentId, StatusLineSeparatorStyle } from "../../config/settings-schema.js";
import { type ComposerPreviewStatusSource } from "./composer-shape-preview.js";
/**
 * Dynamic context for settings that need runtime data.
 * Some settings (like thinking level) are managed by the session, not Settings.
 */
export interface SettingsRuntimeContext {
    /** Available thinking levels (from session) */
    availableThinkingLevels: Effort[];
    /** Current thinking level (from session) */
    thinkingLevel: ThinkingLevel | undefined;
    /** Available themes */
    availableThemes: string[];
    /** Provider/source ids shown in /model. */
    providers: string[];
    /** Working directory for plugins tab */
    cwd: string;
    /** Active model (api + id); resolves what the snapcompact `auto` shape maps to. */
    model?: ShapeTarget;
    /** Shared TUI image budget (graphics ids + transmit-once) for image previews. */
    imageBudget?: ImageBudget;
    /** Schedules a re-render after async preview work completes. */
    requestRender?: () => void;
    /** Live status renderer for composer-shape previews (the session's status line). */
    composerPreviewStatus?: ComposerPreviewStatusSource;
}
/** Status line settings subset for preview */
export interface StatusLinePreviewSettings {
    preset?: StatusLinePreset;
    contextLine?: ContextLineMode;
    leftSegments?: StatusLineSegmentId[];
    rightSegments?: StatusLineSegmentId[];
    separator?: StatusLineSeparatorStyle;
    sessionAccent?: boolean;
    transparent?: boolean;
    compactThinkingLevel?: boolean;
}
export interface SettingsCallbacks {
    /** Called when any setting value changes */
    onChange: (path: SettingPath, newValue: unknown) => void;
    /** Called for theme preview while browsing */
    onThemePreview?: (theme: string) => void | Promise<void>;
    /** Called for status line preview while configuring */
    onStatusLinePreview?: (settings: StatusLinePreviewSettings) => void;
    /** Get current rendered status line for inline preview */
    getStatusLinePreview?: () => string;
    /** Called when plugins change */
    onPluginsChanged?: () => void | Promise<void>;
    /** Called when settings panel is closed */
    onCancel: () => void;
}
/**
 * Main tabbed settings selector component.
 * Uses declarative settings definitions from settings-defs.ts.
 */
export declare class SettingsSelectorComponent implements Component {
    #private;
    private readonly context;
    private readonly callbacks;
    constructor(context: SettingsRuntimeContext, callbacks: SettingsCallbacks);
    invalidate(): void;
    /**
     * Fullscreen frame: title border, tab row, divider, optional search banner,
     * the active content sized to fill the terminal, the appearance preview,
     * then a footer hint pinned above the bottom border.
     */
    render(width: number): readonly string[];
    handleInput(data: string): void;
}
