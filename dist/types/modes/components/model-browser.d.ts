import type { Model } from "@oh-my-pi/pi-ai";
import { type Component, type SgrMouseEvent } from "@oh-my-pi/pi-tui";
import type { Settings } from "../../config/settings.js";
import type { ModelPerfStats } from "../../session/agent-storage.js";
import { type ConfiguredThinkingLevel } from "../../thinking.js";
import { type ThemeColor } from "../theme/theme.js";
/** One selectable row. `selector` is a canonical model key or host-specific virtual key. */
export interface ModelBrowserItem {
    provider: string;
    id: string;
    model: Model;
    selector: string;
    /** Optional foreground color for the row label. */
    labelColor?: ThemeColor;
}
/** Resolved role assignment as displayed by the browser and the hub. */
export interface RoleAssignment {
    model: Model;
    thinkingLevel: ConfiguredThinkingLevel;
    /** True when the role has no configured value and fell back to auto-selection. */
    autoSelected: boolean;
}
/** Map of role id to its resolved assignment (absent roles are unresolved). */
export type RoleAssignments = Record<string, RoleAssignment | undefined>;
/**
 * Resolve every known role to its display assignment: configured role values
 * resolve against `allModels`; unconfigured roles fall back to auto-selection
 * over `autoCandidates` (skipped when empty). Shared by the /models hub and
 * the alt+p session picker.
 */
export declare function resolveRoleAssignments(settings: Settings, allModels: ReadonlyArray<Model>, autoCandidates: ReadonlyArray<Model>): RoleAssignments;
/** Wrap raw models into browser items. */
export declare function buildBrowserItems(models: ReadonlyArray<Model>): ModelBrowserItem[];
/** Options for {@link sortModelItems}. */
export interface SortModelItemsOptions {
    roles?: RoleAssignments;
    mruOrder?: ReadonlyArray<string>;
    /**
     * When a search query is narrowing the list, role assignments should NOT
     * promote a weakly-matching default model above a perfect text match —
     * defer to MRU/version instead so user affinity drives the order.
     */
    skipRoleRank?: boolean;
}
/**
 * Order models for display: role-assigned first, then most-recently-used,
 * then per provider by priority, version, and recency.
 */
export declare function sortModelItems(items: ModelBrowserItem[], options?: SortModelItemsOptions): void;
/** Compact glyph for a configured thinking level; empty for `inherit` (nothing to show). */
export declare function thinkingLevelGlyph(level: ConfiguredThinkingLevel): string;
/**
 * A slim role chip: `● default ◉` — solid dot for configured assignments,
 * hollow for auto-selected fallbacks, thinking glyph attached when set.
 *
 * The space after the status glyph is load-bearing. Under the `nerd` preset
 * these are Nerd Font private-use icons (U+F111 / U+F10C) whose glyphs are
 * drawn two cells wide, while `visibleWidth` counts them as one
 * (`ambiguousIsNarrow: true` in tui/utils.ts — the PUA block is
 * East_Asian_Width=Ambiguous). Without a separator the icon overhangs and
 * eats the label's first character (`● default` renders as `●efault`).
 * Mirrors the spacing already used for `status.success` in model-hub.
 */
export declare function formatRoleChip(role: string, assignment: RoleAssignment, settings: Settings): string;
/** Behavior switches for {@link ModelBrowser}. */
export interface ModelBrowserOptions {
    /** Render the dim `provider/` prefix before model ids. Default true. */
    showProvider?: boolean;
    /** Session token count used to flag models whose context window is exceeded. */
    currentContextTokens?: number;
    /** When true, over-context rows render grayed; picking one compacts first (session-switch mode). */
    markOverContext?: boolean;
    /** Host-provided empty-state text (e.g. provider discovery status). */
    emptyText?: () => string | undefined;
}
/**
 * The reusable browser component. Renders a fixed-height block
 * (`maxVisible + LIST_ROW_START + DETAIL_ROWS` rows) so host mouse geometry
 * stays stable across renders.
 */
export declare class ModelBrowser implements Component {
    #private;
    /** Enter or click-on-selected. */
    onActivate?: (item: ModelBrowserItem) => void;
    onSelectionChange?: (item: ModelBrowserItem | undefined) => void;
    onQueryChange?: (query: string) => void;
    /** Cancel key with an empty query (a non-empty query is cleared first). */
    onCancel?: () => void;
    constructor(settings: Settings, options?: ModelBrowserOptions);
    /** Mark `selector` as the session's active model (undefined clears the mark). */
    setCurrentSelector(selector: string | undefined): void;
    /** Replace the scope's base items; the live query re-applies and selection is pinned by selector. */
    setItems(items: ModelBrowserItem[]): void;
    setRoles(roles: RoleAssignments): void;
    setMruOrder(order: ReadonlyArray<string>): void;
    /** Measured TPS/TTFT averages keyed by `provider/id` selector (see AgentStorage.getModelPerf). */
    setPerfStats(perf: ReadonlyMap<string, ModelPerfStats>): void;
    setMaxVisible(rows: number): void;
    setShowProvider(show: boolean): void;
    /** Keep the source order after fuzzy filtering instead of applying model-specific ranking. */
    setPreserveQueryOrder(preserve: boolean): void;
    /** Allow hosts to toggle context-window flagging between browser modes. */
    setMarkOverContext(mark: boolean): void;
    /** Focused: accent cursor + selected-row background band. Unfocused: dim cursor, no band. */
    setFocused(focused: boolean): void;
    /** Total rendered height for the current `maxVisible` (host layout budgeting). */
    get renderedRows(): number;
    get query(): string;
    setQuery(query: string): void;
    getSelected(): ModelBrowserItem | undefined;
    get visibleCount(): number;
    /** Move selection to `selector`; false when it is not in the current view. */
    selectSelector(selector: string): boolean;
    /** True when `item`'s context window is smaller than the live session token count (grayed row; hosts compact before switching). */
    isOverContext(item: ModelBrowserItem): boolean;
    /**
     * Move the selection by `delta` rows, skipping disabled rows. Single steps
     * wrap at the ends; `wrap: false` (page/home/end jumps) clamps instead.
     */
    moveSelection(delta: number, options?: {
        wrap?: boolean;
    }): void;
    handleInput(data: string): void;
    /** Cancel-key ladder: clear a non-empty query first, then bubble to the host. */
    handleCancel(): void;
    /**
     * Route a mouse event. `line` is relative to the browser's first rendered
     * row (the search row).
     */
    routeMouse(event: SgrMouseEvent, line: number): void;
    /** Drop the hover band. Hosts call this when the pointer leaves the browser pane. */
    clearHover(): void;
    render(width: number): string[];
    invalidate(): void;
}
