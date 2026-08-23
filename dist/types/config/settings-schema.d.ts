import { type BlobDestinationId } from "../blob-broker/destinations.js";
import { type CompactionMethod } from "../session/compaction-methods.js";
import { type ImageProvider } from "../tools/image-providers.js";
import { type SearchProviderId } from "../web/search/types.js";
/** Unified settings schema - single source of truth for all settings.
 *
 * Each setting is defined once here with:
 * - Type and default value
 * - Optional UI metadata (label, description, tab, group)
 *
 * UI metadata places the setting in the settings panel: `tab` picks the
 * panel tab, `group` the titled section within it (registered in
 * TAB_GROUPS). Sections render in TAB_GROUPS order; settings within a
 * section keep declaration order.
 *
 * The Settings singleton provides type-safe path-based access:
 *   settings.get("compaction.enabled")  // => boolean
 *   settings.set("theme.dark", "titanium")  // sync, saves in background
 */
export type ModelRoleStorage = "global" | "project";
/** Composer shape id; extensions may register additional values at runtime. */
export type ComposerShape = string;
/** Built-in composer choices and their shared settings/setup copy. */
export declare const BUILTIN_COMPOSER_SHAPES: readonly [{
    readonly value: "box";
    readonly label: "Rounded Box (Default)";
    readonly description: "Status line embedded in top border, compact 2-line prompt";
}, {
    readonly value: "claude";
    readonly label: "Claude Code";
    readonly description: "Full-width horizontal rules above and below, status line at bottom";
}, {
    readonly value: "pi";
    readonly label: "Pi";
    readonly description: "Framed horizontal rules with status line at bottom";
}, {
    readonly value: "borderless";
    readonly label: "Borderless";
    readonly description: "Clean prompt glyph with status line at bottom, no box borders";
}, {
    readonly value: "rule";
    readonly label: "Top Rule Dock";
    readonly description: "Single top rule with status docked onto it and below";
}, {
    readonly value: "field";
    readonly label: "Compact Field";
    readonly description: "Filled one-row field with accent end caps";
}, {
    readonly value: "rail";
    readonly label: "Accent Rail";
    readonly description: "Filled one-row field anchored by a single accent rail";
}];
/** Built-in composer ids used by tests and non-runtime consumers. */
export declare const COMPOSER_SHAPE_VALUES: ("borderless" | "box" | "claude" | "field" | "pi" | "rail" | "rule")[];
export type ContextLineMode = "off" | "percentage" | "annotated" | "embedded";
export declare const CONTEXT_LINE_MODE_VALUES: readonly ["off", "percentage", "annotated", "embedded"];
export type SettingTab = "appearance" | "model" | "interaction" | "context" | "memory" | "files" | "shell" | "tools" | "tasks" | "providers";
/** Tab display metadata - icon is resolved via theme.symbol() */
export type TabMetadata = {
    label: string;
    icon: `tab.${string}`;
};
/** Ordered list of tabs for UI rendering */
export declare const SETTING_TABS: SettingTab[];
/** Tab display metadata - icon is a symbol key from theme.ts (tab.*) */
export declare const TAB_METADATA: Record<SettingTab, {
    label: string;
    icon: `tab.${string}`;
}>;
/**
 * Ordered section groups per tab. Settings declare their section via `ui.group`;
 * the settings UI renders groups in this order with a heading row between them.
 * Ungrouped settings render first, before any section heading.
 */
export declare const TAB_GROUPS: Record<SettingTab, readonly string[]>;
/** Status line segment identifiers */
export type StatusLineSegmentId = "pi" | "model" | "mode" | "path" | "git" | "pr" | "subagents" | "token_in" | "token_out" | "token_total" | "token_rate" | "cost" | "context_pct" | "context_total" | "time_spent" | "time" | "session" | "hostname" | "cache_read" | "cache_write" | "cache_hit" | "session_name" | "usage" | "collab";
/** Submenu choice metadata. */
export type SubmenuOption<V extends string = string> = {
    value: V;
    label: string;
    description?: string;
};
interface UiBase {
    tab: SettingTab;
    /** Section within the tab; must be listed in TAB_GROUPS[tab]. Ungrouped settings render at the top. */
    group?: string;
    label: string;
    description: string;
    /**
     * Risk note. Marks the settings row with a warning glyph and renders above
     * the description in warning styling. For settings that can get the user
     * rate-limited, flagged, or banned — not for merely advanced options.
     */
    warning?: string;
    /** Condition function name - setting only shown when true */
    condition?: string;
}
interface UiBoolean extends UiBase {
}
interface UiEnum<T extends readonly string[]> extends UiBase {
    /** Submenu options. When omitted, the enum renders as an inline toggle derived from `values`. */
    options?: ReadonlyArray<SubmenuOption<T[number]>>;
}
interface UiNumber extends UiBase {
    /** Submenu options. Without options, a numeric setting has no UI representation (intentional hide). */
    options?: ReadonlyArray<SubmenuOption>;
}
interface UiString extends UiBase {
    /** Mask the value in both the settings row and text editor. */
    secret?: boolean;
    /**
     * Submenu options.
     *  - Array  → submenu with these choices.
     *  - "runtime" → submenu populated by the runtime layer (theme registry, etc.).
     *  - Omitted → renders as a free text input.
     */
    options?: ReadonlyArray<SubmenuOption> | "runtime";
}
interface UiArray extends UiBase {
    /** Membership choices. Without options, an array setting has no UI representation (config-file only). */
    options?: ReadonlyArray<SubmenuOption>;
    /** Selection order is meaningful; the editor renders positions and supports reordering. */
    ordered?: boolean;
}
/** Wide ui shape exposed to consumers that walk the schema generically. */
export type AnyUiMetadata = UiBase & {
    options?: ReadonlyArray<SubmenuOption> | "runtime";
    secret?: boolean;
    ordered?: boolean;
};
/**
 * Marks a setting whose value is a credential.
 *
 * Lives at the top level rather than inside `ui` so it can also describe a
 * setting the settings panel never shows and therefore cannot carry
 * `ui.secret`. Read it through `isCredential`, which is the single accessor
 * both the CLI and the settings panel consult.
 */
interface CredentialMarker {
    credential?: true;
}
interface BooleanDef extends CredentialMarker {
    type: "boolean";
    default: boolean | undefined;
    ui?: UiBoolean;
}
interface StringDef extends CredentialMarker {
    type: "string";
    default: string | undefined;
    ui?: UiString;
}
interface NumberDef extends CredentialMarker {
    type: "number";
    default: number | undefined;
    ui?: UiNumber;
}
interface EnumDef<T extends readonly string[]> extends CredentialMarker {
    type: "enum";
    values: T;
    default: T[number];
    ui?: UiEnum<T>;
}
interface ArrayDef<T> extends CredentialMarker {
    type: "array";
    default: T[];
    ui?: UiArray;
}
interface RecordDef<T> extends CredentialMarker {
    type: "record";
    default: Record<string, T>;
    ui?: UiBase;
}
type SettingDef = BooleanDef | StringDef | NumberDef | EnumDef<readonly string[]> | ArrayDef<unknown> | RecordDef<unknown>;
export interface ModelTagDef {
    name: string;
    color?: string;
    /** If true, the role is functional but not shown in the model selector UI. */
    hidden?: boolean;
}
export interface ModelTagsSettings {
    [key: string]: ModelTagDef;
}
export declare const DEFAULT_BASH_INTERCEPTOR_RULES: BashInterceptorRule[];
export declare const SETTINGS_SCHEMA: {
    readonly setupVersion: {
        readonly type: "number";
        readonly default: 0;
    };
    readonly "auth.broker.url": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "auth.broker.token": {
        readonly type: "string";
        readonly default: undefined;
        readonly credential: true;
    };
    readonly autoResume: {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Startup & Updates";
            readonly label: "Auto Resume";
            readonly description: "Automatically resume the most recent session in the current directory";
        };
    };
    readonly "power.sleepPrevention": {
        readonly type: "enum";
        readonly values: readonly ["off", "idle", "display", "system"];
        readonly default: "idle";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Power (macOS)";
            readonly label: "Sleep Prevention";
            readonly description: "Prevent macOS sleep during active sessions. Each level is cumulative — it adds the flags of all lower levels.";
            readonly options: readonly [{
                readonly value: "off";
                readonly label: "Off";
                readonly description: "Do not prevent any sleep";
            }, {
                readonly value: "idle";
                readonly label: "Prevent Idle Sleep";
                readonly description: "Keep the system awake while a session is open (caffeinate -i)";
            }, {
                readonly value: "display";
                readonly label: "Prevent Display Sleep";
                readonly description: "Also keep the display from idle-sleeping (caffeinate -i -d)";
            }, {
                readonly value: "system";
                readonly label: "Prevent System Sleep";
                readonly description: "Also block all system sleep on AC and declare the user active (caffeinate -i -d -s -u)";
            }];
        };
    };
    readonly "advisor.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Advisor";
            readonly label: "Enable Advisor";
            readonly description: "Pair a second model (assigned to the 'advisor' role) that passively reviews each turn and injects notes.";
        };
    };
    readonly "prewalk.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Prewalk";
            readonly label: "Enable Prewalk";
            readonly description: "Start on the active model, then switch to a fast/cheap model (default the 'smol' role) at the first edit/write after the plan nudge's todo list exists — the strong model plans, commits the todos, and starts the implementation before handing off. Overridable per session with --prewalk / --no-prewalk.";
        };
    };
    readonly "advisor.syncBacklog": {
        readonly type: "enum";
        readonly values: readonly ["off", "1", "3", "5"];
        readonly default: "off";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Advisor";
            readonly label: "Advisor Sync Backlog";
            readonly description: "Pause the main agent for up to 30 seconds if the advisor falls behind by this many turns. Off disables catch-up delays.";
            readonly condition: "advisorEnabled";
        };
    };
    readonly "advisor.immuneTurns": {
        readonly type: "number";
        readonly default: 3;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Advisor";
            readonly label: "Advisor Immune Turns";
            readonly description: "After an advisor concern or blocker interrupts, route further concerns/blockers non-interruptingly for this many primary turns.";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "0 turns";
                readonly description: "Allow every concern/blocker to interrupt.";
            }, {
                readonly value: "1";
                readonly label: "1 turn";
            }, {
                readonly value: "2";
                readonly label: "2 turns";
            }, {
                readonly value: "3";
                readonly label: "3 turns";
                readonly description: "Default.";
            }, {
                readonly value: "4";
                readonly label: "4 turns";
            }, {
                readonly value: "5";
                readonly label: "5 turns";
            }];
            readonly condition: "advisorEnabled";
        };
    };
    readonly shellPath: {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "git.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Git";
            readonly label: "Enable Git Integration";
            readonly description: "Show git branch, status, and PR information in the TUI and watch repository metadata.";
        };
    };
    readonly extensions: {
        readonly type: "array";
        readonly default: string[];
    };
    readonly enabledModels: {
        readonly type: "array";
        readonly default: string[];
    };
    readonly disabledProviders: {
        readonly type: "array";
        readonly default: string[];
    };
    readonly "providers.maxInFlightRequests": {
        readonly type: "record";
        readonly default: Record<string, number>;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Max In-Flight Requests";
            readonly description: 'Maximum concurrent LLM requests per provider id (for example "openai" or "anthropic"), shared across local OMP processes with this config root. Omitted providers are unlimited.';
        };
    };
    readonly "providers.openai-codex.codeMode": {
        readonly type: "enum";
        readonly values: readonly ["off", "on", "auto"];
        readonly default: "off";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Codex Code Mode";
            readonly description: "Route Codex code_mode_only models (GPT-5.6) through the eval tool as a programmatic execution surface: the direct tool surface collapses to eval/ask/todo and every other session tool is invoked from eval cells. Mirrors codex-rs Code Mode. 'auto' follows the model catalog flag.";
        };
    };
    readonly "providers.openai-codex.codeModeDirectTools": {
        readonly type: "array";
        readonly default: string[];
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Codex Code Mode Direct Tools";
            readonly description: "Extra tool names to keep directly callable alongside eval/ask/todo when Codex Code Mode is active.";
        };
    };
    readonly disabledExtensions: {
        readonly type: "array";
        readonly default: string[];
    };
    readonly modelRoleStorage: {
        readonly type: "enum";
        readonly values: readonly ["global", "project"];
        readonly default: "global";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Prompt";
            readonly label: "Model Role Storage";
            readonly description: "Where model selector role assignments are saved";
            readonly options: readonly [{
                readonly value: "global";
                readonly label: "Global";
                readonly description: "Save role models in the active profile config (current behavior)";
            }, {
                readonly value: "project";
                readonly label: "Per-project";
                readonly description: "Save project role models in .omp/config.yml; missing project roles use global defaults";
            }];
        };
    };
    readonly modelRoles: {
        readonly type: "record";
        readonly default: Record<string, string>;
    };
    readonly modelTags: {
        readonly type: "record";
        readonly default: ModelTagsSettings;
    };
    readonly modelProviderOrder: {
        readonly type: "array";
        readonly default: string[];
    };
    readonly cycleOrder: {
        readonly type: "array";
        readonly default: string[];
    };
    readonly "theme.dark": {
        readonly type: "string";
        readonly default: "titanium";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Theme";
            readonly label: "Dark Theme";
            readonly description: "Theme used when the terminal has a dark background";
            readonly options: "runtime";
        };
    };
    readonly "theme.light": {
        readonly type: "string";
        readonly default: "light";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Theme";
            readonly label: "Light Theme";
            readonly description: "Theme used when the terminal has a light background";
            readonly options: "runtime";
        };
    };
    readonly symbolPreset: {
        readonly type: "enum";
        readonly values: readonly ["unicode", "nerd", "ascii"];
        readonly default: "unicode";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Theme";
            readonly label: "Symbol Preset";
            readonly description: "Glyph set for icons and symbols (Unicode, Nerd Font, or ASCII)";
            readonly options: readonly [{
                readonly value: "unicode";
                readonly label: "Unicode";
                readonly description: "Standard symbols (default)";
            }, {
                readonly value: "nerd";
                readonly label: "Nerd Font";
                readonly description: "Requires Nerd Font";
            }, {
                readonly value: "ascii";
                readonly label: "ASCII";
                readonly description: "Maximum compatibility";
            }];
        };
    };
    readonly colorBlindMode: {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Theme";
            readonly label: "Color-Blind Mode";
            readonly description: "Use blue instead of green for diff additions";
        };
    };
    readonly "composer.shape": {
        readonly type: "string";
        readonly default: "box";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Composer";
            readonly label: "Composer Shape";
            readonly description: "Visual layout of the input editor and status line";
            readonly options: "runtime";
        };
    };
    readonly "statusLine.preset": {
        readonly type: "enum";
        readonly values: readonly ["default", "minimal", "compact", "full", "nerd", "ascii", "custom"];
        readonly default: "default";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Status Line";
            readonly label: "Status Line Preset";
            readonly description: "Pre-built status line configurations";
            readonly options: readonly [{
                readonly value: "default";
                readonly label: "Default";
                readonly description: "Model, path, git, context, tokens, cost";
            }, {
                readonly value: "minimal";
                readonly label: "Minimal";
                readonly description: "Path and git only";
            }, {
                readonly value: "compact";
                readonly label: "Compact";
                readonly description: "Model, git, cost, context";
            }, {
                readonly value: "full";
                readonly label: "Full";
                readonly description: "All segments including time";
            }, {
                readonly value: "nerd";
                readonly label: "Nerd";
                readonly description: "Maximum info with Nerd Font icons";
            }, {
                readonly value: "ascii";
                readonly label: "ASCII";
                readonly description: "No special characters";
            }, {
                readonly value: "custom";
                readonly label: "Custom";
                readonly description: "User-defined segments";
            }];
        };
    };
    readonly "statusLine.separator": {
        readonly type: "enum";
        readonly values: readonly ["powerline", "powerline-thin", "slash", "pipe", "block", "none", "ascii"];
        readonly default: "powerline-thin";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Status Line";
            readonly label: "Status Line Separator";
            readonly description: "Style of separators between segments";
            readonly options: readonly [{
                readonly value: "powerline";
                readonly label: "Powerline";
                readonly description: "Solid arrows (Nerd Font)";
            }, {
                readonly value: "powerline-thin";
                readonly label: "Thin chevron";
                readonly description: "Thin arrows (Nerd Font)";
            }, {
                readonly value: "slash";
                readonly label: "Slash";
                readonly description: "Forward slashes";
            }, {
                readonly value: "pipe";
                readonly label: "Pipe";
                readonly description: "Vertical pipes";
            }, {
                readonly value: "block";
                readonly label: "Block";
                readonly description: "Solid blocks";
            }, {
                readonly value: "none";
                readonly label: "None";
                readonly description: "Space only";
            }, {
                readonly value: "ascii";
                readonly label: "ASCII";
                readonly description: "Greater-than signs";
            }];
        };
    };
    readonly "statusLine.contextLine": {
        readonly type: "enum";
        readonly values: readonly ["off", "percentage", "annotated", "embedded"];
        readonly default: "embedded";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Status Line";
            readonly label: "Context-Reactive Line";
            readonly description: "How the line between the left and right segments reflects context usage (box composer only)";
            readonly options: readonly [{
                readonly value: "off";
                readonly label: "Off";
                readonly description: "Solid accent line, no context feedback";
            }, {
                readonly value: "percentage";
                readonly label: "Percentage";
                readonly description: "Used portion in accent color, remainder dimmed";
            }, {
                readonly value: "annotated";
                readonly label: "Annotated";
                readonly description: "Percentage plus ticks at the speculative and auto-compaction boundaries";
            }, {
                readonly value: "embedded";
                readonly label: "Embedded";
                readonly description: "Annotated line with the context percentage and window embedded in the gauge";
            }];
        };
    };
    readonly "statusLine.sessionAccent": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Status Line";
            readonly label: "Session Accent";
            readonly description: "Use the session name color for the editor border and status line gap";
        };
    };
    readonly "statusLine.transparent": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Status Line";
            readonly label: "Transparent Status Line";
            readonly description: "Use the terminal's default background for the status line instead of the theme's `statusLineBg`. Powerline end caps are dropped because they need a contrasting fill to bridge into the surrounding terminal.";
        };
    };
    readonly "statusLine.compactThinkingLevel": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Status Line";
            readonly label: "Compact Thinking Level";
            readonly description: "Show the thinking level as a single icon on the model name instead of a separate ` · <level>` suffix.";
        };
    };
    readonly "tools.artifactSpillThreshold": {
        readonly type: "number";
        readonly default: 50;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Output Limits";
            readonly label: "Artifact Spill Threshold (KB)";
            readonly description: "Tool output above this size is saved as an artifact; tail is kept inline";
            readonly options: readonly [{
                readonly value: "1";
                readonly label: "1 KB";
                readonly description: "~250 tokens";
            }, {
                readonly value: "2.5";
                readonly label: "2.5 KB";
                readonly description: "~625 tokens";
            }, {
                readonly value: "5";
                readonly label: "5 KB";
                readonly description: "~1.25K tokens";
            }, {
                readonly value: "10";
                readonly label: "10 KB";
                readonly description: "~2.5K tokens";
            }, {
                readonly value: "20";
                readonly label: "20 KB";
                readonly description: "~5K tokens";
            }, {
                readonly value: "30";
                readonly label: "30 KB";
                readonly description: "~7.5K tokens";
            }, {
                readonly value: "50";
                readonly label: "50 KB";
                readonly description: "Default; ~12.5K tokens";
            }, {
                readonly value: "75";
                readonly label: "75 KB";
                readonly description: "~19K tokens";
            }, {
                readonly value: "100";
                readonly label: "100 KB";
                readonly description: "~25K tokens";
            }, {
                readonly value: "200";
                readonly label: "200 KB";
                readonly description: "~50K tokens";
            }, {
                readonly value: "500";
                readonly label: "500 KB";
                readonly description: "~125K tokens";
            }, {
                readonly value: "1000";
                readonly label: "1 MB";
                readonly description: "~250K tokens";
            }];
        };
    };
    readonly "tools.artifactTailBytes": {
        readonly type: "number";
        readonly default: 20;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Output Limits";
            readonly label: "Artifact Tail Size (KB)";
            readonly description: "Amount of tail content kept inline when output spills to artifact";
            readonly options: readonly [{
                readonly value: "1";
                readonly label: "1 KB";
                readonly description: "~250 tokens";
            }, {
                readonly value: "2.5";
                readonly label: "2.5 KB";
                readonly description: "~625 tokens";
            }, {
                readonly value: "5";
                readonly label: "5 KB";
                readonly description: "~1.25K tokens";
            }, {
                readonly value: "10";
                readonly label: "10 KB";
                readonly description: "~2.5K tokens";
            }, {
                readonly value: "20";
                readonly label: "20 KB";
                readonly description: "Default; ~5K tokens";
            }, {
                readonly value: "50";
                readonly label: "50 KB";
                readonly description: "~12.5K tokens";
            }, {
                readonly value: "100";
                readonly label: "100 KB";
                readonly description: "~25K tokens";
            }, {
                readonly value: "200";
                readonly label: "200 KB";
                readonly description: "~50K tokens";
            }];
        };
    };
    readonly "tools.artifactHeadBytes": {
        readonly type: "number";
        readonly default: 20;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Output Limits";
            readonly label: "Artifact Head Size (KB)";
            readonly description: "Amount of head content kept inline alongside the tail when output spills to artifact (middle elision). 0 disables — keep tail only.";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "0 KB";
                readonly description: "Disabled; tail-only truncation";
            }, {
                readonly value: "1";
                readonly label: "1 KB";
                readonly description: "~250 tokens";
            }, {
                readonly value: "2.5";
                readonly label: "2.5 KB";
                readonly description: "~625 tokens";
            }, {
                readonly value: "5";
                readonly label: "5 KB";
                readonly description: "~1.25K tokens";
            }, {
                readonly value: "10";
                readonly label: "10 KB";
                readonly description: "~2.5K tokens";
            }, {
                readonly value: "20";
                readonly label: "20 KB";
                readonly description: "Default; ~5K tokens";
            }, {
                readonly value: "50";
                readonly label: "50 KB";
                readonly description: "~12.5K tokens";
            }, {
                readonly value: "100";
                readonly label: "100 KB";
                readonly description: "~25K tokens";
            }, {
                readonly value: "200";
                readonly label: "200 KB";
                readonly description: "~50K tokens";
            }];
        };
    };
    readonly "tools.outputMaxColumns": {
        readonly type: "number";
        readonly default: 768;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Output Limits";
            readonly label: "Output Column Cap";
            readonly description: "Per-line byte cap for streaming tool outputs (bash, python, js eval) and `read`. Lines wider than this are ellipsis-truncated; remaining bytes up to the next newline are dropped. 0 disables.";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "Off";
                readonly description: "No per-line cap";
            }, {
                readonly value: "256";
                readonly label: "256";
                readonly description: "Tight";
            }, {
                readonly value: "512";
                readonly label: "512";
            }, {
                readonly value: "768";
                readonly label: "768";
                readonly description: "Default";
            }, {
                readonly value: "1024";
                readonly label: "1024";
            }, {
                readonly value: "2048";
                readonly label: "2048";
            }, {
                readonly value: "4096";
                readonly label: "4096";
                readonly description: "Loose";
            }];
        };
    };
    readonly "tools.artifactTailLines": {
        readonly type: "number";
        readonly default: 500;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Output Limits";
            readonly label: "Artifact Tail Lines";
            readonly description: "Maximum lines of tail content kept inline when output spills to artifact";
            readonly options: readonly [{
                readonly value: "50";
                readonly label: "50 lines";
                readonly description: "~250 tokens";
            }, {
                readonly value: "100";
                readonly label: "100 lines";
                readonly description: "~500 tokens";
            }, {
                readonly value: "250";
                readonly label: "250 lines";
                readonly description: "~1.25K tokens";
            }, {
                readonly value: "500";
                readonly label: "500 lines";
                readonly description: "Default; ~2.5K tokens";
            }, {
                readonly value: "1000";
                readonly label: "1000 lines";
                readonly description: "~5K tokens";
            }, {
                readonly value: "2000";
                readonly label: "2000 lines";
                readonly description: "~10K tokens";
            }, {
                readonly value: "5000";
                readonly label: "5000 lines";
                readonly description: "~25K tokens";
            }];
        };
    };
    readonly "statusLine.showHookStatus": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Status Line";
            readonly label: "Show Hook Status";
            readonly description: "Display hook status messages below the status line";
        };
    };
    readonly "statusLine.leftSegments": {
        readonly type: "array";
        readonly default: StatusLineSegmentId[];
    };
    readonly "statusLine.rightSegments": {
        readonly type: "array";
        readonly default: StatusLineSegmentId[];
    };
    readonly "statusLine.segmentOptions": {
        readonly type: "record";
        readonly default: Record<string, unknown>;
    };
    readonly "terminal.showImages": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Images";
            readonly label: "Show Inline Images";
            readonly description: "Render images inline in the terminal";
            readonly condition: "hasImageProtocol";
        };
    };
    readonly "images.autoResize": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Images";
            readonly label: "Auto-Resize Images";
            readonly description: "Resize large images to 2000x2000 max for better model compatibility";
        };
    };
    readonly "images.blockImages": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Images";
            readonly label: "Block Images";
            readonly description: "Prevent images from being sent to LLM providers";
        };
    };
    readonly "images.describeForTextModels": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Vision";
            readonly label: "Describe Images for Text Models";
            readonly description: "When an image is attached to a model without vision support, save it under local:// and inject a description from a vision-capable model instead of dropping it";
        };
    };
    readonly "images.urls.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Vision";
            readonly label: "Serve Images as URLs";
            readonly description: "Publish outgoing images through the configured backend chain and send URL-fetching providers short URLs instead of inline base64. Falls back to inline automatically when every backend or a provider fetch fails";
        };
    };
    readonly "images.urls.backends": {
        readonly type: "array";
        readonly default: BlobDestinationId[];
        readonly ui: {
            readonly tab: "model";
            readonly group: "Vision";
            readonly label: "Image URL Backends";
            readonly description: "Ordered destinations tried when publishing images for provider access";
            readonly options: {
                value: "0x0" | "amazon-s3" | "azure-storage" | "backblaze-b2" | "bore" | "box" | "catbox" | "chevereto" | "cloudflared" | "command" | "custom-file-uploader" | "custom-image-uploader" | "devtunnel" | "direct" | "discord" | "dropbox" | "email" | "file-uploader" | "flickr" | "ftp" | "garage" | "google-cloud-storage" | "google-drive" | "imageshack" | "imgur" | "lambda" | "litterbox" | "lobfile" | "localhost-run" | "localhostr" | "mediafire" | "minio" | "named-cloudflared" | "ngrok" | "onedrive" | "owncloud" | "photobucket" | "pinggy" | "plik" | "pomf" | "provider-files" | "pushbullet" | "puush" | "r2" | "s-ul" | "seafile" | "sendspace" | "shared-folder" | "ssh" | "streamable" | "tailscale" | "tigris" | "tmpfiles" | "transfer-sh" | "uguu" | "vault" | "vgyme" | "youtube" | "zrok";
                label: string;
                description: string;
            }[];
            readonly ordered: true;
        };
    };
    readonly "images.urls.options": {
        readonly type: "record";
        readonly default: Partial<Record<BlobDestinationId, Record<string, unknown>>>;
    };
    readonly "images.urls.credentials": {
        readonly type: "record";
        readonly default: Partial<Record<BlobDestinationId, Record<string, string>>>;
        readonly credential: true;
    };
    readonly "images.urls.command": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Vision";
            readonly label: "Image Upload Command";
            readonly description: "Argv template for the command backend; {file} is the image path, {mime}/{ext} optional. The last URL printed on stdout is used (e.g. pasta -b -f {file})";
        };
    };
    readonly "images.urls.publicBaseUrl": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Vision";
            readonly label: "Image URL Public Base";
            readonly description: "Externally reachable base URL fronting the blob server (required for ssh, optional for direct)";
        };
    };
    readonly "images.urls.ttlHours": {
        readonly type: "number";
        readonly default: 72;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Vision";
            readonly label: "Image URL Lifetime (hours)";
            readonly description: "Serving window for locally hosted image URLs, measured from the last time a conversation sent them; resuming a conversation re-arms the window at the same link. 0 keeps links alive while the broker runs";
        };
    };
    readonly "images.urls.bindHost": {
        readonly type: "string";
        readonly default: "127.0.0.1";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Vision";
            readonly label: "Image URL Bind Host";
            readonly description: "Host the blob server binds to; loopback for tunnels, 0.0.0.0 for direct serving";
        };
    };
    readonly "images.urls.sshTarget": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Vision";
            readonly label: "Image URL SSH Target";
            readonly description: "user@host destination for the ssh reverse forward";
        };
    };
    readonly "images.urls.sshRemotePort": {
        readonly type: "number";
        readonly default: 8787;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Vision";
            readonly label: "Image URL SSH Remote Port";
            readonly description: "Remote listen port of the ssh reverse forward that your web server proxies to";
        };
    };
    readonly "tui.maxInlineImageColumns": {
        readonly type: "number";
        readonly default: 100;
        readonly description: "Maximum width in terminal columns for inline images (default 100). Set to 0 for unlimited (bounded only by terminal width).";
    };
    readonly "tui.maxInlineImageRows": {
        readonly type: "number";
        readonly default: 20;
        readonly description: "Maximum height in terminal rows for inline images (default 20). Set to 0 to use only the viewport-based limit (60% of terminal height).";
    };
    readonly "tui.maxInlineImages": {
        readonly type: "number";
        readonly default: 8;
        readonly description: "Maximum number of inline images kept as live terminal graphics (default 8). Older images fall back to a text placeholder via a full redraw once the limit is exceeded. Set to 0 to keep every image (no limit).";
    };
    readonly "tui.resizeScrollback": {
        readonly type: "enum";
        readonly values: readonly ["append", "rebuild", "preserve"];
        readonly default: "rebuild";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Resize Scrollback";
            readonly description: "How a settled terminal resize refreshes transcript rows retained in terminal scrollback";
            readonly options: readonly [{
                readonly value: "append";
                readonly label: "Append";
                readonly description: "Replay the transcript at the new width below retained history";
            }, {
                readonly value: "rebuild";
                readonly label: "Rebuild";
                readonly description: "Erase all terminal scrollback, then replay one current-width transcript";
            }, {
                readonly value: "preserve";
                readonly label: "Preserve";
                readonly description: "Repaint only the viewport and keep history wrapped at its old width";
            }];
        };
    };
    readonly "terminal.showProgress": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Native Terminal Progress";
            readonly description: "Emit OSC 9;4 indeterminate progress while the agent or context maintenance is running";
        };
    };
    readonly "tui.textSizing": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Large Headings (Kitty)";
            readonly description: "Render Markdown H1 headings at 2x scale using Kitty's OSC 66 text-sizing protocol. Only takes effect on Kitty terminals; ignored everywhere else. Off by default.";
        };
    };
    readonly "tui.renderMermaid": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Render Mermaid Diagrams";
            readonly description: "Render Mermaid fenced code blocks as ASCII diagrams";
        };
    };
    readonly "tui.codexResetFireworks": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Codex Reset Fireworks";
            readonly description: "Celebrate unscheduled Codex weekly usage resets and newly banked saved resets with a top-third fireworks overlay that remains until Escape";
        };
    };
    readonly "tui.titleState": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Terminal Title Run State";
            readonly description: "Show the agent run state in the terminal title's separator — an animated spinner while working (a static ':' on Windows), '>' when it's your turn, '!' when the agent is waiting on you";
        };
    };
    readonly "tui.hyperlinks": {
        readonly type: "enum";
        readonly values: readonly ["off", "auto", "always"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Terminal Hyperlinks";
            readonly description: "Wrap paths and URLs in OSC 8 hyperlinks for terminal-native click-to-open (auto: detect support; off: never; always: unconditional)";
        };
    };
    readonly "tui.tight": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Tight Layout";
            readonly description: "Remove the 1-character horizontal padding from the left and right of the terminal output";
        };
    };
    readonly "display.shimmer": {
        readonly type: "enum";
        readonly values: readonly ["classic", "kitt", "disabled"];
        readonly default: "classic";
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Shimmer";
            readonly description: "Animation style for working/loading messages";
            readonly options: readonly [{
                readonly value: "classic";
                readonly label: "Classic";
                readonly description: "Soft cosine wave sweeping across the text";
            }, {
                readonly value: "kitt";
                readonly label: "KITT Scanner";
                readonly description: "Knight Rider 1982 red light bouncing left-right";
            }, {
                readonly value: "disabled";
                readonly label: "Disabled";
                readonly description: "No animation; static muted text";
            }];
        };
    };
    readonly "display.smoothStreaming": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Smooth Streaming";
            readonly description: "Reveal assistant text and streamed tool input smoothly while chunks arrive";
        };
    };
    readonly "display.hideToolActivity": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Hide Tool Activity";
            readonly description: "Hide model-initiated tool calls and results from the transcript";
        };
    };
    readonly "display.showTokenUsage": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Show Token Usage";
            readonly description: "Show per-turn token usage on assistant messages";
        };
    };
    readonly "display.cacheMissMarker": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Cache Miss Marker";
            readonly description: "Show a divider above an assistant turn whose request lost (missed) the prompt cache";
        };
    };
    readonly "display.collapseCompacted": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Collapse Compacted History";
            readonly description: "Collapse pre-compaction history behind the summary divider on the live transcript; disable to keep the full transcript inline with dividers at each compaction point";
        };
    };
    readonly showHardwareCursor: {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Show Hardware Cursor";
            readonly description: "Show terminal cursor for IME support";
        };
    };
    readonly "tui.imeSafeCursor": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "IME-Safe Prompt Layout";
            readonly description: "Move the prompt's bottom border to a separate row so macOS IME preedit cannot displace it";
        };
    };
    readonly defaultThinkingLevel: {
        readonly type: "enum";
        readonly values: readonly [...import("@oh-my-pi/pi-catalog").Effort[], "auto"];
        readonly default: "high";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Thinking Level";
            readonly description: "Reasoning depth for thinking-capable models";
            readonly options: readonly [import("../thinking.js").ConfiguredThinkingLevelMetadata, ...import("../thinking.js").ThinkingLevelMetadata[]];
        };
    };
    readonly hideThinkingBlock: {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Hide Thinking Blocks";
            readonly description: "Hide thinking blocks in assistant responses";
        };
    };
    readonly proseOnlyThinking: {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Prose Only Thinking";
            readonly description: "Omit code blocks from thinking summaries and replace them with an ellipsis";
        };
    };
    readonly omitThinking: {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Omit Thinking summaries";
            readonly description: "Instruct upstream providers to completely omit thinking summaries from responses (where supported)";
        };
    };
    readonly externalThinking: {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "External Thinking";
            readonly description: "Private scratchpad; not shown to user. Disables supported GPT, Claude, and Gemini reasoning";
            readonly warning: "At your own risk: providers have flagged this request shape as abuse, up to account-level enforcement";
        };
    };
    readonly "model.loopGuard.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Loop Guard";
            readonly description: "Enable automatic stream loop detection for model reasoning and prose";
        };
    };
    readonly "model.loopGuard.checkAssistantContent": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Loop Guard Scan Prose";
            readonly description: "Apply loop guard to assistant prose messages in addition to thinking logs";
        };
    };
    readonly "model.loopGuard.toolCallReminder": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Loop Guard Tool-Call Reminder";
            readonly description: "When a Gemini reasoning stream emits many consecutive planning headers without calling a tool, interrupt it and inject a reminder to issue a tool call (requires Loop Guard)";
        };
    };
    readonly "model.toolCallLoopGuard.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Tool-Call Loop Guard";
            readonly description: "Detect consecutive identical tool calls across turns and inject a corrective steer";
        };
    };
    readonly "model.toolCallLoopGuard.threshold": {
        readonly type: "number";
        readonly default: 5;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Tool-Call Loop Threshold";
            readonly description: "Consecutive identical tool calls required before the corrective steer is injected";
        };
    };
    readonly "model.toolCallLoopGuard.exemptTools": {
        readonly type: "array";
        readonly default: string[];
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Tool-Call Loop Exempt Tools";
            readonly description: "Tool names that may repeat consecutively without triggering the cross-turn loop guard";
        };
    };
    readonly inlineToolDescriptors: {
        readonly type: "enum";
        readonly values: readonly ["auto", "on", "off"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Prompt";
            readonly label: "Inline Tool Descriptors";
            readonly description: "Render full tool descriptors in the system prompt and strip top-level/nested descriptions from provider tool schemas so descriptor text is sent once. Auto enables this for Gemini models and disables it otherwise";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Inline descriptors for Gemini models; keep them in tool schemas otherwise";
            }, {
                readonly value: "on";
                readonly label: "On";
                readonly description: "Always inline descriptors in the system prompt";
            }, {
                readonly value: "off";
                readonly label: "Off";
                readonly description: "Keep descriptors in provider tool schemas only";
            }];
        };
    };
    readonly includeModelInPrompt: {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Prompt";
            readonly label: "Include Model in Prompt";
            readonly description: "Surface the active model identifier in the system prompt so the agent knows which model it is";
        };
    };
    readonly includeWorkspaceTree: {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Prompt";
            readonly label: "Include Workspace Tree";
            readonly description: "Render the workspace directory tree in the system prompt. WARNING: This can bust prompt caching across sessions when files are modified.";
        };
    };
    readonly "workspace.additionalDirectories": {
        readonly type: "array";
        readonly default: string[];
        readonly ui: {
            readonly tab: "context";
            readonly group: "General";
            readonly label: "Additional Workspace Dirs";
            readonly description: "Extra workspace directories added to every session as additional roots (multi-root workspace). Managed live via /add-dir and /remove-dir. Paths resolve relative to cwd; absolute paths recommended. The agent is told these roots exist and can read/grep/glob them.";
        };
    };
    readonly personality: {
        readonly type: "enum";
        readonly values: readonly ["default", "friendly", "pragmatic", "none"];
        readonly default: "default";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Prompt";
            readonly label: "Personality";
            readonly description: "Communication style rendered into the system prompt's personality block";
            readonly options: readonly [{
                readonly value: "default";
                readonly label: "Default";
                readonly description: "Terse, evidence-first engineer; dense, action-oriented replies";
            }, {
                readonly value: "friendly";
                readonly label: "Friendly";
                readonly description: "Warm, encouraging collaborator focused on momentum and morale";
            }, {
                readonly value: "pragmatic";
                readonly label: "Pragmatic";
                readonly description: "Direct, efficient engineer focused on clarity and rigor";
            }, {
                readonly value: "none";
                readonly label: "None";
                readonly description: "Omit the personality block entirely";
            }];
        };
    };
    readonly temperature: {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Temperature";
            readonly description: "Sampling temperature (0 = deterministic, 1 = creative, -1 = provider default)";
            readonly options: readonly [{
                readonly value: "-1";
                readonly label: "Default";
                readonly description: "Use provider default";
            }, {
                readonly value: "0";
                readonly label: "0";
                readonly description: "Deterministic";
            }, {
                readonly value: "0.2";
                readonly label: "0.2";
                readonly description: "Focused";
            }, {
                readonly value: "0.5";
                readonly label: "0.5";
                readonly description: "Balanced";
            }, {
                readonly value: "0.7";
                readonly label: "0.7";
                readonly description: "Creative";
            }, {
                readonly value: "1";
                readonly label: "1";
                readonly description: "Maximum variety";
            }];
        };
    };
    readonly topP: {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Top P";
            readonly description: "Nucleus sampling cutoff (0-1, -1 = provider default)";
            readonly options: readonly [{
                readonly value: "-1";
                readonly label: "Default";
                readonly description: "Use provider default";
            }, {
                readonly value: "0.1";
                readonly label: "0.1";
                readonly description: "Very focused";
            }, {
                readonly value: "0.3";
                readonly label: "0.3";
                readonly description: "Focused";
            }, {
                readonly value: "0.5";
                readonly label: "0.5";
                readonly description: "Balanced";
            }, {
                readonly value: "0.9";
                readonly label: "0.9";
                readonly description: "Broad";
            }, {
                readonly value: "1";
                readonly label: "1";
                readonly description: "No nucleus filtering";
            }];
        };
    };
    readonly topK: {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Top K";
            readonly description: "Sample from top-K tokens (-1 = provider default)";
            readonly options: readonly [{
                readonly value: "-1";
                readonly label: "Default";
                readonly description: "Use provider default";
            }, {
                readonly value: "1";
                readonly label: "1";
                readonly description: "Greedy top token";
            }, {
                readonly value: "20";
                readonly label: "20";
                readonly description: "Focused";
            }, {
                readonly value: "40";
                readonly label: "40";
                readonly description: "Balanced";
            }, {
                readonly value: "100";
                readonly label: "100";
                readonly description: "Broad";
            }];
        };
    };
    readonly minP: {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Min P";
            readonly description: "Minimum probability threshold (0-1, -1 = provider default)";
            readonly options: readonly [{
                readonly value: "-1";
                readonly label: "Default";
                readonly description: "Use provider default";
            }, {
                readonly value: "0.01";
                readonly label: "0.01";
                readonly description: "Very permissive";
            }, {
                readonly value: "0.05";
                readonly label: "0.05";
                readonly description: "Balanced";
            }, {
                readonly value: "0.1";
                readonly label: "0.1";
                readonly description: "Strict";
            }];
        };
    };
    readonly presencePenalty: {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Presence Penalty";
            readonly description: "Penalty for introducing already-present tokens (-1 = provider default)";
            readonly options: readonly [{
                readonly value: "-1";
                readonly label: "Default";
                readonly description: "Use provider default";
            }, {
                readonly value: "0";
                readonly label: "0";
                readonly description: "No penalty";
            }, {
                readonly value: "0.5";
                readonly label: "0.5";
                readonly description: "Mild novelty";
            }, {
                readonly value: "1";
                readonly label: "1";
                readonly description: "Encourage novelty";
            }, {
                readonly value: "2";
                readonly label: "2";
                readonly description: "Strong novelty";
            }];
        };
    };
    readonly repetitionPenalty: {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Repetition Penalty";
            readonly description: "Penalty for repeated tokens (-1 = provider default)";
            readonly options: readonly [{
                readonly value: "-1";
                readonly label: "Default";
                readonly description: "Use provider default";
            }, {
                readonly value: "0.8";
                readonly label: "0.8";
                readonly description: "Allow repetition";
            }, {
                readonly value: "1";
                readonly label: "1";
                readonly description: "No penalty";
            }, {
                readonly value: "1.1";
                readonly label: "1.1";
                readonly description: "Mild penalty";
            }, {
                readonly value: "1.2";
                readonly label: "1.2";
                readonly description: "Balanced";
            }, {
                readonly value: "1.5";
                readonly label: "1.5";
                readonly description: "Strong penalty";
            }];
        };
    };
    readonly textVerbosity: {
        readonly type: "enum";
        readonly values: readonly ["low", "medium", "high"];
        readonly default: "medium";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Text Verbosity";
            readonly description: "OpenAI Responses and Codex response verbosity (low, medium, or high)";
            readonly options: readonly [{
                readonly value: "low";
                readonly label: "Low";
                readonly description: "Prefer concise responses";
            }, {
                readonly value: "medium";
                readonly label: "Medium";
                readonly description: "Balance brevity and detail (default)";
            }, {
                readonly value: "high";
                readonly label: "High";
                readonly description: "Prefer detailed responses";
            }];
        };
    };
    readonly "tier.openai": {
        readonly type: "enum";
        readonly values: readonly ["none", "auto", "default", "flex", "scale", "priority"];
        readonly default: "none";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Service Tier — OpenAI";
            readonly description: "Processing tier for OpenAI / OpenAI-Codex requests, and OpenAI-family models routed via OpenRouter (none = omit). Sent as `service_tier`.";
            readonly options: readonly SubmenuOption<"auto" | "default" | "flex" | "none" | "priority" | "scale">[];
        };
    };
    readonly "tier.anthropic": {
        readonly type: "enum";
        readonly values: readonly ["none", "priority"];
        readonly default: "none";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Service Tier — Anthropic";
            readonly description: 'Processing tier for Claude requests. `priority` realizes fast mode (`speed: "fast"`) on supported direct Anthropic models; ignored on Bedrock/Vertex Claude and via OpenRouter.';
            readonly options: readonly SubmenuOption<"none" | "priority">[];
        };
    };
    readonly "tier.google": {
        readonly type: "enum";
        readonly values: readonly ["none", "flex", "priority"];
        readonly default: "none";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Service Tier — Google";
            readonly description: "Processing tier for Gemini (Google AI Studio + Vertex) requests, and Google-family models routed via OpenRouter (none = omit). Sent as the top-level `serviceTier` field.";
            readonly options: readonly SubmenuOption<"flex" | "none" | "priority">[];
        };
    };
    readonly "tier.subagent": {
        readonly type: "enum";
        readonly values: readonly ["inherit", "none", "auto", "default", "flex", "scale", "priority"];
        readonly default: "inherit";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Service Tier — Subagent";
            readonly description: "Service Tier for spawned task/eval subagents. Inherit = match the main agent's live per-family tiers (tracks /fast); pick a value to apply it to whichever family the subagent's model belongs to.";
            readonly options: readonly SubmenuOption<"auto" | "default" | "flex" | "inherit" | "none" | "priority" | "scale">[];
        };
    };
    readonly "tier.advisor": {
        readonly type: "enum";
        readonly values: readonly ["inherit", "none", "auto", "default", "flex", "scale", "priority"];
        readonly default: "none";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Sampling";
            readonly label: "Service Tier — Advisor";
            readonly description: "Service Tier for the advisor model. None = standard processing; Inherit = match the main agent's live per-family tiers; pick a value to apply it to the advisor model's family.";
            readonly options: readonly SubmenuOption<"auto" | "default" | "flex" | "inherit" | "none" | "priority" | "scale">[];
            readonly condition: "advisorEnabled";
        };
    };
    readonly "retry.enabled": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "retry.maxRetries": {
        readonly type: "number";
        readonly default: 10;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Retry & Fallback";
            readonly label: "Retry Attempts";
            readonly description: "Maximum retry attempts on API errors";
            readonly options: readonly [{
                readonly value: "1";
                readonly label: "1 retry";
            }, {
                readonly value: "2";
                readonly label: "2 retries";
            }, {
                readonly value: "3";
                readonly label: "3 retries";
            }, {
                readonly value: "5";
                readonly label: "5 retries";
            }, {
                readonly value: "10";
                readonly label: "10 retries";
            }];
        };
    };
    readonly "retry.baseDelayMs": {
        readonly type: "number";
        readonly default: 500;
    };
    readonly "retry.maxDelayMs": {
        readonly type: "number";
        readonly default: number;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Retry & Fallback";
            readonly label: "Max Retry Delay";
            readonly description: "Maximum wait between retries, in ms. When the provider asks us to wait longer than this and no credential or model fallback succeeds, the request fails fast instead of sleeping (e.g. 3-hour Anthropic rate-limit windows).";
        };
    };
    readonly "retry.modelFallback": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Retry & Fallback";
            readonly label: "Retry Model Fallback";
            readonly description: "Allow retry recovery to switch to configured fallback models";
        };
    };
    readonly "retry.usageAwareFallback": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Retry & Fallback";
            readonly label: "Usage-Aware Fallback";
            readonly description: "Use reliable coding-plan quota reports to prefer same-provider accounts, then configured fallback models, before a hard usage limit. Ordinary configured API keys are excluded.";
        };
    };
    readonly "retry.usageReservePct": {
        readonly type: "number";
        readonly default: 10;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Retry & Fallback";
            readonly label: "Reserve Margin";
            readonly description: "Treat a coding-plan model as near its limit below this remaining percentage. Unknown or unmapped usage keeps the primary model.";
            readonly condition: "usageAwareFallbackEnabled";
            readonly options: readonly [{
                readonly value: "5";
                readonly label: "5%";
                readonly description: "Act only when nearly exhausted";
            }, {
                readonly value: "10";
                readonly label: "10%";
                readonly description: "Balanced safety margin";
            }, {
                readonly value: "15";
                readonly label: "15%";
                readonly description: "Conservative";
            }, {
                readonly value: "20";
                readonly label: "20%";
                readonly description: "Early protection";
            }, {
                readonly value: "25";
                readonly label: "25%";
                readonly description: "Very conservative";
            }];
        };
    };
    readonly "retry.usageReservePolicy": {
        readonly type: "enum";
        readonly values: readonly ["confirm", "auto", "fail-closed"];
        readonly default: "confirm";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Retry & Fallback";
            readonly label: "Reserve Policy";
            readonly description: "What to do when every same-provider coding-plan account is inside the reserve margin.";
            readonly condition: "usageAwareFallbackEnabled";
            readonly options: readonly [{
                readonly value: "confirm";
                readonly label: "Confirm interactively";
                readonly description: "Keep interactive sessions on the primary until confirmed; background agents auto-fallback";
            }, {
                readonly value: "auto";
                readonly label: "Auto-fallback";
                readonly description: "Always select the next eligible configured fallback";
            }, {
                readonly value: "fail-closed";
                readonly label: "Fail closed";
                readonly description: "Do not spend reserve quota or select a fallback";
            }];
        };
    };
    readonly "retry.fallbackChains": {
        readonly type: "record";
        readonly default: Record<string, string[]>;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Retry & Fallback";
            readonly label: "Retry Fallback Chains";
            readonly description: 'JSON object mapping model roles, model selectors ("provider/model-id"), or provider wildcards ("provider/*") to ordered fallback selectors, e.g. {"default":["openai/gpt-4o-mini"],"google-antigravity/*":["google/*","google-vertex/*"]}. Model-oriented keys apply whenever that model/provider is active, regardless of role; a "provider/*" entry keeps the failing model\'s id and swaps the provider. An id-prefixed wildcard ("openrouter/google/*") re-prefixes the failing model\'s bare id (google-antigravity/gemini-x -> openrouter/google/gemini-x) and, used as a key, matches only that provider\'s ids under the prefix.';
        };
    };
    readonly "retry.fallbackRevertPolicy": {
        readonly type: "enum";
        readonly values: readonly ["cooldown-expiry", "never"];
        readonly default: "cooldown-expiry";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Retry & Fallback";
            readonly label: "Fallback Revert Policy";
            readonly description: "When to return to the primary model after a fallback";
            readonly options: readonly [{
                readonly value: "cooldown-expiry";
                readonly label: "Cooldown expiry";
                readonly description: "Return to the primary model after its suppression window ends";
            }, {
                readonly value: "never";
                readonly label: "Never";
                readonly description: "Stay on the fallback model until manually changed";
            }];
        };
    };
    readonly "providers.anthropic.serverSideFallback": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "model";
            readonly group: "Retry & Fallback";
            readonly label: "Anthropic Server-Side Fallback (Fable 5)";
            readonly description: "When a Claude Fable 5 / Mythos 5 request is blocked by Anthropic's safety classifier, retry it on Claude Opus 4.8 server-side (Anthropic `server-side-fallback-2026-06-01` beta). Opt-in — leaving this off preserves the pre-fallback behavior for every request.";
        };
    };
    readonly steeringMode: {
        readonly type: "enum";
        readonly values: readonly ["all", "one-at-a-time"];
        readonly default: "one-at-a-time";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Steering Mode";
            readonly description: "How to process queued messages while agent is working";
        };
    };
    readonly followUpMode: {
        readonly type: "enum";
        readonly values: readonly ["all", "one-at-a-time"];
        readonly default: "one-at-a-time";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Follow-Up Mode";
            readonly description: "How to drain follow-up messages after a turn completes";
        };
    };
    readonly interruptMode: {
        readonly type: "enum";
        readonly values: readonly ["immediate", "wait"];
        readonly default: "immediate";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Interrupt Mode";
            readonly description: "When steering messages interrupt tool execution";
        };
    };
    readonly "loop.mode": {
        readonly type: "enum";
        readonly values: readonly ["prompt", "compact", "reset"];
        readonly default: "prompt";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Loop Mode";
            readonly description: "What happens between /loop iterations before re-submitting the prompt";
            readonly options: readonly [{
                readonly value: "prompt";
                readonly label: "Prompt";
                readonly description: "Re-submit the prompt as a follow-up message (current behavior)";
            }, {
                readonly value: "compact";
                readonly label: "Compact";
                readonly description: "Compact the session context, then re-submit the prompt";
            }, {
                readonly value: "reset";
                readonly label: "Reset";
                readonly description: "Start a new session, then re-submit the prompt";
            }];
        };
    };
    readonly doubleEscapeAction: {
        readonly type: "enum";
        readonly values: readonly ["branch", "tree", "none"];
        readonly default: "tree";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Double-Escape Action";
            readonly description: "Action when pressing Escape twice with empty editor";
        };
    };
    readonly treeFilterMode: {
        readonly type: "enum";
        readonly values: readonly ["default", "no-tools", "user-only", "labeled-only", "all"];
        readonly default: "default";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Session Tree Filter";
            readonly description: "Default filter mode when opening the session tree";
        };
    };
    readonly autocompleteMaxVisible: {
        readonly type: "number";
        readonly default: 10;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Autocomplete Items";
            readonly description: "Max visible items in autocomplete dropdown (3-20)";
            readonly options: readonly [{
                readonly value: "3";
                readonly label: "3 items";
            }, {
                readonly value: "5";
                readonly label: "5 items";
            }, {
                readonly value: "7";
                readonly label: "7 items";
            }, {
                readonly value: "10";
                readonly label: "10 items";
            }, {
                readonly value: "15";
                readonly label: "15 items";
            }, {
                readonly value: "20";
                readonly label: "20 items";
            }];
        };
    };
    readonly "spelling.typoDetection": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Typo Detection (macOS)";
            readonly description: "Mark misspelled prompt words with the active macOS dictionaries";
            readonly condition: "macOS";
        };
    };
    readonly "spelling.autocomplete": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Word Autocomplete (macOS)";
            readonly description: "Show macOS dictionary word completions as inline hints accepted with Tab";
            readonly condition: "macOS";
        };
    };
    readonly "spelling.autocorrect": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Autocorrect (macOS)";
            readonly description: "Apply confident macOS spelling corrections after completed words";
            readonly condition: "macOS";
        };
    };
    readonly emojiAutocomplete: {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Emoji Autocomplete";
            readonly description: "Suggest emojis from `:name:` shortcodes and expand text emoticons like `:D` or `:-)`";
        };
    };
    readonly "paste.largeMenuThreshold": {
        readonly type: "number";
        readonly default: 100;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Input";
            readonly label: "Large Paste Menu";
            readonly description: "When a paste reaches this many lines, offer a menu to wrap it in a code block, wrap it in XML tags, or save it to a file. 0 disables the menu (large pastes still collapse to a [Paste] marker).";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "Off";
            }, {
                readonly value: "100";
                readonly label: "100 lines";
            }, {
                readonly value: "250";
                readonly label: "250 lines";
            }, {
                readonly value: "500";
                readonly label: "500 lines";
            }, {
                readonly value: "1000";
                readonly label: "1000 lines";
            }];
        };
    };
    readonly "startup.quiet": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Startup & Updates";
            readonly label: "Quiet Startup";
            readonly description: "Skip welcome screen and startup status messages";
        };
    };
    readonly "startup.showSplash": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Startup & Updates";
            readonly label: "Show Startup Splash";
            readonly description: "Show the full animated setup splash on normal interactive startup without rerunning setup. Quiet Startup still suppresses it.";
        };
    };
    readonly "startup.setupWizard": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Startup & Updates";
            readonly label: "Setup Wizard";
            readonly description: "Show newly added onboarding steps once per setup version";
        };
    };
    readonly "startup.checkUpdate": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Startup & Updates";
            readonly label: "Check for Updates";
            readonly description: "Check for omp updates on startup";
        };
    };
    readonly "update.channel": {
        readonly type: "enum";
        readonly values: readonly ["stable", "canary"];
        readonly default: "stable";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Startup & Updates";
            readonly label: "Update Channel";
            readonly description: "Update channel used by omp update and the startup update check";
            readonly options: readonly [{
                readonly value: "stable";
                readonly label: "Stable";
            }, {
                readonly value: "canary";
                readonly label: "Canary";
            }];
        };
    };
    readonly "marketplace.autoUpdate": {
        readonly type: "enum";
        readonly values: readonly ["off", "notify", "auto"];
        readonly default: "notify";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Startup & Updates";
            readonly label: "Marketplace Auto-Update";
            readonly description: "Check for plugin updates on startup";
            readonly options: readonly [{
                readonly value: "off";
                readonly label: "Off";
                readonly description: "Don't check for plugin updates";
            }, {
                readonly value: "notify";
                readonly label: "Notify";
                readonly description: "Check on startup and notify when updates are available";
            }, {
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Check on startup and auto-install updates";
            }];
        };
    };
    readonly "startup.changelogMode": {
        readonly type: "enum";
        readonly values: readonly ["summary", "expanded", "hidden"];
        readonly default: "summary";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Startup & Updates";
            readonly label: "Startup Changelog";
            readonly description: "Choose whether update notes start as a summary, full details, or stay hidden";
            readonly options: readonly [{
                readonly value: "summary";
                readonly label: "Summary";
                readonly description: "Show release and change counts with a /changelog hint";
            }, {
                readonly value: "expanded";
                readonly label: "Expanded";
                readonly description: "Show the recent release notes in full";
            }, {
                readonly value: "hidden";
                readonly label: "Hidden";
                readonly description: "Do not show release notes on startup";
            }];
        };
    };
    readonly "magicKeywords.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Magic Keywords";
            readonly label: "Magic Keywords";
            readonly description: "Enable hidden notices for standalone ultrathink, orchestrate, and workflowz keywords";
        };
    };
    readonly "magicKeywords.ultrathink": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Magic Keywords";
            readonly label: "Ultrathink Keyword";
            readonly description: "Let standalone ultrathink request maximum automatic thinking and append its hidden notice";
        };
    };
    readonly "magicKeywords.orchestrate": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Magic Keywords";
            readonly label: "Orchestrate Keyword";
            readonly description: "Let standalone orchestrate append its hidden multi-agent orchestration notice";
        };
    };
    readonly "magicKeywords.workflow": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Magic Keywords";
            readonly label: "Workflow Keyword";
            readonly description: "Let standalone workflowz append its hidden eval workflow notice";
        };
    };
    readonly "completion.notify": {
        readonly type: "enum";
        readonly values: readonly ["on", "off"];
        readonly default: "on";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Notifications";
            readonly label: "Completion Notification";
            readonly description: "Notify when the agent finishes a turn";
        };
    };
    readonly "error.notify": {
        readonly type: "enum";
        readonly values: readonly ["on", "off"];
        readonly default: "off";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Notifications";
            readonly label: "Error Notification";
            readonly description: "Notify when the agent stops with an error";
        };
    };
    readonly "ask.timeout": {
        readonly type: "number";
        readonly default: 0;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Notifications";
            readonly label: "Ask Timeout";
            readonly description: "Auto-select the recommended ask option after this many seconds (0 disables)";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "Disabled";
            }, {
                readonly value: "15";
                readonly label: "15 seconds";
            }, {
                readonly value: "30";
                readonly label: "30 seconds";
            }, {
                readonly value: "60";
                readonly label: "60 seconds";
            }, {
                readonly value: "120";
                readonly label: "120 seconds";
            }];
        };
    };
    readonly "ask.notify": {
        readonly type: "enum";
        readonly values: readonly ["on", "off"];
        readonly default: "on";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Notifications";
            readonly label: "Ask Notification";
            readonly description: "Notify when the ask tool is waiting for input";
        };
    };
    readonly "recap.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Notifications";
            readonly label: "Idle Recap";
            readonly description: "Generate a brief LLM recap of where things stand after the terminal has been idle";
        };
    };
    readonly "recap.idleSeconds": {
        readonly type: "number";
        readonly default: 240;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Notifications";
            readonly label: "Idle Recap Delay";
            readonly description: "Seconds to wait while idle before showing the recap";
            readonly options: readonly [{
                readonly value: "60";
                readonly label: "1 minute";
            }, {
                readonly value: "120";
                readonly label: "2 minutes";
            }, {
                readonly value: "240";
                readonly label: "4 minutes";
            }, {
                readonly value: "300";
                readonly label: "5 minutes";
            }, {
                readonly value: "600";
                readonly label: "10 minutes";
            }];
        };
    };
    readonly "collab.relayUrl": {
        readonly type: "string";
        readonly default: "wss://my.omp.sh";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Collab";
            readonly label: "Relay URL";
            readonly description: "Relay used by /collab (wss://host[:port])";
        };
    };
    readonly "collab.webUrl": {
        readonly type: "string";
        readonly default: "";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Collab";
            readonly label: "Web UI URL";
            readonly description: "Browser UI used by /collab links; empty derives from collab.relayUrl; explicit http:// is localhost-only";
        };
    };
    readonly "collab.displayName": {
        readonly type: "string";
        readonly default: "";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Collab";
            readonly label: "Display Name";
            readonly description: "Name shown to other collab participants (default: OS username)";
        };
    };
    readonly "share.serverUrl": {
        readonly type: "string";
        readonly default: "https://my.omp.sh/s";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Collab";
            readonly label: "Share Server";
            readonly description: "Share viewer/upload base used by /share (encrypted blob upload + viewer; links are <base>/<id>#<key>)";
        };
    };
    readonly "share.store": {
        readonly type: "enum";
        readonly values: readonly ["blob", "gist"];
        readonly default: "blob";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Collab";
            readonly label: "Share Store";
            readonly description: "Where /share uploads the encrypted session blob";
            readonly options: readonly [{
                readonly value: "blob";
                readonly label: "Encrypted Blob";
                readonly description: "Upload to the share server (no GitHub account needed; avoids gist API rate limits)";
            }, {
                readonly value: "gist";
                readonly label: "GitHub Gist";
                readonly description: "Push to a secret gist (needs authenticated gh), falling back to the share server";
            }];
        };
    };
    readonly "share.redactSecrets": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Collab";
            readonly label: "Share Secret Redaction";
            readonly description: "Run the secret obfuscator over /share snapshots before upload (uses the secrets.* config)";
        };
    };
    readonly "stt.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Speech";
            readonly label: "Speech-to-Text";
            readonly description: "Enable speech-to-text input via microphone";
        };
    };
    readonly "stt.language": {
        readonly type: "string";
        readonly default: "en";
    };
    readonly "stt.modelName": {
        readonly type: "enum";
        readonly values: readonly ["fast", "balanced", "turbo", "parakeet"];
        readonly default: "parakeet";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Speech";
            readonly label: "Speech Model";
            readonly description: "Local on-device speech model. Parakeet TDT v3 (sherpa-onnx) is the SoTA default; Whisper base/small/large-v3-turbo tiers (transformers.js) trade size for multilingual coverage. Downloaded on first use.";
            readonly options: {
                value: "balanced" | "fast" | "parakeet" | "turbo";
                label: "Balanced (Whisper small)" | "Fast (Whisper base)" | "Parakeet TDT v3 (SoTA)" | "Turbo (Whisper large-v3)";
                description: "NVIDIA Parakeet TDT 0.6B v3, 25 languages. Open ASR Leaderboard leader — best accuracy and far fastest decoding. Default." | "Whisper base, multilingual. Smallest + fastest; lowest accuracy. Best for low-resource machines." | "Whisper large-v3-turbo, 99 languages. Widest language coverage; large download, slower." | "Whisper small, multilingual. More accurate than Fast, still light on CPU/RAM.";
            }[];
        };
    };
    readonly "stt.submitTrigger": {
        readonly type: "enum";
        readonly values: readonly ["never", "release", "release-complete", "say-submit"];
        readonly default: "never";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Speech";
            readonly label: "Speech-to-Text Submit Trigger";
            readonly description: "Choose when speech dictation automatically submits: Never, Release (2+ words), Release with complete sentence, or When I Say Submit.";
            readonly options: ({
                value: "never";
                label: string;
                description: string;
            } | {
                value: "release";
                label: string;
                description: string;
            } | {
                value: "release-complete";
                label: string;
                description: string;
            } | {
                value: "say-submit";
                label: string;
                description: string;
            })[];
        };
    };
    readonly "contextPromotion.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "context";
            readonly group: "General";
            readonly label: "Auto-Promote Context";
            readonly description: "Promote to a larger-context model on context overflow instead of compacting";
        };
    };
    readonly extendedContext: {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "context";
            readonly group: "General";
            readonly label: "Extended Context";
            readonly description: "Use premium long-context windows on models that bill extra past a threshold (e.g. GPT-5.6 1M charges 2x input above 272K); off caps them at the standard-pricing window";
        };
    };
    readonly "compaction.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Auto-Compact";
            readonly description: "Automatically compact context when it gets too large";
        };
    };
    readonly "compaction.midTurnEnabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Mid-Turn Compaction";
            readonly description: "Check thresholds at safe mid-turn tool-loop boundaries before the next provider request";
        };
    };
    readonly "compaction.methodOrder": {
        readonly type: "array";
        readonly default: readonly ("handoff" | "remote" | "shake" | "snapcompact" | "soft")[];
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Compaction Method Order";
            readonly description: "Preferred fallback order for automatic context maintenance; unavailable or failed methods advance to the next choice";
            readonly options: readonly [{
                readonly value: "remote";
                readonly label: "OpenAI server compaction";
                readonly description: "Use provider-native OpenAI-compatible server compaction when the active route supports it";
            }, {
                readonly value: "snapcompact";
                readonly label: "Snapcompact";
                readonly description: "Archive history onto dense bitmap images the active vision model reads back; no LLM call";
            }, {
                readonly value: "handoff";
                readonly label: "Handoff";
                readonly description: "Generate a handoff document and continue from it as the compaction summary";
            }, {
                readonly value: "soft";
                readonly label: "Soft compaction";
                readonly description: "Summarize in place with a compaction model without using server compaction";
            }, {
                readonly value: "shake";
                readonly label: "Shake";
                readonly description: "Drop recoverable heavy content in place without an LLM call";
            }];
            readonly ordered: true;
        };
    };
    readonly "compaction.thresholdPercent": {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Compaction Threshold";
            readonly description: "Percent threshold for context maintenance; set to Default to use legacy reserve-based behavior";
            readonly options: readonly [{
                readonly value: "default";
                readonly label: "Default";
                readonly description: "Legacy reserve-based threshold";
            }, {
                readonly value: "10";
                readonly label: "10%";
                readonly description: "Extremely early maintenance";
            }, {
                readonly value: "20";
                readonly label: "20%";
                readonly description: "Very early maintenance";
            }, {
                readonly value: "30";
                readonly label: "30%";
                readonly description: "Early maintenance";
            }, {
                readonly value: "40";
                readonly label: "40%";
                readonly description: "Moderately early maintenance";
            }, {
                readonly value: "50";
                readonly label: "50%";
                readonly description: "Halfway point";
            }, {
                readonly value: "60";
                readonly label: "60%";
                readonly description: "Moderate context usage";
            }, {
                readonly value: "70";
                readonly label: "70%";
                readonly description: "Balanced";
            }, {
                readonly value: "75";
                readonly label: "75%";
                readonly description: "Slightly aggressive";
            }, {
                readonly value: "80";
                readonly label: "80%";
                readonly description: "Typical threshold";
            }, {
                readonly value: "85";
                readonly label: "85%";
                readonly description: "Aggressive context usage";
            }, {
                readonly value: "90";
                readonly label: "90%";
                readonly description: "Very aggressive";
            }, {
                readonly value: "95";
                readonly label: "95%";
                readonly description: "Near context limit";
            }];
        };
    };
    readonly "compaction.thresholdTokens": {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Compaction Token Limit";
            readonly description: "Fixed token limit for context maintenance; overrides percentage if set";
            readonly options: readonly [{
                readonly value: "default";
                readonly label: "Default";
                readonly description: "Use percentage-based threshold";
            }, {
                readonly value: "25000";
                readonly label: "25K tokens";
                readonly description: "Quarter of a 200K window";
            }, {
                readonly value: "50000";
                readonly label: "50K tokens";
                readonly description: "Half of a 200K window";
            }, {
                readonly value: "100000";
                readonly label: "100K tokens";
                readonly description: "Half of a 200K window";
            }, {
                readonly value: "150000";
                readonly label: "150K tokens";
                readonly description: "Three-quarters of a 200K window";
            }, {
                readonly value: "200000";
                readonly label: "200K tokens";
                readonly description: "Full standard context window";
            }, {
                readonly value: "300000";
                readonly label: "300K tokens";
                readonly description: "Large context window";
            }, {
                readonly value: "500000";
                readonly label: "500K tokens";
                readonly description: "Very large context window";
            }];
        };
    };
    readonly "compaction.handoffSaveToDisk": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Save Handoff Docs";
            readonly description: "Save generated handoff documents to markdown files for the auto-handoff flow";
        };
    };
    readonly "compaction.remoteStreamingV2Enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Remote Compaction V2";
            readonly description: "Use Responses streaming compaction for compatible remote compaction models";
        };
    };
    readonly "compaction.asyncEnabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Async Compaction";
            readonly description: "Speculatively summarize in the background as context nears the compaction threshold, then splice the ready result in when the threshold is crossed";
        };
    };
    readonly "compaction.reserveTokens": {
        readonly type: "number";
        readonly default: undefined;
    };
    readonly "compaction.keepRecentTokens": {
        readonly type: "number";
        readonly default: 20000;
    };
    readonly "compaction.autoContinue": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "compaction.remoteEndpoint": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "compaction.v2RetainedMessageBudget": {
        readonly type: "number";
        readonly default: 64000;
    };
    readonly "compaction.idleEnabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Idle Compaction";
            readonly description: "Compact context while idle when token count exceeds threshold";
        };
    };
    readonly "compaction.idleThresholdTokens": {
        readonly type: "number";
        readonly default: 200000;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Idle Compaction Threshold";
            readonly description: "Token count above which idle compaction triggers";
            readonly options: readonly [{
                readonly value: "100000";
                readonly label: "100K tokens";
            }, {
                readonly value: "200000";
                readonly label: "200K tokens";
            }, {
                readonly value: "300000";
                readonly label: "300K tokens";
            }, {
                readonly value: "400000";
                readonly label: "400K tokens";
            }, {
                readonly value: "500000";
                readonly label: "500K tokens";
            }, {
                readonly value: "600000";
                readonly label: "600K tokens";
            }, {
                readonly value: "700000";
                readonly label: "700K tokens";
            }, {
                readonly value: "800000";
                readonly label: "800K tokens";
            }, {
                readonly value: "900000";
                readonly label: "900K tokens";
            }];
        };
    };
    readonly "compaction.idleTimeoutSeconds": {
        readonly type: "number";
        readonly default: 300;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Idle Compaction Delay";
            readonly description: "Seconds to wait while idle before compacting";
            readonly options: readonly [{
                readonly value: "60";
                readonly label: "1 minute";
            }, {
                readonly value: "120";
                readonly label: "2 minutes";
            }, {
                readonly value: "300";
                readonly label: "5 minutes";
            }, {
                readonly value: "600";
                readonly label: "10 minutes";
            }, {
                readonly value: "1800";
                readonly label: "30 minutes";
            }, {
                readonly value: "3600";
                readonly label: "1 hour";
            }];
        };
    };
    readonly "compaction.supersedeReads": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Supersede Stale Reads";
            readonly description: "Prune older read results when the same file is read again (cache-aware, runs every turn)";
        };
    };
    readonly "compaction.dropUseless": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Compaction";
            readonly label: "Elide Uneventful Results";
            readonly description: "Prune tool results flagged contextually useless (no matches, timed-out waits) once consumed (cache-aware)";
        };
    };
    readonly "snapcompact.systemPrompt": {
        readonly type: "enum";
        readonly values: readonly ["none", "agents-md", "all"];
        readonly default: "none";
        readonly ui: {
            readonly tab: "context";
            readonly group: "Experimental";
            readonly label: "Snapcompact System Prompt";
            readonly description: "Experimental: render selected system prompt text as dense PNG image(s) and attach to the first user message (vision models only). Saves tokens; loses prompt caching for imaged text.";
            readonly options: readonly [{
                readonly value: "none";
                readonly label: "None";
                readonly description: "Keep the system prompt as text.";
            }, {
                readonly value: "agents-md";
                readonly label: "AGENTS.md";
                readonly description: "Only move loaded context-file instructions to images, when that saves tokens.";
            }, {
                readonly value: "all";
                readonly label: "All";
                readonly description: "Move the full system prompt to images, when that saves tokens.";
            }];
        };
    };
    readonly "snapcompact.toolResults": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Experimental";
            readonly label: "Snapcompact Tool Results";
            readonly description: "Experimental: render large historical tool results as dense PNG image(s) instead of text (vision models only). Saves tokens on accumulated read/search output.";
        };
    };
    readonly "tools.format": {
        readonly type: "enum";
        readonly values: readonly ["auto", "native", "glm", "hermes", "kimi", "xml", "anthropic", "deepseek", "harmony", "qwen3", "gemini", "gemma", "minimax"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "context";
            readonly group: "Experimental";
            readonly label: "Tool Calling Mode";
            readonly description: "Controls how tools are exposed to the model. Auto uses provider-native tool calls unless the selected model is marked as not supporting them, then falls back to the GLM owned dialect. Native forces provider-native tools; the other values force the named owned dialect. Applies on session start.";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Use native tool calls unless the model is known not to support them.";
            }, {
                readonly value: "native";
                readonly label: "Native";
                readonly description: "Use provider-native tool calls.";
            }, {
                readonly value: "glm";
                readonly label: "GLM";
                readonly description: "Use GLM-style in-band tool calls.";
            }, {
                readonly value: "hermes";
                readonly label: "Hermes";
                readonly description: "Use Hermes-style in-band tool calls.";
            }, {
                readonly value: "kimi";
                readonly label: "Kimi";
                readonly description: "Use Kimi-style in-band tool calls.";
            }, {
                readonly value: "xml";
                readonly label: "XML";
                readonly description: "Use generic XML in-band tool calls.";
            }, {
                readonly value: "anthropic";
                readonly label: "Anthropic";
                readonly description: "Use Anthropic-style in-band tool calls.";
            }, {
                readonly value: "deepseek";
                readonly label: "DeepSeek";
                readonly description: "Use DeepSeek-style in-band tool calls.";
            }, {
                readonly value: "harmony";
                readonly label: "Harmony";
                readonly description: "Use Harmony-style in-band tool calls.";
            }, {
                readonly value: "qwen3";
                readonly label: "Qwen3";
                readonly description: "Use the Qwen3 owned dialect.";
            }, {
                readonly value: "gemini";
                readonly label: "Gemini";
                readonly description: "Use the Gemini owned dialect.";
            }, {
                readonly value: "gemma";
                readonly label: "Gemma";
                readonly description: "Use the Gemma owned dialect.";
            }, {
                readonly value: "minimax";
                readonly label: "MiniMax";
                readonly description: "Use the MiniMax owned dialect.";
            }];
        };
    };
    readonly "snapcompact.shape": {
        readonly type: "enum";
        readonly values: readonly ["auto", ...("11on16-bw" | "5x8-bw" | "5x8-sent" | "6x12-dim" | "6x6u-bw" | "6x6u-sent" | "8on16-bw" | "8on22-bw" | "8x13-bw" | "8x8r-bw" | "8x8r-sent" | "8x8u-bw" | "8x8u-sent" | "doc-8on16-bw" | "doc-8on16-sent" | "doc-8on16-sent-dim" | "silver16-bw")[]];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "context";
            readonly group: "Experimental";
            readonly label: "Snapcompact Shape";
            readonly description: "Frame shape snapcompact prints text with (compaction archive and inline imaging). Auto picks a shape tuned for the current model.";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Picks a shape tuned for the current model, falling back to its provider family.";
            }, {
                readonly value: "8x8r-bw";
                readonly label: "8x8 repeated, black";
                readonly description: "unscii square cell, black ink, every line printed twice with the copy on a pale highlight band.";
            }, {
                readonly value: "8x8r-sent";
                readonly label: "8x8 repeated, sentence hues";
                readonly description: "Repeated grid with ink cycling six hues at sentence boundaries.";
            }, {
                readonly value: "8x8u-bw";
                readonly label: "8x8, black";
                readonly description: "Plain unscii square cell, single-printed lines, black ink.";
            }, {
                readonly value: "8x8u-sent";
                readonly label: "8x8, sentence hues";
                readonly description: "Plain unscii square cell with sentence-hue ink.";
            }, {
                readonly value: "6x6u-bw";
                readonly label: "6x6 dense, black";
                readonly description: "unscii squeezed to 6x6 — densest readable cell, fewest frames — in black ink.";
            }, {
                readonly value: "6x6u-sent";
                readonly label: "6x6 dense, sentence hues";
                readonly description: "Densest cell with sentence-hue ink.";
            }, {
                readonly value: "5x8-bw";
                readonly label: "5x8 legacy, black";
                readonly description: "Original X.org 5x8 glyphs on the 2576px frame, black ink.";
            }, {
                readonly value: "5x8-sent";
                readonly label: "5x8 legacy, sentence hues";
                readonly description: "The original snapcompact shape (pre-shape-table sessions rendered this).";
            }, {
                readonly value: "6x12-dim";
                readonly label: "6x12, dimmed stopwords";
                readonly description: "X.org 6x12 glyphs, black ink, function words dimmed gray.";
            }, {
                readonly value: "8x13-bw";
                readonly label: "8x13, black";
                readonly description: "X.org 8x13 glyphs, black ink.";
            }, {
                readonly value: "8on16-bw";
                readonly label: "8x13 on 16px pitch, black";
                readonly description: "8x13 glyphs on an 8x16 cell (extra leading), black ink.";
            }, {
                readonly value: "8on22-bw";
                readonly label: "8x13 on 22px pitch (leading), black";
                readonly description: "8x13 glyphs on an 8x22 cell — extra line spacing so rows don't crowd. Default for OpenAI/Google.";
            }, {
                readonly value: "11on16-bw";
                readonly label: "8x13 on 11px advance (tracking), black";
                readonly description: "8x13 glyphs on an 11x16 cell — extra letter spacing so characters don't merge. Default for Anthropic.";
            }, {
                readonly value: "silver16-bw";
                readonly label: "Silver 16, CJK";
                readonly description: "Embedded Silver TrueType font on a 16px grid for CJK and other non-Latin text.";
            }, {
                readonly value: "doc-8on16-bw";
                readonly label: "Doc 8on16, black";
                readonly description: "Two word-wrapped newspaper columns of 8x13 glyphs on a 16px pitch, black ink.";
            }, {
                readonly value: "doc-8on16-sent";
                readonly label: "Doc 8on16, sentence hues";
                readonly description: "Two-column doc layout with sentence-hue ink.";
            }, {
                readonly value: "doc-8on16-sent-dim";
                readonly label: "Doc 8on16, sentence hues + dimmed stopwords";
                readonly description: "Two-column doc layout, sentence-hue ink, function words dimmed gray.";
            }];
        };
    };
    readonly "branchSummary.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "context";
            readonly group: "General";
            readonly label: "Branch Summaries";
            readonly description: "Prompt to summarize when leaving a branch";
        };
    };
    readonly "branchSummary.reserveTokens": {
        readonly type: "number";
        readonly default: 16384;
    };
    readonly "memories.enabled": {
        readonly type: "boolean";
        readonly default: false;
    };
    readonly "memories.maxRolloutsPerStartup": {
        readonly type: "number";
        readonly default: 64;
    };
    readonly "memories.maxRolloutAgeDays": {
        readonly type: "number";
        readonly default: 30;
    };
    readonly "memories.minRolloutIdleHours": {
        readonly type: "number";
        readonly default: 12;
    };
    readonly "memories.threadScanLimit": {
        readonly type: "number";
        readonly default: 300;
    };
    readonly "memories.maxRawMemoriesForGlobal": {
        readonly type: "number";
        readonly default: 200;
    };
    readonly "memories.stage1Concurrency": {
        readonly type: "number";
        readonly default: 8;
    };
    readonly "memories.stage1LeaseSeconds": {
        readonly type: "number";
        readonly default: 120;
    };
    readonly "memories.stage1RetryDelaySeconds": {
        readonly type: "number";
        readonly default: 120;
    };
    readonly "memories.phase2LeaseSeconds": {
        readonly type: "number";
        readonly default: 180;
    };
    readonly "memories.phase2RetryDelaySeconds": {
        readonly type: "number";
        readonly default: 180;
    };
    readonly "memories.phase2HeartbeatSeconds": {
        readonly type: "number";
        readonly default: 30;
    };
    readonly "memories.rolloutPayloadPercent": {
        readonly type: "number";
        readonly default: 0.7;
    };
    readonly "memories.phase1InputTokenLimit": {
        readonly type: "number";
        readonly default: 4000;
    };
    readonly "memories.fallbackTokenLimit": {
        readonly type: "number";
        readonly default: 16000;
    };
    readonly "memories.summaryInjectionTokenLimit": {
        readonly type: "number";
        readonly default: 5000;
    };
    readonly "memory.backend": {
        readonly type: "enum";
        readonly values: readonly ["off", "local", "hindsight", "mnemopi"];
        readonly default: "off";
        readonly ui: {
            readonly tab: "memory";
            readonly group: "General";
            readonly label: "Memory Backend";
            readonly description: "Off, local summary pipeline, Mnemopi SQLite, or Hindsight remote memory";
            readonly options: readonly [{
                readonly value: "off";
                readonly label: "Off";
                readonly description: "No memory subsystem runs";
            }, {
                readonly value: "local";
                readonly label: "Local";
                readonly description: "Local rollout summarisation pipeline (memory_summary.md)";
            }, {
                readonly value: "hindsight";
                readonly label: "Hindsight";
                readonly description: "Vectorize Hindsight remote memory service";
            }, {
                readonly value: "mnemopi";
                readonly label: "Mnemopi";
                readonly description: "Local SQLite recall/retain backend with optional embeddings";
            }];
        };
    };
    readonly "autolearn.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Auto-Learn";
            readonly label: "Auto-Learn (experimental)";
            readonly description: "After the agent stops, nudge it to capture lessons to memory and create/enhance isolated managed skills";
        };
    };
    readonly "autolearn.autoContinue": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Auto-Learn";
            readonly label: "Auto-run capture at stop";
            readonly description: "When on, auto-run one private capture turn at stop (uses extra tokens). When off, only standing auto-learn guidance remains.";
            readonly condition: "autolearnActive";
        };
    };
    readonly "autolearn.minToolCalls": {
        readonly type: "number";
        readonly default: 5;
    };
    readonly "mnemopi.dbPath": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi DB Path";
            readonly description: "Optional SQLite DB path. Defaults to the agent memories directory.";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.bank": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Bank";
            readonly description: "Optional shared bank base name. Per-project modes derive project-local banks from it.";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.scoping": {
        readonly type: "enum";
        readonly values: readonly ["global", "per-project", "per-project-tagged"];
        readonly default: "per-project";
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Scoping";
            readonly description: "global = one shared bank; per-project = isolated bank per cwd; per-project-tagged = project-local writes plus global recall visibility";
            readonly options: readonly [{
                readonly value: "global";
                readonly label: "Global";
                readonly description: "One shared Mnemopi bank for every project";
            }, {
                readonly value: "per-project";
                readonly label: "Per project";
                readonly description: "Project-local Mnemopi bank per cwd basename";
            }, {
                readonly value: "per-project-tagged";
                readonly label: "Per project (tagged)";
                readonly description: "Write to a project-local bank but merge project + shared recall results";
            }];
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.embeddingVariant": {
        readonly type: "enum";
        readonly values: readonly ["en", "multilingual"];
        readonly default: "en";
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Embedding variant";
            readonly description: "Local embedding model family. en = stronger English model; multilingual = cross-language model. Changing this rebuilds existing memory embeddings on next start.";
            readonly options: readonly [{
                readonly value: "en";
                readonly label: "English (bge-base-en-v1.5)";
                readonly description: "BAAI/bge-base-en-v1.5 (768d), English-only";
            }, {
                readonly value: "multilingual";
                readonly label: "Multilingual (multilingual-e5-large)";
                readonly description: "intfloat/multilingual-e5-large (1024d), cross-language recall";
            }];
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.autoRecall": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Auto Recall";
            readonly description: "Recall local memories into the first turn of each session";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.autoRetain": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Auto Retain";
            readonly description: "Retain completed conversation turns into local Mnemopi memory";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.polyphonicRecall": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Polyphonic Recall";
            readonly description: "Enable 4-voice recall (vector, graph, fact, temporal) fused with reciprocal rank fusion";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.enhancedRecall": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Enhanced Recall";
            readonly description: "Enable the tiered query result cache for repeated and similar recall queries";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.proactiveLinking": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Proactive Linking";
            readonly description: "Ingest new memories into the episodic graph as they are stored, linking them to related entities and memories";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.noEmbeddings": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Disable Embeddings";
            readonly description: "Force deterministic FTS-only recall instead of vector embeddings";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.embeddingModel": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Embedding Model";
            readonly description: "Advanced: explicit embedding model id that overrides the variant. Leave empty to use mnemopi.embeddingVariant.";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.embeddingApiUrl": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Embedding API URL";
            readonly description: "Optional OpenAI-compatible embedding endpoint passed to Mnemopi";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.embeddingApiKey": {
        readonly type: "string";
        readonly credential: true;
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi Embedding API Key";
            readonly description: "Optional embedding API key passed to Mnemopi";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.llmMode": {
        readonly type: "enum";
        readonly values: readonly ["none", "smol", "remote"];
        readonly default: "smol";
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi LLM Mode";
            readonly description: "Use no LLM, the online tiny model (the TINY role from /models, else @smol), or a remote OpenAI-compatible endpoint";
            readonly condition: "mnemopiActive";
            readonly options: readonly [{
                readonly value: "none";
                readonly label: "None";
                readonly description: "Disable Mnemopi LLM-backed extraction";
            }, {
                readonly value: "smol";
                readonly label: "Online (tiny)";
                readonly description: "Use the online tiny model (the TINY role from /models, else @smol)";
            }, {
                readonly value: "remote";
                readonly label: "Remote";
                readonly description: "Use the Mnemopi remote LLM settings below";
            }];
        };
    };
    readonly "mnemopi.llmBaseUrl": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi LLM Base URL";
            readonly description: "Optional OpenAI-compatible LLM endpoint for Mnemopi remote mode";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.llmApiKey": {
        readonly type: "string";
        readonly credential: true;
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi LLM API Key";
            readonly description: "Optional LLM API key for Mnemopi remote mode";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.llmModel": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Mnemopi";
            readonly label: "Mnemopi LLM Model";
            readonly description: "Optional LLM model name for Mnemopi remote mode";
            readonly condition: "mnemopiActive";
        };
    };
    readonly "mnemopi.retainEveryNTurns": {
        readonly type: "number";
        readonly default: 4;
    };
    readonly "mnemopi.recallLimit": {
        readonly type: "number";
        readonly default: 8;
    };
    readonly "mnemopi.recallContextTurns": {
        readonly type: "number";
        readonly default: 3;
    };
    readonly "mnemopi.recallMaxQueryChars": {
        readonly type: "number";
        readonly default: 4000;
    };
    readonly "mnemopi.injectionTokenLimit": {
        readonly type: "number";
        readonly default: 5000;
    };
    readonly "mnemopi.debug": {
        readonly type: "boolean";
        readonly default: false;
    };
    readonly "hindsight.apiUrl": {
        readonly type: "string";
        readonly default: "http://localhost:8888";
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Hindsight";
            readonly label: "Hindsight API URL";
            readonly description: "Hindsight server URL (Cloud or self-hosted)";
            readonly condition: "hindsightActive";
        };
    };
    readonly "hindsight.apiToken": {
        readonly type: "string";
        readonly credential: true;
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Hindsight";
            readonly label: "Hindsight API Token";
            readonly description: "Bearer token for authenticated Hindsight servers";
            readonly condition: "hindsightActive";
        };
    };
    readonly "hindsight.bankId": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Hindsight";
            readonly label: "Hindsight Bank ID";
            readonly description: "Memory bank identifier (default: project name)";
            readonly condition: "hindsightActive";
        };
    };
    readonly "hindsight.bankIdPrefix": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "hindsight.scoping": {
        readonly type: "enum";
        readonly values: readonly ["global", "per-project", "per-project-tagged"];
        readonly default: "per-project-tagged";
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Hindsight";
            readonly label: "Hindsight Scoping";
            readonly description: "global = one shared bank; per-project = isolated bank per cwd; per-project-tagged = shared bank with project tags so global + project memories merge on recall";
            readonly options: readonly [{
                readonly value: "global";
                readonly label: "Global";
                readonly description: "One shared bank — every project sees the same memories";
            }, {
                readonly value: "per-project";
                readonly label: "Per project";
                readonly description: "Isolated bank per cwd basename — projects cannot see each other's memories";
            }, {
                readonly value: "per-project-tagged";
                readonly label: "Per project (tagged)";
                readonly description: "Shared bank, retains tagged with project:<cwd>. Recall surfaces project + untagged global memories together";
            }];
            readonly condition: "hindsightActive";
        };
    };
    readonly "hindsight.bankMission": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "hindsight.retainMission": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "hindsight.autoRecall": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Hindsight";
            readonly label: "Hindsight Auto Recall";
            readonly description: "Recall memories on the first turn of each session";
            readonly condition: "hindsightActive";
        };
    };
    readonly "hindsight.autoRetain": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Hindsight";
            readonly label: "Hindsight Auto Retain";
            readonly description: "Retain transcript every N turns and at session boundaries";
            readonly condition: "hindsightActive";
        };
    };
    readonly "hindsight.retainMode": {
        readonly type: "enum";
        readonly values: readonly ["full-session", "last-turn"];
        readonly default: "full-session";
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Hindsight";
            readonly label: "Hindsight Retain Mode";
            readonly description: "full-session = upsert one document per session, last-turn = chunked";
            readonly options: readonly [{
                readonly value: "full-session";
                readonly label: "Full session";
                readonly description: "Upsert one document per session (recommended)";
            }, {
                readonly value: "last-turn";
                readonly label: "Last turn";
                readonly description: "Chunked retention sliced by turn boundaries";
            }];
            readonly condition: "hindsightActive";
        };
    };
    readonly "hindsight.retainEveryNTurns": {
        readonly type: "number";
        readonly default: 3;
    };
    readonly "hindsight.retainOverlapTurns": {
        readonly type: "number";
        readonly default: 2;
    };
    readonly "hindsight.retainContext": {
        readonly type: "string";
        readonly default: "omp";
    };
    readonly "hindsight.recallBudget": {
        readonly type: "enum";
        readonly values: readonly ["low", "mid", "high"];
        readonly default: "mid";
    };
    readonly "hindsight.recallMaxTokens": {
        readonly type: "number";
        readonly default: 1024;
    };
    readonly "hindsight.recallContextTurns": {
        readonly type: "number";
        readonly default: 1;
    };
    readonly "hindsight.recallMaxQueryChars": {
        readonly type: "number";
        readonly default: 800;
    };
    readonly "hindsight.recallTypes": {
        readonly type: "array";
        readonly default: string[];
    };
    readonly "hindsight.debug": {
        readonly type: "boolean";
        readonly default: false;
    };
    readonly "hindsight.requestTimeoutMs": {
        readonly type: "number";
        readonly default: 30000;
    };
    readonly "hindsight.reflectTimeoutMs": {
        readonly type: "number";
        readonly default: 120000;
    };
    readonly "hindsight.recallTimeoutMs": {
        readonly type: "number";
        readonly default: 30000;
    };
    readonly "hindsight.retainTimeoutMs": {
        readonly type: "number";
        readonly default: 60000;
    };
    readonly "hindsight.mentalModelsEnabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Hindsight";
            readonly label: "Hindsight Mental Models";
            readonly description: "Read curated reflect summaries (mental models) into developer instructions at boot. Loads existing models on the bank — does not write. Pair with hindsight.mentalModelAutoSeed to also auto-create the built-in seed set.";
            readonly condition: "hindsightActive";
        };
    };
    readonly "hindsight.mentalModelAutoSeed": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "memory";
            readonly group: "Hindsight";
            readonly label: "Hindsight Mental Model Auto-Seed";
            readonly description: "At session start, create any built-in mental models (project-conventions, project-decisions, user-preferences) that do not yet exist on the bank.";
            readonly condition: "hindsightActive";
        };
    };
    readonly "hindsight.mentalModelRefreshIntervalMs": {
        readonly type: "number";
        readonly default: number;
    };
    readonly "hindsight.mentalModelMaxRenderChars": {
        readonly type: "number";
        readonly default: 16000;
    };
    readonly "ttsr.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Rules (TTSR)";
            readonly label: "TTSR";
            readonly description: "Interrupt the agent mid-stream when output matches rule patterns (Time-Traveling Stream Rules)";
        };
    };
    readonly "ttsr.contextMode": {
        readonly type: "enum";
        readonly values: readonly ["discard", "keep"];
        readonly default: "discard";
        readonly ui: {
            readonly tab: "context";
            readonly group: "Rules (TTSR)";
            readonly label: "TTSR Context Mode";
            readonly description: "What to do with partial output when TTSR triggers";
        };
    };
    readonly "ttsr.interruptMode": {
        readonly type: "enum";
        readonly values: readonly ["never", "prose-only", "tool-only", "always"];
        readonly default: "always";
        readonly ui: {
            readonly tab: "context";
            readonly group: "Rules (TTSR)";
            readonly label: "TTSR Interrupt Mode";
            readonly description: "When to interrupt mid-stream vs inject warning after completion";
            readonly options: readonly [{
                readonly value: "always";
                readonly label: "always";
                readonly description: "Interrupt on prose and tool streams";
            }, {
                readonly value: "prose-only";
                readonly label: "prose-only";
                readonly description: "Interrupt only on reply/thinking matches";
            }, {
                readonly value: "tool-only";
                readonly label: "tool-only";
                readonly description: "Interrupt only on tool-call argument matches";
            }, {
                readonly value: "never";
                readonly label: "never";
                readonly description: "Never interrupt; inject warning after completion";
            }];
        };
    };
    readonly "ttsr.repeatMode": {
        readonly type: "enum";
        readonly values: readonly ["once", "after-gap"];
        readonly default: "once";
        readonly ui: {
            readonly tab: "context";
            readonly group: "Rules (TTSR)";
            readonly label: "TTSR Repeat Mode";
            readonly description: "How rules can repeat: once per session or after a message gap";
        };
    };
    readonly "ttsr.repeatGap": {
        readonly type: "number";
        readonly default: 10;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Rules (TTSR)";
            readonly label: "TTSR Repeat Gap";
            readonly description: "Messages before a rule can trigger again";
            readonly options: readonly [{
                readonly value: "5";
                readonly label: "5 messages";
            }, {
                readonly value: "10";
                readonly label: "10 messages";
            }, {
                readonly value: "15";
                readonly label: "15 messages";
            }, {
                readonly value: "20";
                readonly label: "20 messages";
            }, {
                readonly value: "30";
                readonly label: "30 messages";
            }];
        };
    };
    readonly "ttsr.builtinRules": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "context";
            readonly group: "Rules (TTSR)";
            readonly label: "Built-in Rules";
            readonly description: "Load the default rules shipped with the agent (override individually with ttsr.disabledRules)";
        };
    };
    readonly "ttsr.disabledRules": {
        readonly type: "array";
        readonly default: string[];
        readonly ui: {
            readonly tab: "context";
            readonly group: "Rules (TTSR)";
            readonly label: "Disabled Rules";
            readonly description: "Rule names to ignore entirely (applies to bundled defaults and your own rules)";
        };
    };
    readonly "edit.mode": {
        readonly type: "enum";
        readonly values: import("../index.js").EditMode[];
        readonly default: "hashline";
        readonly ui: {
            readonly tab: "files";
            readonly group: "Editing";
            readonly label: "Edit Mode";
            readonly description: "Select the edit tool variant (replace, patch, hashline, or apply_patch)";
        };
    };
    readonly "edit.fuzzyMatch": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Editing";
            readonly label: "Fuzzy Match";
            readonly description: "Accept high-confidence fuzzy matches for whitespace differences";
        };
    };
    readonly "edit.fuzzyThreshold": {
        readonly type: "number";
        readonly default: 0.95;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Editing";
            readonly label: "Fuzzy Match Threshold";
            readonly description: "Similarity threshold (0-1) for accepting fuzzy matches";
            readonly options: readonly [{
                readonly value: "0.85";
                readonly label: "0.85";
                readonly description: "Lenient";
            }, {
                readonly value: "0.90";
                readonly label: "0.90";
                readonly description: "Moderate";
            }, {
                readonly value: "0.95";
                readonly label: "0.95";
                readonly description: "Default";
            }, {
                readonly value: "0.98";
                readonly label: "0.98";
                readonly description: "Strict";
            }];
        };
    };
    readonly "edit.streamingAbort": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Editing";
            readonly label: "Abort on Failed Preview";
            readonly description: "Abort streaming edit tool calls when patch preview fails";
        };
    };
    readonly "edit.blockAutoGenerated": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Editing";
            readonly label: "Block Auto-Generated Files";
            readonly description: "Prevent editing of files that appear to be auto-generated (protoc, sqlc, swagger, etc.)";
        };
    };
    readonly "edit.enforceSeenLines": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Editing";
            readonly label: "Enforce Seen-Line Guard";
            readonly description: "Reject edits anchored on lines a prior read/search never displayed in full";
        };
    };
    readonly "edit.blackbox.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Editing";
            readonly label: "Record Parse Regressions";
            readonly description: "Append full before/after source when an edit introduces an AST parse failure";
        };
    };
    readonly "edit.autoRepair.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Editing";
            readonly label: "Auto-Repair Parse Regressions";
            readonly description: "When an edit breaks a file's AST parse, ask the smol model to fix the broken region (validated by re-parse; falls back to a warning)";
        };
    };
    readonly readLineNumbers: {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Reading";
            readonly label: "Line Numbers";
            readonly description: "Prepend line numbers to read tool output by default";
        };
    };
    readonly "read.defaultLimit": {
        readonly type: "number";
        readonly default: 300;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Reading";
            readonly label: "Default Read Limit";
            readonly description: "Default number of lines returned when agent calls read without a limit";
            readonly options: readonly [{
                readonly value: "200";
                readonly label: "200 lines";
            }, {
                readonly value: "300";
                readonly label: "300 lines";
            }, {
                readonly value: "500";
                readonly label: "500 lines";
            }, {
                readonly value: "1000";
                readonly label: "1000 lines";
            }, {
                readonly value: "5000";
                readonly label: "5000 lines";
            }];
        };
    };
    readonly "read.renderMarkdown": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Reading";
            readonly label: "Markdown Previews";
            readonly description: "Render Markdown read results as formatted terminal Markdown previews instead of raw source";
        };
    };
    readonly "read.summarize.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Read Summaries";
            readonly label: "Read Summaries";
            readonly description: "Return structural code summaries when read is called without an explicit selector";
        };
    };
    readonly "read.summarize.prose": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Read Summaries";
            readonly label: "Prose Summaries";
            readonly description: "Return structural summaries for Markdown and plain text reads";
        };
    };
    readonly "read.summarize.minBodyLines": {
        readonly type: "number";
        readonly default: 4;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Read Summaries";
            readonly label: "Read Summary Body Lines";
            readonly description: "Minimum multiline body or literal length before read summaries collapse it";
        };
    };
    readonly "read.summarize.minCommentLines": {
        readonly type: "number";
        readonly default: 6;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Read Summaries";
            readonly label: "Read Summary Comment Lines";
            readonly description: "Minimum multiline block comment length before read summaries collapse it";
        };
    };
    readonly "read.summarize.minTotalLines": {
        readonly type: "number";
        readonly default: 100;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Read Summaries";
            readonly label: "Read Summary Minimum File Length";
            readonly description: "Files with fewer total lines are read verbatim instead of structurally summarized";
        };
    };
    readonly "read.summarize.unfoldUntil": {
        readonly type: "number";
        readonly default: 50;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Read Summaries";
            readonly label: "Read Summary Unfold Target";
            readonly description: "BFS-unfold elidable spans until the summary is at least this many visible lines. 0 keeps only the outermost elisions.";
        };
    };
    readonly "read.summarize.unfoldLimit": {
        readonly type: "number";
        readonly default: 100;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Read Summaries";
            readonly label: "Read Summary Unfold Ceiling";
            readonly description: "Hard ceiling on summary size while BFS-unfolding. An unfold whose revealed lines would exceed this is skipped (that span stays folded) and unfolding continues with the remaining spans.";
        };
    };
    readonly "read.toolResultPreview": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "Reading";
            readonly label: "Inline Read Previews";
            readonly description: "Render read tool results inline in the transcript instead of summary rows";
        };
    };
    readonly "lsp.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "files";
            readonly group: "LSP";
            readonly label: "LSP";
            readonly description: "Enable the lsp tool for code intelligence (definitions, references, diagnostics, rename)";
        };
    };
    readonly "lsp.lazy": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "files";
            readonly group: "LSP";
            readonly label: "Lazy LSP Startup";
            readonly description: "Start language servers on first use (lsp tool or editing a matching file type) instead of at session startup";
        };
    };
    readonly "lsp.shared": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "files";
            readonly group: "LSP";
            readonly label: "Shared Language Servers";
            readonly description: "Share one language server per project across omp instances via the daemon broker (falls back to private servers when unavailable)";
        };
    };
    readonly "lsp.formatOnWrite": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "LSP";
            readonly label: "Format on Write";
            readonly description: "Automatically format code files using LSP after writing";
        };
    };
    readonly "lsp.diagnosticsOnWrite": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "files";
            readonly group: "LSP";
            readonly label: "Diagnostics on Write";
            readonly description: "Return LSP diagnostics after writing code files";
        };
    };
    readonly "lsp.diagnosticsOnEdit": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "files";
            readonly group: "LSP";
            readonly label: "Diagnostics on Edit";
            readonly description: "Return LSP diagnostics after editing code files";
        };
    };
    readonly "lsp.diagnosticsDeduplicate": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "files";
            readonly group: "LSP";
            readonly label: "Deduplicate Diagnostics";
            readonly description: "Suppress post-edit LSP diagnostics already shown for a file; only surface new or changed ones";
        };
    };
    readonly "bash.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Bash";
            readonly label: "Bash";
            readonly description: "Enable the bash tool for shell command execution";
        };
    };
    readonly "bash.autoBackground.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Bash";
            readonly label: "Bash Auto-Background";
            readonly description: "Automatically background long-running bash commands and deliver the result later";
        };
    };
    readonly "bash.patterns": {
        readonly type: "array";
        readonly default: readonly [];
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Bash";
            readonly label: "Bash Approval Patterns";
            readonly description: "Ordered bash command approval rules. Each item has match and approval fields; only '*' wildcards are supported.";
        };
    };
    readonly "bashInterceptor.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Bash";
            readonly label: "Bash Interceptor";
            readonly description: "Block shell commands that have dedicated tools";
        };
    };
    readonly "bashInterceptor.patterns": {
        readonly type: "array";
        readonly default: BashInterceptorRule[];
    };
    readonly "bash.direnv": {
        readonly type: "enum";
        readonly values: readonly ["auto", "off"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Bash";
            readonly label: "direnv Auto-Load";
            readonly description: "Auto-load a repo's direnv/devenv `.envrc` into the bash session so devenv tools and env vars are present without manual `direnv exec`. Honors direnv's allow list: an `.envrc` you haven't `direnv allow`ed is never executed";
        };
    };
    readonly "bash.direnvLoadTimeoutMs": {
        readonly type: "number";
        readonly default: 30000;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Bash";
            readonly label: "direnv Load Timeout (ms)";
            readonly description: "Max wait for the first `direnv export` (a cold devenv shell can be slow); on timeout the session runs without the direnv env";
        };
    };
    readonly "shellMinimizer.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Bash";
            readonly label: "Shell Minimizer";
            readonly description: "Compress verbose shell output (git, npm, cargo, etc.) before returning it to the agent";
        };
    };
    readonly "shellMinimizer.settingsPath": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "shellMinimizer.only": {
        readonly type: "array";
        readonly default: string[];
    };
    readonly "shellMinimizer.except": {
        readonly type: "array";
        readonly default: string[];
    };
    readonly "shellMinimizer.maxCaptureBytes": {
        readonly type: "number";
        readonly default: number;
    };
    readonly "shellMinimizer.sourceOutlineLevel": {
        readonly type: "enum";
        readonly values: readonly ["default", "aggressive"];
        readonly default: "default";
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Bash";
            readonly label: "Shell Minimizer Source Outline";
            readonly description: "Source outline mode for cat/read of source files: default or aggressive";
        };
    };
    readonly "shellMinimizer.legacyFilters": {
        readonly type: "boolean";
        readonly default: undefined;
    };
    readonly "eval.py": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Eval & Runtimes";
            readonly label: "Python Eval Backend";
            readonly description: "Allow the eval tool to dispatch Python cells to the IPython kernel";
        };
    };
    readonly "eval.js": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Eval & Runtimes";
            readonly label: "JavaScript Eval Backend";
            readonly description: "Allow the eval tool to dispatch JavaScript cells to the in-process runtime";
        };
    };
    readonly "eval.rb": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Eval & Runtimes";
            readonly label: "Ruby Eval Backend";
            readonly description: "Allow the eval tool to dispatch Ruby cells to the persistent Ruby kernel";
        };
    };
    readonly "eval.jl": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Eval & Runtimes";
            readonly label: "Julia Eval Backend";
            readonly description: "Allow the eval tool to dispatch Julia cells to the persistent Julia kernel";
        };
    };
    readonly "eval.autoBackground.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Eval & Runtimes";
            readonly label: "Eval Auto-Background";
            readonly description: "Automatically background long-running eval cells and deliver the result later";
        };
    };
    readonly "eval.autoBackground.thresholdMs": {
        readonly type: "number";
        readonly default: 60000;
    };
    readonly "python.kernelMode": {
        readonly type: "enum";
        readonly values: readonly ["session", "per-call"];
        readonly default: "session";
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Eval & Runtimes";
            readonly label: "Python Kernel Mode";
            readonly description: "Keep the IPython kernel alive across eval calls or start fresh each time";
        };
    };
    readonly "python.interpreter": {
        readonly type: "string";
        readonly default: "";
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Eval & Runtimes";
            readonly label: "Python Interpreter";
            readonly description: "Optional path to an exact Python executable. When set, automatic Python runtime discovery is skipped.";
        };
    };
    readonly "ruby.interpreter": {
        readonly type: "string";
        readonly default: "";
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Eval & Runtimes";
            readonly label: "Ruby Interpreter";
            readonly description: "Optional path to an exact Ruby executable. When set, automatic Ruby runtime discovery is skipped.";
        };
    };
    readonly "julia.interpreter": {
        readonly type: "string";
        readonly default: "";
        readonly ui: {
            readonly tab: "shell";
            readonly group: "Eval & Runtimes";
            readonly label: "Julia Interpreter";
            readonly description: "Optional path to an exact Julia executable. When set, automatic Julia runtime discovery is skipped.";
        };
    };
    readonly "tools.approval": {
        readonly type: "record";
        readonly default: {};
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Approvals";
            readonly label: "Tool Approval Policies";
            readonly description: "Per-tool approval policies. Set to 'allow' to auto-approve, 'prompt' to require confirmation, or 'deny' to block. Overrides are honored in every approval mode.";
        };
    };
    readonly "tools.approvalMode": {
        readonly type: "enum";
        readonly values: readonly ["always-ask", "write", "yolo"];
        readonly default: "yolo";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Approvals";
            readonly label: "Tool Approval";
            readonly description: "Default approval behavior for tool calls. 'Always ask' auto-approves read-only tools only. 'Write' auto-approves read and workspace-write tools. 'Yolo' auto-approves all tiers; user policy may still prompt or block.";
            readonly options: readonly [{
                readonly value: "always-ask";
                readonly label: "Always ask";
                readonly description: "Auto-approve read-only tools; require confirmation for write and exec tools.";
            }, {
                readonly value: "write";
                readonly label: "Write";
                readonly description: "Auto-approve read-only and write tools; require confirmation for exec tools such as bash, eval, browser, and task.";
            }, {
                readonly value: "yolo";
                readonly label: "Yolo";
                readonly description: "Auto-approve read, write, and exec tools. User policy can still require confirmation or block calls.";
            }];
        };
    };
    readonly "todo.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Todos";
            readonly description: "Enable the todo tool for task tracking";
        };
    };
    readonly "todo.reminders": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Todos";
            readonly label: "Todo Reminders";
            readonly description: "Remind the agent to complete todos before stopping";
        };
    };
    readonly "todo.remindersMax": {
        readonly type: "number";
        readonly default: 3;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Todos";
            readonly label: "Todo Reminder Limit";
            readonly description: "Maximum number of todo reminders before giving up";
            readonly options: readonly [{
                readonly value: "1";
                readonly label: "1 reminder";
            }, {
                readonly value: "2";
                readonly label: "2 reminders";
            }, {
                readonly value: "3";
                readonly label: "3 reminders";
            }, {
                readonly value: "5";
                readonly label: "5 reminders";
            }];
        };
    };
    readonly "todo.eager": {
        readonly type: "enum";
        readonly values: readonly ["default", "preferred", "always"];
        readonly default: "default";
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Todos";
            readonly label: "Create Todos Automatically";
            readonly description: "How strongly to push automatic todo-list creation after the first message";
            readonly options: readonly [{
                readonly value: "default";
                readonly label: "Default";
                readonly description: "Model decides; no automatic todo list";
            }, {
                readonly value: "preferred";
                readonly label: "Preferred";
                readonly description: "Suggests a todo list on the first message (reminder, not forced)";
            }, {
                readonly value: "always";
                readonly label: "Always";
                readonly description: "Forces a comprehensive todo list on the first message";
            }];
        };
    };
    readonly "glob.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Glob";
            readonly description: "Enable the glob tool for glob-based file lookup";
        };
    };
    readonly "grep.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Grep";
            readonly description: "Enable the grep tool for regex content search";
        };
    };
    readonly "grep.contextBefore": {
        readonly type: "number";
        readonly default: 1;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Grep & Browser";
            readonly label: "Grep Context Before";
            readonly description: "Lines of context before each grep match";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "0 lines";
            }, {
                readonly value: "1";
                readonly label: "1 line";
            }, {
                readonly value: "2";
                readonly label: "2 lines";
            }, {
                readonly value: "3";
                readonly label: "3 lines";
            }, {
                readonly value: "5";
                readonly label: "5 lines";
            }];
        };
    };
    readonly "grep.contextAfter": {
        readonly type: "number";
        readonly default: 3;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Grep & Browser";
            readonly label: "Grep Context After";
            readonly description: "Lines of context after each grep match";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "0 lines";
            }, {
                readonly value: "1";
                readonly label: "1 line";
            }, {
                readonly value: "2";
                readonly label: "2 lines";
            }, {
                readonly value: "3";
                readonly label: "3 lines";
            }, {
                readonly value: "5";
                readonly label: "5 lines";
            }, {
                readonly value: "10";
                readonly label: "10 lines";
            }];
        };
    };
    readonly "astGrep.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "AST Grep";
            readonly description: "Enable the ast_grep tool for structural AST search";
        };
    };
    readonly "astEdit.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "AST Edit";
            readonly description: "Enable the ast_edit tool for structural AST rewrites";
        };
    };
    readonly "debug.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Debug";
            readonly description: "Enable the debug tool for DAP-based debugging";
        };
    };
    readonly "launch.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Launch";
            readonly description: "Enable the launch tool for supervising shared long-running project processes";
        };
    };
    readonly "speechgen.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Speech Generation";
            readonly description: "Enable the tts tool for on-device (Kokoro) or xAI Grok Voice speech-file synthesis";
        };
    };
    readonly "generate_image.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Generate Image";
            readonly description: "Enable the generate_image tool (text-to-image generation and editing). Exposed as an xd:// device when tools.xdev is on.";
        };
    };
    readonly "inspect_image.enabled": {
        readonly type: "boolean";
        readonly default: false;
    };
    readonly "inspect_image.mode": {
        readonly type: "enum";
        readonly values: readonly ["auto", "on", "off"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Inspect Image";
            readonly description: "Controls the inspect_image tool, which delegates image understanding to a vision-capable model. 'auto' exposes it only when the active model lacks native image input; 'on' always exposes it; 'off' never does.";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto (only for models without vision)";
            }, {
                readonly value: "on";
                readonly label: "On";
            }, {
                readonly value: "off";
                readonly label: "Off";
            }];
        };
    };
    readonly "computer.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Computer";
            readonly description: "Enable the scriptable host-desktop control tool (screenshots, input, accessibility)";
        };
    };
    readonly "computer.display": {
        readonly type: "string";
        readonly default: "all";
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Computer";
            readonly label: "Computer Display";
            readonly description: "Composite all displays or select a native display id";
        };
    };
    readonly "computer.maxWidth": {
        readonly type: "number";
        readonly default: 3840;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Computer";
            readonly label: "Computer Screenshot Width";
            readonly description: "Maximum composite screenshot width in pixels";
        };
    };
    readonly "computer.maxHeight": {
        readonly type: "number";
        readonly default: 2400;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Computer";
            readonly label: "Computer Screenshot Height";
            readonly description: "Maximum composite screenshot height in pixels";
        };
    };
    readonly "inspect_image.timeoutMs": {
        readonly type: "number";
        readonly default: 300000;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Execution";
            readonly label: "Inspect Image Timeout";
            readonly description: "Per-request timeout for the inspect_image vision-model call, in milliseconds. A stalled provider fails fast with a timeout error instead of blocking until manual abort. Set to 0 to disable the timeout.";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "Disabled";
            }, {
                readonly value: "60000";
                readonly label: "1 minute";
            }, {
                readonly value: "120000";
                readonly label: "2 minutes";
            }, {
                readonly value: "180000";
                readonly label: "3 minutes";
            }, {
                readonly value: "300000";
                readonly label: "5 minutes";
            }];
        };
    };
    readonly "checkpoint.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Checkpoint/Rewind";
            readonly description: "Enable the checkpoint and rewind tools for context checkpointing";
        };
    };
    readonly "fetch.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Read URLs";
            readonly description: "Allow the read tool to fetch and process URLs";
        };
    };
    readonly "vault.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Obsidian Vault";
            readonly description: "Enable the vault:// internal URL for reading and editing Obsidian vault content via the Obsidian CLI. When disabled, vault:// resolution is refused and the vault:// entry is omitted from the system prompt.";
        };
    };
    readonly "github.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "GitHub CLI";
            readonly description: "Enable the github tool (op-based dispatch for repository, issue, pull request, diff, search, checkout, push, and Actions watch workflows)";
        };
    };
    readonly "github.cache.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "GitHub";
            readonly label: "GitHub View Cache";
            readonly description: "Cache rendered issue/PR view output in ~/.omp/cache/github-cache.db so repeated reads are free";
        };
    };
    readonly "github.cache.softTtlSec": {
        readonly type: "number";
        readonly default: 300;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "GitHub";
            readonly label: "GitHub Cache Soft TTL";
            readonly description: "Within this window, cached issue/PR view rows are returned directly (seconds; default 5 minutes)";
        };
    };
    readonly "github.cache.hardTtlSec": {
        readonly type: "number";
        readonly default: 604800;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "GitHub";
            readonly label: "GitHub Cache Hard TTL";
            readonly description: "Past the soft TTL the cached row is returned and refreshed in the background; past the hard TTL it is dropped (seconds; default 7 days)";
        };
    };
    readonly "web_search.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Web Search";
            readonly description: "Enable the web_search tool for live web results";
        };
    };
    readonly "security.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Security";
            readonly description: "Enable OMP-native security scan planning, execution, and the read-only security:// resource namespace";
        };
    };
    readonly "ask.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Ask";
            readonly description: "Enable the ask tool for interactive user questions";
        };
    };
    readonly "browser.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Available Tools";
            readonly label: "Browser";
            readonly description: "Enable the browser tool for scripted Chromium automation (puppeteer)";
        };
    };
    readonly "browser.cdpUrl": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Grep & Browser";
            readonly label: "Browser CDP URL";
            readonly description: "Default HTTP CDP discovery endpoint (for example http://127.0.0.1:9222) to attach to instead of launching a browser. Explicit app.cdp_url or app.path on the tool call take precedence.";
        };
    };
    readonly "browser.relay": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Grep & Browser";
            readonly label: "Browser Relay";
            readonly description: "Drive your own Chrome tabs through the omp browser relay. Install the extension once (`omp browser-relay install`); the relay server auto-starts when the browser tool needs it. Takes precedence over Browser CDP URL; set PI_BROWSER_RELAY=0 or PI_BROWSER_RELAY=1 to override.";
        };
    };
    readonly "browser.relayUrl": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Grep & Browser";
            readonly label: "Browser Relay URL";
            readonly description: "omp browser relay endpoint (default http://127.0.0.1:9224).";
        };
    };
    readonly "browser.headless": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Grep & Browser";
            readonly label: "Headless Browser";
            readonly description: "Launch browser in headless mode (disable to show browser UI)";
        };
    };
    readonly "browser.cmux": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Grep & Browser";
            readonly label: "cmux Browser";
            readonly description: "Use cmux WKWebView surfaces for browser automation when a cmux socket is available. Set PI_BROWSER_CMUX=0 or PI_BROWSER_CMUX=1 to override.";
        };
    };
    readonly "browser.screenshotDir": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Grep & Browser";
            readonly label: "Screenshot Directory";
            readonly description: "Directory to save screenshots. If unset, screenshots go to a temp file. Supports ~. Examples: ~/Downloads, ~/Desktop, /sdcard/Download (Android)";
        };
    };
    readonly "tools.intentTracing": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Execution";
            readonly label: "Intent Tracing";
            readonly description: "Ask the agent to describe the intent of each tool call before executing it";
        };
    };
    readonly "tools.abortOnFabricatedResult": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Execution";
            readonly label: "Abort On Fabricated Tool Result";
            readonly description: "With in-band tool calls, stop the model immediately when it starts hallucinating a tool result mid-turn. Disable to let the model finish generating and discard the fabricated continuation instead.";
        };
    };
    readonly "tools.maxTimeout": {
        readonly type: "number";
        readonly default: 0;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Execution";
            readonly label: "Max Tool Timeout";
            readonly description: "Maximum timeout in seconds the agent can set for any tool (0 = no limit)";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "No limit";
            }, {
                readonly value: "30";
                readonly label: "30 seconds";
            }, {
                readonly value: "60";
                readonly label: "60 seconds";
            }, {
                readonly value: "120";
                readonly label: "120 seconds";
            }, {
                readonly value: "300";
                readonly label: "5 minutes";
            }, {
                readonly value: "600";
                readonly label: "10 minutes";
            }];
        };
    };
    readonly "async.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Execution";
            readonly label: "Async Execution";
            readonly description: "Enable async bash commands and background task execution";
        };
    };
    readonly "async.maxJobs": {
        readonly type: "number";
        readonly default: 100;
    };
    readonly "async.pollWaitDuration": {
        readonly type: "enum";
        readonly values: readonly ["5s", "10s", "30s", "1m", "5m", "smart"];
        readonly default: "smart";
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Execution";
            readonly label: "Max Poll Time";
            readonly description: "How long a `hub` wait watches background jobs before returning the current state. A fixed value waits that exact duration every time. `smart` adapts: it starts at 5s and lengthens with each back-to-back wait (up to 5m), then resets to 5s after about a minute without waiting.";
            readonly options: readonly [{
                readonly value: "5s";
                readonly label: "5 seconds";
            }, {
                readonly value: "10s";
                readonly label: "10 seconds";
            }, {
                readonly value: "30s";
                readonly label: "30 seconds";
            }, {
                readonly value: "1m";
                readonly label: "1 minute";
            }, {
                readonly value: "5m";
                readonly label: "5 minutes";
            }, {
                readonly value: "smart";
                readonly label: "Smart";
                readonly description: "Default — adaptive 5s→5m, resets when you stop polling";
            }];
        };
    };
    readonly "irc.timeoutMs": {
        readonly type: "number";
        readonly default: 120000;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Execution";
            readonly label: "IRC Timeout";
            readonly description: "Default timeout for hub message waits (and send await:true) in milliseconds; 0 disables the timeout";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "Disabled";
            }, {
                readonly value: "30000";
                readonly label: "30 seconds";
            }, {
                readonly value: "60000";
                readonly label: "1 minute";
            }, {
                readonly value: "120000";
                readonly label: "2 minutes";
            }, {
                readonly value: "300000";
                readonly label: "5 minutes";
            }];
        };
    };
    readonly "bash.autoBackground.thresholdMs": {
        readonly type: "number";
        readonly default: 60000;
    };
    readonly "tools.xdev": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Discovery & MCP";
            readonly label: "xd:// Tools";
            readonly description: "Mount rarely-used (discoverable) tools under xd:// device URLs driven via read/write instead of shipping their schemas on every request. Sessions without a granted write tool skip mounting and expose every tool top-level. Disable to expose every enabled tool top-level.";
        };
    };
    readonly "tools.xdevDocs": {
        readonly type: "enum";
        readonly values: readonly ["inline", "builtins", "catalog"];
        readonly default: "builtins";
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Discovery & MCP";
            readonly label: "xd:// Prompt Docs";
            readonly description: "Choose which mounted-device docs and schemas are inlined in the system prompt. Built-ins keeps core tools inline while MCP and extension tools stay on-demand.";
            readonly options: readonly [{
                readonly value: "inline";
                readonly label: "All Devices";
                readonly description: "Inline docs and schemas for every mounted device.";
            }, {
                readonly value: "builtins";
                readonly label: "Built-ins Only";
                readonly description: "Inline built-in docs; fetch MCP and extension docs on demand.";
            }, {
                readonly value: "catalog";
                readonly label: "Catalog Only";
                readonly description: "List every device; fetch all docs on demand.";
            }];
        };
    };
    readonly "tools.xdevInlineDevices": {
        readonly type: "array";
        readonly default: string[];
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Discovery & MCP";
            readonly label: "xd:// Inline Devices";
            readonly description: "When xd:// Prompt Docs is Built-ins Only, inline dynamic devices whose names match these glob patterns (for example mcp__context_mode_*). Catalog Only ignores this setting.";
        };
    };
    readonly "mcp.enableProjectConfig": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Discovery & MCP";
            readonly label: "MCP Project Config";
            readonly description: "Load .mcp.json/mcp.json from project root";
        };
    };
    readonly "mcp.renderMarkdownResults": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Discovery & MCP";
            readonly label: "MCP Markdown Results";
            readonly description: "Render non-JSON MCP text results as Markdown in the transcript";
        };
    };
    readonly "mcp.notifications": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Discovery & MCP";
            readonly label: "MCP Update Injection";
            readonly description: "Inject MCP resource updates into the agent conversation";
        };
    };
    readonly "mcp.notificationDebounceMs": {
        readonly type: "number";
        readonly default: 500;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Discovery & MCP";
            readonly label: "MCP Notification Debounce";
            readonly description: "Debounce window in milliseconds for MCP resource updates before injecting them into the conversation";
        };
    };
    readonly "plan.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Modes";
            readonly label: "Plan Mode";
            readonly description: "Enable plan mode for read-only exploration and planning before execution";
        };
    };
    readonly "plan.defaultOnStartup": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Modes";
            readonly label: "Start in Plan Mode";
            readonly description: "Automatically enter plan mode at the start of every new session";
            readonly condition: "planModeEnabled";
        };
    };
    readonly "goal.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Modes";
            readonly label: "Goal Mode";
            readonly description: "Enable per-session goal mode and the hidden goal tool";
        };
    };
    readonly "goal.statusInFooter": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Modes";
            readonly label: "Goal Status in Footer";
            readonly description: "Show token budget alongside the goal indicator in the status line";
        };
    };
    readonly "goal.continuationModes": {
        readonly type: "array";
        readonly default: readonly ["interactive"];
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Modes";
            readonly label: "Goal Continuation Modes";
            readonly description: "Run modes where active goals may auto-continue between turns";
        };
    };
    readonly "title.refreshOnReplan": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Modes";
            readonly label: "Refresh Title on Replan";
            readonly description: "Refresh generated session titles after todo init replans unless the title was set by the user";
        };
    };
    readonly "task.isolation.mode": {
        readonly type: "enum";
        readonly values: readonly ["none", "auto", "apfs", "btrfs", "zfs", "reflink", "overlayfs", "projfs", "block-clone", "rcopy"];
        readonly default: "none";
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Isolation";
            readonly label: "Isolation Mode";
            readonly description: 'Isolation backend for subagents. "auto" lets the native PAL pick the best available backend (CoW-aware filesystems, then overlayfs/ProjFS, then a git worktree / recursive-copy fallback).';
            readonly options: readonly [{
                readonly value: "none";
                readonly label: "None";
                readonly description: "No isolation";
            }, {
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Let the PAL pick the best available backend";
            }, {
                readonly value: "apfs";
                readonly label: "APFS";
                readonly description: "macOS clonefile reflink (APFS)";
            }, {
                readonly value: "btrfs";
                readonly label: "btrfs";
                readonly description: "btrfs subvolume snapshot";
            }, {
                readonly value: "zfs";
                readonly label: "ZFS";
                readonly description: "ZFS snapshot + clone";
            }, {
                readonly value: "reflink";
                readonly label: "Reflink";
                readonly description: "Linux FICLONE per-file reflink";
            }, {
                readonly value: "overlayfs";
                readonly label: "Overlayfs";
                readonly description: "Linux kernel overlay (or fuse-overlayfs fallback)";
            }, {
                readonly value: "projfs";
                readonly label: "ProjFS";
                readonly description: "Windows Projected File System";
            }, {
                readonly value: "block-clone";
                readonly label: "Block clone";
                readonly description: "Windows FSCTL_DUPLICATE_EXTENTS_TO_FILE (NTFS/ReFS)";
            }, {
                readonly value: "rcopy";
                readonly label: "Recursive copy";
                readonly description: "git worktree if available, otherwise recursive copy";
            }];
        };
    };
    readonly "task.isolation.apply": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Isolation";
            readonly label: "Apply Isolated Changes";
            readonly description: "Automatically apply successful isolated task changes to the parent checkout; disable to retain patch or branch artifacts";
        };
    };
    readonly "task.isolation.merge": {
        readonly type: "enum";
        readonly values: readonly ["patch", "branch"];
        readonly default: "patch";
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Isolation";
            readonly label: "Isolation Merge Strategy";
            readonly description: "How isolated task changes are integrated (patch apply or branch merge)";
            readonly options: readonly [{
                readonly value: "patch";
                readonly label: "Patch";
                readonly description: "Combine diffs and git apply";
            }, {
                readonly value: "branch";
                readonly label: "Branch";
                readonly description: "Commit per task, merge with --no-ff";
            }];
        };
    };
    readonly "task.isolation.commits": {
        readonly type: "enum";
        readonly values: readonly ["generic", "ai"];
        readonly default: "generic";
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Isolation";
            readonly label: "Isolation Commit Style";
            readonly description: "Commit message style for nested repo changes (generic or AI-generated)";
            readonly options: readonly [{
                readonly value: "generic";
                readonly label: "Generic";
                readonly description: "Static commit message";
            }, {
                readonly value: "ai";
                readonly label: "AI";
                readonly description: "AI-generated commit message from diff";
            }];
        };
    };
    readonly "worktree.base": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Isolation";
            readonly label: "Worktree Base Directory";
            readonly description: "Base directory for agent-managed worktrees — task-isolation copies, `github` PR checkouts, and `omp worktree` cleanup all live here. Unset uses ~/.omp/wt. Must be an absolute or ~-relative path; relative paths are ignored. The OMP_WORKTREE_DIR env var overrides this.";
        };
    };
    readonly "task.eager": {
        readonly type: "enum";
        readonly values: readonly ["default", "preferred", "always"];
        readonly default: "default";
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Prefer Task Delegation";
            readonly description: "How strongly to push delegating work to subagents";
            readonly options: readonly [{
                readonly value: "default";
                readonly label: "Default";
                readonly description: "Model decides when to delegate";
            }, {
                readonly value: "preferred";
                readonly label: "Preferred";
                readonly description: "Adds delegation guidance to the system prompt";
            }, {
                readonly value: "always";
                readonly label: "Always";
                readonly description: "Prompt guidance plus a first-turn delegation reminder";
            }];
        };
    };
    readonly "task.batch": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Batch Task Calls";
            readonly description: "Switch the task tool to its batch shape: one call carries { context, tasks[] } — one subagent per item, with an optional per-item agent (defaulting to the session spawn-policy agent), per-item isolation, and a required shared context prepended to every assignment. With async.enabled=true, each spawn runs as an independent background agent with the normal idle/parked lifecycle; otherwise the call blocks for merged results. Disable to restore the flat single-spawn schema.";
        };
    };
    readonly "task.enableEffort": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Per-Task Effort";
            readonly description: "Expose the optional effort parameter on task spawns, allowing callers to override each subagent's thinking level";
        };
    };
    readonly "task.maxConcurrency": {
        readonly type: "number";
        readonly default: 32;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Max Concurrent Tasks";
            readonly description: "Maximum number of subagents running concurrently";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "Unlimited";
            }, {
                readonly value: "1";
                readonly label: "1 task";
            }, {
                readonly value: "2";
                readonly label: "2 tasks";
            }, {
                readonly value: "4";
                readonly label: "4 tasks";
            }, {
                readonly value: "8";
                readonly label: "8 tasks";
            }, {
                readonly value: "16";
                readonly label: "16 tasks";
            }, {
                readonly value: "32";
                readonly label: "32 tasks";
            }, {
                readonly value: "64";
                readonly label: "64 tasks";
            }];
        };
    };
    readonly "task.enableLsp": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "LSP in Subagents";
            readonly description: "Allow subagents spawned via the task tool to use the lsp tool. Off by default to keep subagents cheap; enable when LSP-aware delegation is worth the extra tokens.";
        };
    };
    readonly "task.maxRecursionDepth": {
        readonly type: "number";
        readonly default: 2;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Max Task Recursion";
            readonly description: "How many levels deep subagents can spawn their own subagents";
            readonly options: readonly [{
                readonly value: "-1";
                readonly label: "Unlimited";
            }, {
                readonly value: "0";
                readonly label: "None";
            }, {
                readonly value: "1";
                readonly label: "Single";
            }, {
                readonly value: "2";
                readonly label: "Double";
            }, {
                readonly value: "3";
                readonly label: "Triple";
            }];
        };
    };
    readonly "task.maxRuntimeMs": {
        readonly type: "number";
        readonly default: 0;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Max Subagent Runtime";
            readonly description: "Hard wall-clock limit per subagent (ms). 0 disables it. Defense-in-depth against provider-side stream hangs that escape the inference-layer watchdog; triggers a normal subagent abort with a 'timed out' reason.";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "Unlimited";
                readonly description: "Default";
            }, {
                readonly value: "300000";
                readonly label: "5 minutes";
            }, {
                readonly value: "900000";
                readonly label: "15 minutes";
            }, {
                readonly value: "1800000";
                readonly label: "30 minutes";
            }, {
                readonly value: "3600000";
                readonly label: "1 hour";
            }];
        };
    };
    readonly "task.agentIdleTtlMs": {
        readonly type: "number";
        readonly default: 420000;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Agent Idle TTL";
            readonly description: "How long an idle subagent stays live in memory before being parked to disk (ms). Parked agents are revived automatically when messaged or resumed. 0 keeps idle agents live until exit.";
        };
    };
    readonly "task.softRequestBudget": {
        readonly type: "number";
        readonly default: 200;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Soft Subagent Request Budget";
            readonly description: "Soft per-subagent request budget (assistant requests per run). Crossing it injects a wrap-up steering notice (see task.softRequestBudgetNotice); at 1.5x the budget the run is force-stopped and the agent must yield its partial findings. 0 disables the guard. Bundled scout/sonic agents cap out at a lower built-in budget, so a value below that cap still applies to them.";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "Disabled";
            }, {
                readonly value: "90";
                readonly label: "90 requests";
            }, {
                readonly value: "150";
                readonly label: "150 requests";
            }, {
                readonly value: "200";
                readonly label: "200 requests";
                readonly description: "Default";
            }];
        };
    };
    readonly "task.softRequestBudgetNotice": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Soft Request Budget Notice";
            readonly description: "Inject one steering notice when a subagent crosses its soft request budget, asking it to wrap up before the 1.5x forced-yield stop.";
        };
    };
    readonly "task.maxEffort": {
        readonly type: "enum";
        readonly values: readonly import("@oh-my-pi/pi-catalog").Effort[];
        readonly default: "max";
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Maximum Per-Spawn Effort";
            readonly description: "Maximum reasoning effort allowed for the task tool's per-spawn effort hint. Lower values prevent callers from escalating subagents above this ceiling; the default preserves the model's full range.";
            readonly options: import("../thinking.js").ThinkingLevelMetadata[];
        };
    };
    readonly "task.disabledAgents": {
        readonly type: "array";
        readonly default: string[];
    };
    readonly "task.agentModelOverrides": {
        readonly type: "record";
        readonly default: Record<string, string | string[]>;
    };
    readonly "task.agentPrewalk": {
        readonly type: "record";
        readonly default: Record<string, string>;
    };
    readonly "task.agentAdvisor": {
        readonly type: "record";
        readonly default: Record<string, string>;
    };
    readonly "task.prewalk": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Subagents";
            readonly label: "Generic Task Prewalk";
            readonly description: "Arm prewalk for the bundled generic `task` subagent: it starts on its resolved model, plans and begins the implementation, then hands off to the 'smol' role at its first edit/write. Per-agent overrides (task.agentPrewalk, configured from the /agents hub) and user agent `prewalk` frontmatter apply regardless of this toggle.";
        };
    };
    readonly "tasks.todoClearDelay": {
        readonly type: "number";
        readonly default: 60;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Todos";
            readonly label: "Todo Auto-Clear Delay";
            readonly description: "Delay before completed or abandoned todos are removed from the todo widget";
            readonly options: readonly [{
                readonly value: "0";
                readonly label: "Instant";
            }, {
                readonly value: "60";
                readonly label: "1 minute";
                readonly description: "Default";
            }, {
                readonly value: "300";
                readonly label: "5 minutes";
            }, {
                readonly value: "900";
                readonly label: "15 minutes";
            }, {
                readonly value: "1800";
                readonly label: "30 minutes";
            }, {
                readonly value: "3600";
                readonly label: "1 hour";
            }, {
                readonly value: "-1";
                readonly label: "Never";
            }];
        };
    };
    readonly "task.showResolvedModelBadge": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "appearance";
            readonly group: "Display";
            readonly label: "Show Resolved Model Badge";
            readonly description: "Display the actual model ID used by each subagent in the task widget status line";
        };
    };
    readonly "skills.enabled": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "skills.enableSkillCommands": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Commands & Skills";
            readonly label: "Skill Commands";
            readonly description: "Register skills as /skill:name commands";
        };
    };
    readonly "skills.enableCodexUser": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "skills.enableClaudeUser": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "skills.enableClaudeProject": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "skills.enablePiUser": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "skills.enablePiProject": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "skills.enableAgentsUser": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "skills.enableAgentsProject": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "skills.customDirectories": {
        readonly type: "array";
        readonly default: string[];
    };
    readonly "skills.ignoredSkills": {
        readonly type: "array";
        readonly default: string[];
    };
    readonly "skills.includeSkills": {
        readonly type: "array";
        readonly default: string[];
    };
    readonly "commands.enableClaudeUser": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Commands & Skills";
            readonly label: "Claude User Commands";
            readonly description: "Load commands from ~/.claude/commands/";
        };
    };
    readonly "commands.enableClaudeProject": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Commands & Skills";
            readonly label: "Claude Project Commands";
            readonly description: "Load commands from .claude/commands/";
        };
    };
    readonly "commands.enableOpencodeUser": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Commands & Skills";
            readonly label: "OpenCode User Commands";
            readonly description: "Load commands from ~/.config/opencode/commands/";
        };
    };
    readonly "commands.enableOpencodeProject": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tasks";
            readonly group: "Commands & Skills";
            readonly label: "OpenCode Project Commands";
            readonly description: "Load commands from .opencode/commands/";
        };
    };
    readonly "secrets.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Privacy";
            readonly label: "Hide Secrets";
            readonly description: "Obfuscate configured secrets and redact credential-shaped tokens before sending to AI providers";
        };
    };
    readonly "providers.ollama-cloud.maxConcurrency": {
        readonly type: "number";
        readonly default: 3;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Ollama Cloud Max Concurrency";
            readonly description: "Maximum concurrent Ollama Cloud subagent runs per process; 0 disables the provider-specific limit";
        };
    };
    readonly "providers.webSearchOrder": {
        readonly type: "array";
        readonly default: SearchProviderId[];
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Web Search Provider Order";
            readonly description: "Prioritized providers for the web_search tool; unlisted providers retain their default order afterward";
            readonly options: ({
                readonly value: "perplexity";
                readonly label: "Perplexity";
                readonly description: "Uses auth when configured; explicit selection falls back to anonymous search";
            } | {
                readonly value: "gemini";
                readonly label: "Gemini";
                readonly description: "Google Search grounding via Gemini (uses google-gemini-cli or google-antigravity OAuth)";
            } | {
                readonly value: "anthropic";
                readonly label: "Anthropic";
                readonly description: "Claude's native web_search tool (uses Anthropic OAuth or ANTHROPIC_API_KEY)";
            } | {
                readonly value: "codex";
                readonly label: "OpenAI";
                readonly description: "OpenAI's native web_search (uses ChatGPT OAuth via /login openai-codex)";
            } | {
                readonly value: "xai";
                readonly label: "xAI";
                readonly description: "Grok web search via xAI Responses API (uses SuperGrok/X Premium+ OAuth via /login xai-oauth, or XAI_API_KEY)";
            } | {
                readonly value: "zai";
                readonly label: "Z.AI";
                readonly description: "Calls Z.AI webSearchPrime MCP";
            } | {
                readonly value: "exa";
                readonly label: "Exa";
                readonly description: "API via /login exa or EXA_API_KEY; explicit keyless fallback via MCP";
            } | {
                readonly value: "tinyfish";
                readonly label: "TinyFish";
                readonly description: "Requires TINYFISH_API_KEY";
            } | {
                readonly value: "jina";
                readonly label: "Jina";
                readonly description: "Requires JINA_API_KEY";
            } | {
                readonly value: "kagi";
                readonly label: "Kagi";
                readonly description: "Requires KAGI_API_KEY and Kagi Search API beta access";
            } | {
                readonly value: "tavily";
                readonly label: "Tavily";
                readonly description: "Requires TAVILY_API_KEY";
            } | {
                readonly value: "firecrawl";
                readonly label: "Firecrawl";
                readonly description: "Uses Firecrawl API when FIRECRAWL_API_KEY is set; falls back to keyless mode";
            } | {
                readonly value: "brave";
                readonly label: "Brave";
                readonly description: "Requires BRAVE_API_KEY";
            } | {
                readonly value: "kimi";
                readonly label: "Kimi";
                readonly description: "Kimi Code search (requires a Kimi Code Console key via KIMI_SEARCH_API_KEY/MOONSHOT_SEARCH_API_KEY or /login kimi-code; not MOONSHOT_API_KEY)";
            } | {
                readonly value: "parallel";
                readonly label: "Parallel";
                readonly description: "Requires PARALLEL_API_KEY";
            } | {
                readonly value: "synthetic";
                readonly label: "Synthetic";
                readonly description: "Requires SYNTHETIC_API_KEY";
            } | {
                readonly value: "searxng";
                readonly label: "SearXNG";
                readonly description: "Requires SEARXNG_ENDPOINT or searxng.endpoint";
            } | {
                readonly value: "startpage";
                readonly label: "Startpage";
                readonly description: "Credential-free scrape of Startpage (Google-backed) results; may be bot-challenged";
            } | {
                readonly value: "duckduckgo";
                readonly label: "DuckDuckGo";
                readonly description: "Credential-free best-effort fallback; may be bot-challenged on datacenter/shared-egress IPs";
            } | {
                readonly value: "ecosia";
                readonly label: "Ecosia";
                readonly description: "Credential-free browser-backed scrape of Ecosia (Google-backed) results";
            } | {
                readonly value: "google";
                readonly label: "Google";
                readonly description: "Credential-free browser-backed fallback; slower and may be bot-challenged";
            } | {
                readonly value: "mojeek";
                readonly label: "Mojeek";
                readonly description: "Credential-free browser-backed scrape of Mojeek's independent index";
            } | {
                readonly value: "public";
                readonly label: "Public Web";
                readonly description: "Queries every credential-free engine in parallel and consolidates deduplicated results";
            })[];
            readonly ordered: true;
        };
    };
    readonly "providers.webSearchExclude": {
        readonly type: "array";
        readonly default: SearchProviderId[];
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Excluded Web Search Providers";
            readonly description: "Providers that web_search should never use, even as fallbacks";
            readonly options: ({
                readonly value: "perplexity";
                readonly label: "Perplexity";
                readonly description: "Uses auth when configured; explicit selection falls back to anonymous search";
            } | {
                readonly value: "gemini";
                readonly label: "Gemini";
                readonly description: "Google Search grounding via Gemini (uses google-gemini-cli or google-antigravity OAuth)";
            } | {
                readonly value: "anthropic";
                readonly label: "Anthropic";
                readonly description: "Claude's native web_search tool (uses Anthropic OAuth or ANTHROPIC_API_KEY)";
            } | {
                readonly value: "codex";
                readonly label: "OpenAI";
                readonly description: "OpenAI's native web_search (uses ChatGPT OAuth via /login openai-codex)";
            } | {
                readonly value: "xai";
                readonly label: "xAI";
                readonly description: "Grok web search via xAI Responses API (uses SuperGrok/X Premium+ OAuth via /login xai-oauth, or XAI_API_KEY)";
            } | {
                readonly value: "zai";
                readonly label: "Z.AI";
                readonly description: "Calls Z.AI webSearchPrime MCP";
            } | {
                readonly value: "exa";
                readonly label: "Exa";
                readonly description: "API via /login exa or EXA_API_KEY; explicit keyless fallback via MCP";
            } | {
                readonly value: "tinyfish";
                readonly label: "TinyFish";
                readonly description: "Requires TINYFISH_API_KEY";
            } | {
                readonly value: "jina";
                readonly label: "Jina";
                readonly description: "Requires JINA_API_KEY";
            } | {
                readonly value: "kagi";
                readonly label: "Kagi";
                readonly description: "Requires KAGI_API_KEY and Kagi Search API beta access";
            } | {
                readonly value: "tavily";
                readonly label: "Tavily";
                readonly description: "Requires TAVILY_API_KEY";
            } | {
                readonly value: "firecrawl";
                readonly label: "Firecrawl";
                readonly description: "Uses Firecrawl API when FIRECRAWL_API_KEY is set; falls back to keyless mode";
            } | {
                readonly value: "brave";
                readonly label: "Brave";
                readonly description: "Requires BRAVE_API_KEY";
            } | {
                readonly value: "kimi";
                readonly label: "Kimi";
                readonly description: "Kimi Code search (requires a Kimi Code Console key via KIMI_SEARCH_API_KEY/MOONSHOT_SEARCH_API_KEY or /login kimi-code; not MOONSHOT_API_KEY)";
            } | {
                readonly value: "parallel";
                readonly label: "Parallel";
                readonly description: "Requires PARALLEL_API_KEY";
            } | {
                readonly value: "synthetic";
                readonly label: "Synthetic";
                readonly description: "Requires SYNTHETIC_API_KEY";
            } | {
                readonly value: "searxng";
                readonly label: "SearXNG";
                readonly description: "Requires SEARXNG_ENDPOINT or searxng.endpoint";
            } | {
                readonly value: "startpage";
                readonly label: "Startpage";
                readonly description: "Credential-free scrape of Startpage (Google-backed) results; may be bot-challenged";
            } | {
                readonly value: "duckduckgo";
                readonly label: "DuckDuckGo";
                readonly description: "Credential-free best-effort fallback; may be bot-challenged on datacenter/shared-egress IPs";
            } | {
                readonly value: "ecosia";
                readonly label: "Ecosia";
                readonly description: "Credential-free browser-backed scrape of Ecosia (Google-backed) results";
            } | {
                readonly value: "google";
                readonly label: "Google";
                readonly description: "Credential-free browser-backed fallback; slower and may be bot-challenged";
            } | {
                readonly value: "mojeek";
                readonly label: "Mojeek";
                readonly description: "Credential-free browser-backed scrape of Mojeek's independent index";
            } | {
                readonly value: "public";
                readonly label: "Public Web";
                readonly description: "Queries every credential-free engine in parallel and consolidates deduplicated results";
            })[];
        };
    };
    readonly "providers.webSearchTimeoutSeconds": {
        readonly type: "number";
        readonly default: 60;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Web Search Timeout";
            readonly description: "Hard timeout for each provider's search transport before web_search advances to the next fallback, in seconds (maximum 300)";
            readonly options: readonly [{
                readonly value: "30";
                readonly label: "30 seconds";
            }, {
                readonly value: "60";
                readonly label: "1 minute";
            }, {
                readonly value: "120";
                readonly label: "2 minutes";
            }, {
                readonly value: "180";
                readonly label: "3 minutes";
            }, {
                readonly value: "300";
                readonly label: "5 minutes";
            }];
        };
    };
    readonly "providers.webSearchGeminiModel": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Gemini web_search model";
            readonly description: "Model ID for Gemini Google Search grounding. Defaults to gemini-2.5-flash.";
        };
    };
    readonly "providers.antigravityEndpoint": {
        readonly type: "enum";
        readonly values: readonly ["auto", "production", "sandbox"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Antigravity Endpoint Mode";
            readonly description: "Endpoint routing strategy for google-antigravity providers (chat, search, image, discovery)";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Try production endpoint, fail over to sandbox on 5xx/429";
            }, {
                readonly value: "production";
                readonly label: "Production Only";
                readonly description: "Force production endpoint only";
            }, {
                readonly value: "sandbox";
                readonly label: "Sandbox Only";
                readonly description: "Force sandbox endpoint only";
            }];
        };
    };
    readonly "providers.imageOrder": {
        readonly type: "array";
        readonly default: ImageProvider[];
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Image Provider Order";
            readonly description: "Prioritized providers for image generation; unlisted providers follow the active session provider and the built-in order";
            readonly options: readonly [{
                readonly value: "openai";
                readonly label: "OpenAI";
                readonly description: "OPENAI_API_KEY (gpt-image-2) or active GPT model; falls back to a connected Codex subscription";
            }, {
                readonly value: "openai-codex";
                readonly label: "OpenAI Codex (ChatGPT)";
                readonly description: "Uses a connected Codex / ChatGPT subscription — no OPENAI_API_KEY needed";
            }, {
                readonly value: "antigravity";
                readonly label: "Antigravity";
                readonly description: "Requires google-antigravity OAuth";
            }, {
                readonly value: "xai";
                readonly label: "xAI Grok Imagine";
                readonly description: "Requires xAI Grok OAuth or XAI_API_KEY";
            }, {
                readonly value: "gemini";
                readonly label: "Gemini";
                readonly description: "Requires GEMINI_API_KEY";
            }, {
                readonly value: "openrouter";
                readonly label: "OpenRouter";
                readonly description: "Requires OPENROUTER_API_KEY";
            }];
            readonly ordered: true;
        };
    };
    readonly "providers.fireworksTier": {
        readonly type: "enum";
        readonly values: readonly ["standard", "priority"];
        readonly default: "standard";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Fireworks";
            readonly label: "Fireworks Tier";
            readonly description: 'Serving path for Fireworks requests. Priority sends `service_tier: "priority"` for higher reliability during peak traffic at a higher price; Standard omits it. Fast (`-fast`) models ignore this — Fast is its own serving path.';
            readonly options: readonly [{
                readonly value: "standard";
                readonly label: "Standard";
                readonly description: "Default serving path (no service_tier)";
            }, {
                readonly value: "priority";
                readonly label: "Priority";
                readonly description: "Priority serving path: higher reliability, premium per-token pricing";
            }];
        };
    };
    readonly "live.voice": {
        readonly type: "enum";
        readonly values: ("arbor" | "breeze" | "cove" | "ember" | "juniper" | "maple" | "sol" | "spruce" | "vale")[];
        readonly default: "sol";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Live Voice";
            readonly description: "Voice used by Codex-backed realtime voice sessions";
            readonly options: readonly [{
                readonly value: "arbor";
                readonly label: "Arbor";
            }, {
                readonly value: "breeze";
                readonly label: "Breeze";
            }, {
                readonly value: "cove";
                readonly label: "Cove";
            }, {
                readonly value: "ember";
                readonly label: "Ember";
            }, {
                readonly value: "juniper";
                readonly label: "Juniper";
            }, {
                readonly value: "maple";
                readonly label: "Maple";
            }, {
                readonly value: "sol";
                readonly label: "Sol";
            }, {
                readonly value: "spruce";
                readonly label: "Spruce";
            }, {
                readonly value: "vale";
                readonly label: "Vale";
            }];
        };
    };
    readonly "providers.tts": {
        readonly type: "enum";
        readonly values: readonly ["auto", "local", "xai"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Text-to-Speech Provider";
            readonly description: "Backend for the tts tool: local on-device neural TTS (Kokoro-82M) or xAI Grok Voice";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Prefer local on-device TTS; route .mp3 output to xAI when credentials exist";
            }, {
                readonly value: "local";
                readonly label: "Local";
                readonly description: "On-device neural TTS (Kokoro-82M); output is WAV/PCM16";
            }, {
                readonly value: "xai";
                readonly label: "xAI Grok Voice";
                readonly description: "Requires xAI Grok OAuth or XAI_API_KEY; MP3 or WAV";
            }];
        };
    };
    readonly "tts.localModel": {
        readonly type: "enum";
        readonly values: readonly ["kokoro"];
        readonly default: "kokoro";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Local TTS Model";
            readonly description: "On-device neural TTS model (Kokoro-82M) used by the local TTS backend";
            readonly options: readonly [{
                readonly value: "kokoro";
                readonly label: "Kokoro-82M";
                readonly description: "Kokoro-82M neural TTS — SoTA on-device quality, multi-voice, fully local";
            }];
        };
    };
    readonly "tts.localVoice": {
        readonly type: "enum";
        readonly values: readonly string[];
        readonly default: "af_heart";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Local TTS Voice";
            readonly description: "Kokoro voice used by the local TTS backend (American/British, female/male)";
            readonly options: readonly {
                value: string;
                label: string;
            }[];
        };
    };
    readonly "speech.enabled": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Speech Vocalization";
            readonly description: "Speak the assistant's output aloud through the speakers as it streams";
        };
    };
    readonly "speech.mode": {
        readonly type: "enum";
        readonly values: readonly ["all", "assistant", "yield"];
        readonly default: "assistant";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Speech Vocalization Mode";
            readonly description: "What to speak: all = assistant messages + thinking; assistant = messages only; yield = only the final message at turn end";
            readonly options: readonly [{
                readonly value: "all";
                readonly label: "All (messages + thinking)";
            }, {
                readonly value: "assistant";
                readonly label: "Assistant messages";
            }, {
                readonly value: "yield";
                readonly label: "Final message only";
            }];
        };
    };
    readonly "speech.enhanced": {
        readonly type: "boolean";
        readonly default: false;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Enhanced Speech Rewriting";
            readonly description: "Rewrite assistant output into natural spoken prose with the tiny/smol model before synthesis (describes code, drops links and markdown). Falls back to mechanical cleanup on failure";
        };
    };
    readonly "speech.voice": {
        readonly type: "enum";
        readonly values: readonly string[];
        readonly default: "af_heart";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Speech Vocalization Voice";
            readonly description: "Kokoro voice used when speaking the assistant's output aloud";
            readonly options: readonly {
                value: string;
                label: string;
            }[];
        };
    };
    readonly "providers.tinyModel": {
        readonly type: "enum";
        readonly values: readonly ["online", "lfm2-350m", "qwen3-0.6b", "gemma-270m", "qwen2.5-0.5b", "lfm2-700m"];
        readonly default: "online";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Tiny Model";
            readonly label: "Tiny Model";
            readonly description: "Session-title model: online (the TINY role from /models, else @smol) by default, or a local on-device model";
            readonly options: ({
                value: "online";
                label: string;
                description: string;
            } | {
                value: "gemma-270m" | "lfm2-350m" | "lfm2-700m" | "qwen2.5-0.5b" | "qwen3-0.6b";
                label: "Gemma 270M" | "LFM2 350M" | "LFM2 700M" | "Qwen2.5 0.5B" | "Qwen3 0.6B";
                description: "Balanced local fallback; moderate quality and cache footprint." | "Highest-quality local option; larger and slower than LFM2 350M." | "Most robust local option; slower first load, about 500 MB cached." | "Recommended local model; best speed/quality balance, about 212 MB cached." | "Smallest viable local option; lower quality, lowest cache footprint.";
            })[];
        };
    };
    readonly "providers.tinyModelDevice": {
        readonly type: "enum";
        readonly values: readonly ["default", "gpu", "cpu", "metal", "webgpu", "cuda", "dml", "coreml", "auto", "wasm", "webnn", "webnn-gpu", "webnn-cpu", "webnn-npu"];
        readonly default: "default";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Tiny Model";
            readonly label: "Tiny Model Device";
            readonly description: "ONNX execution provider for local tiny models (titles + memory). Default uses CPU-only inference. The PI_TINY_DEVICE env var overrides this.";
            readonly options: readonly [{
                readonly value: "default";
                readonly label: "Default";
                readonly description: "CPU-only inference";
            }, {
                readonly value: "gpu";
                readonly label: "GPU";
                readonly description: "Accelerated provider (WebGPU/Metal, CUDA, or DirectML)";
            }, {
                readonly value: "cpu";
                readonly label: "CPU";
                readonly description: "CPU-only inference";
            }, {
                readonly value: "metal";
                readonly label: "Metal";
                readonly description: "WebGPU alias for Apple GPUs";
            }, {
                readonly value: "webgpu";
                readonly label: "WebGPU";
                readonly description: "WebGPU/Metal backend";
            }, {
                readonly value: "cuda";
                readonly label: "CUDA";
                readonly description: "NVIDIA CUDA (Linux x64)";
            }, {
                readonly value: "dml";
                readonly label: "DirectML";
                readonly description: "DirectML backend (Windows)";
            }, {
                readonly value: "coreml";
                readonly label: "CoreML";
                readonly description: "Apple CoreML (opt-in; can fail to load)";
            }, {
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Let ONNX Runtime choose a provider";
            }, {
                readonly value: "wasm";
                readonly label: "WASM";
                readonly description: "WebAssembly backend";
            }, {
                readonly value: "webnn";
                readonly label: "WebNN";
                readonly description: "WebNN backend";
            }, {
                readonly value: "webnn-gpu";
                readonly label: "WebNN GPU";
                readonly description: "WebNN GPU device";
            }, {
                readonly value: "webnn-cpu";
                readonly label: "WebNN CPU";
                readonly description: "WebNN CPU device";
            }, {
                readonly value: "webnn-npu";
                readonly label: "WebNN NPU";
                readonly description: "WebNN NPU device";
            }];
        };
    };
    readonly "providers.tinyModelDtype": {
        readonly type: "enum";
        readonly values: readonly ["default", "q4", "q4f16", "q8", "fp16", "fp32", "int8", "uint8", "bnb4", "q2", "q2f16", "q1", "q1f16", "auto"];
        readonly default: "default";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Tiny Model";
            readonly label: "Tiny Model Precision";
            readonly description: "ONNX quantization/precision for local tiny models. Default uses each model's shipped dtype (q4); lower precision is faster, higher is more faithful. The PI_TINY_DTYPE env var overrides this.";
            readonly options: readonly [{
                readonly value: "default";
                readonly label: "Default";
                readonly description: "Each model's shipped dtype (currently q4)";
            }, {
                readonly value: "q4";
                readonly label: "q4";
                readonly description: "4-bit weights; smallest and fastest";
            }, {
                readonly value: "q4f16";
                readonly label: "q4f16";
                readonly description: "4-bit weights with fp16 activations";
            }, {
                readonly value: "q8";
                readonly label: "q8";
                readonly description: "8-bit quantization";
            }, {
                readonly value: "fp16";
                readonly label: "fp16";
                readonly description: "16-bit float; higher fidelity, larger";
            }, {
                readonly value: "fp32";
                readonly label: "fp32";
                readonly description: "Full precision; largest and slowest";
            }, {
                readonly value: "int8";
                readonly label: "int8";
                readonly description: "Signed 8-bit integer";
            }, {
                readonly value: "uint8";
                readonly label: "uint8";
                readonly description: "Unsigned 8-bit integer";
            }, {
                readonly value: "bnb4";
                readonly label: "bnb4";
                readonly description: "bitsandbytes 4-bit";
            }, {
                readonly value: "q2";
                readonly label: "q2";
                readonly description: "2-bit weights";
            }, {
                readonly value: "q2f16";
                readonly label: "q2f16";
                readonly description: "2-bit weights with fp16 activations";
            }, {
                readonly value: "q1";
                readonly label: "q1";
                readonly description: "1-bit weights";
            }, {
                readonly value: "q1f16";
                readonly label: "q1f16";
                readonly description: "1-bit weights with fp16 activations";
            }, {
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Let transformers.js choose per device";
            }];
        };
    };
    readonly "providers.memoryModel": {
        readonly type: "enum";
        readonly values: readonly ["online", "qwen3-1.7b", "llama3.2:3b", "gemma-3-1b", "qwen2.5-1.5b", "lfm2-1.2b"];
        readonly default: "online";
        readonly ui: {
            readonly tab: "memory";
            readonly group: "General";
            readonly label: "Memory Model";
            readonly description: "Mnemopi LLM for fact extraction + consolidation: online (the TINY role from /models, else smol/remote) by default, or a local on-device model";
            readonly condition: "mnemopiActive";
            readonly options: ({
                value: "online";
                label: string;
                description: string;
            } | {
                value: "gemma-3-1b" | "lfm2-1.2b" | "llama3.2:3b" | "qwen2.5-1.5b" | "qwen3-1.7b";
                label: "Gemma 3 1B" | "LFM2 1.2B" | "Llama 3.2 3B" | "Qwen2.5 1.5B" | "Qwen3 1.7B";
                description: "Best consolidation/dedup; lighter footprint, but leaks small talk during extraction." | "Best extraction granularity (atomic facts); weaker consolidation." | "Disabled for local inference: onnxruntime-node cannot run this ONNX export's RotaryEmbedding cache updates." | "Fastest load; solid all-rounder, slightly noisier extraction labels." | "Larger Llama 3.2 option for local memory/classifier tasks; higher quality potential at higher disk/RAM/latency cost.";
            })[];
        };
    };
    readonly "providers.autoThinkingModel": {
        readonly type: "enum";
        readonly values: readonly ["online", "qwen3-1.7b", "llama3.2:3b", "gemma-3-1b", "qwen2.5-1.5b", "lfm2-1.2b"];
        readonly default: "online";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Auto Thinking Model";
            readonly description: "Difficulty classifier for the `auto` thinking level: online (the TINY role from /models, else smol) by default, or a local on-device model";
            readonly condition: "autoThinkingActive";
            readonly options: ({
                value: "online";
                label: string;
                description: string;
            } | {
                value: "gemma-3-1b" | "lfm2-1.2b" | "llama3.2:3b" | "qwen2.5-1.5b" | "qwen3-1.7b";
                label: "Gemma 3 1B" | "LFM2 1.2B" | "Llama 3.2 3B" | "Qwen2.5 1.5B" | "Qwen3 1.7B";
                description: "Best consolidation/dedup; lighter footprint, but leaks small talk during extraction." | "Best extraction granularity (atomic facts); weaker consolidation." | "Disabled for local inference: onnxruntime-node cannot run this ONNX export's RotaryEmbedding cache updates." | "Fastest load; solid all-rounder, slightly noisier extraction labels." | "Larger Llama 3.2 option for local memory/classifier tasks; higher quality potential at higher disk/RAM/latency cost.";
            })[];
        };
    };
    readonly "providers.autoThinkingMaxEffort": {
        readonly type: "enum";
        readonly values: readonly ["xhigh", "max"];
        readonly default: "xhigh";
        readonly ui: {
            readonly tab: "model";
            readonly group: "Thinking";
            readonly label: "Auto Thinking Ceiling";
            readonly description: "Highest effort the `auto` classifier may resolve. `xhigh` keeps the classifier one tier below the top, so only an explicit `ultrathink` reaches `max`; `max` lets a turn the classifier judges exceptional bill the top tier on models that expose it.";
            readonly condition: "autoThinkingActive";
            readonly options: readonly [{
                readonly value: "xhigh";
                readonly label: "xhigh";
                readonly description: "Classifier stops at xhigh (default)";
            }, {
                readonly value: "max";
                readonly label: "max";
                readonly description: "Classifier may resolve max where the model supports it";
            }];
        };
    };
    readonly "features.unexpectedStopDetection": {
        readonly type: "enum";
        readonly values: readonly ["none", "mechanical", "smart"];
        readonly default: "mechanical";
        readonly ui: {
            readonly tab: "interaction";
            readonly group: "Agent";
            readonly label: "Unexpected Stops";
            readonly description: "Automatically recover when the assistant stops without a visible message. Smart also classifies text-only stops with a small model.";
            readonly options: readonly [{
                readonly value: "none";
                readonly label: "None";
                readonly description: "Disabled";
            }, {
                readonly value: "mechanical";
                readonly label: "Mechanical";
                readonly description: "Retry stops with no visible assistant message; tool calls are excluded (default)";
            }, {
                readonly value: "smart";
                readonly label: "Smart";
                readonly description: "Mechanical + small-model classification of text-only stops";
            }];
        };
    };
    readonly "providers.unexpectedStopModel": {
        readonly type: "enum";
        readonly values: readonly ["online", "qwen3-1.7b", "llama3.2:3b", "gemma-3-1b", "qwen2.5-1.5b", "lfm2-1.2b"];
        readonly default: "online";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Tiny Model";
            readonly label: "Unexpected Stop Model";
            readonly description: "Classifier for Smart unexpected-stop detection: online (the TINY role from /models, else smol) by default, or a local on-device model.";
            readonly condition: "unexpectedStopSmart";
            readonly options: ({
                value: "online";
                label: string;
                description: string;
            } | {
                value: "gemma-3-1b" | "lfm2-1.2b" | "llama3.2:3b" | "qwen2.5-1.5b" | "qwen3-1.7b";
                label: "Gemma 3 1B" | "LFM2 1.2B" | "Llama 3.2 3B" | "Qwen2.5 1.5B" | "Qwen3 1.7B";
                description: "Best consolidation/dedup; lighter footprint, but leaks small talk during extraction." | "Best extraction granularity (atomic facts); weaker consolidation." | "Disabled for local inference: onnxruntime-node cannot run this ONNX export's RotaryEmbedding cache updates." | "Fastest load; solid all-rounder, slightly noisier extraction labels." | "Larger Llama 3.2 option for local memory/classifier tasks; higher quality potential at higher disk/RAM/latency cost.";
            })[];
        };
    };
    readonly "providers.kimiApiFormat": {
        readonly type: "enum";
        readonly values: readonly ["auto", "openai", "anthropic"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Protocol";
            readonly label: "Kimi API Format";
            readonly description: "API format for Kimi Code provider (auto follows live model metadata)";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Use the model's server-declared protocol";
            }, {
                readonly value: "openai";
                readonly label: "OpenAI";
                readonly description: "api.kimi.com";
            }, {
                readonly value: "anthropic";
                readonly label: "Anthropic";
                readonly description: "api.moonshot.ai";
            }];
        };
    };
    readonly "providers.openaiWebsockets": {
        readonly type: "enum";
        readonly values: readonly ["auto", "off", "on"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Protocol";
            readonly label: "OpenAI WebSockets";
            readonly description: "Websocket policy for OpenAI Codex models (auto uses model defaults, on forces, off disables)";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Use model/provider default websocket behavior";
            }, {
                readonly value: "off";
                readonly label: "Off";
                readonly description: "Disable websockets for OpenAI Codex models";
            }, {
                readonly value: "on";
                readonly label: "On";
                readonly description: "Force websockets for OpenAI Codex models";
            }];
        };
    };
    readonly "providers.cacheRetention": {
        readonly type: "enum";
        readonly values: readonly ["auto", "short", "long", "none"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Protocol";
            readonly label: "Prompt Cache Retention";
            readonly description: "Prompt-cache retention forwarded to providers that support it (Anthropic, Bedrock, OpenRouter, OpenAI)";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Provider default — Anthropic uses 5m entries kept warm by idle keep-alive refreshes; PI_CACHE_RETENTION still applies";
            }, {
                readonly value: "short";
                readonly label: "Short (5m)";
                readonly description: "Cheapest cache writes; Anthropic keeps the entry warm with bounded keep-alive refreshes while idle";
            }, {
                readonly value: "long";
                readonly label: "Long (1h)";
                readonly description: "1h TTL where the provider supports it; pricier writes, no keep-alive refresh requests";
            }, {
                readonly value: "none";
                readonly label: "Off";
                readonly description: "Disable prompt caching and cache-affinity routing";
            }];
        };
    };
    readonly "providers.streamFirstEventTimeoutSeconds": {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Timeouts";
            readonly label: "Stream First Event Timeout";
            readonly description: "Seconds to wait for the first model stream event; -1 uses provider/env defaults, 0 disables the watchdog";
            readonly options: readonly [{
                readonly value: "-1";
                readonly label: "Auto";
                readonly description: "Use provider defaults and PI_* timeout env vars";
            }, {
                readonly value: "0";
                readonly label: "Off";
                readonly description: "Disable first-event timeout";
            }, {
                readonly value: "300";
                readonly label: "5 minutes";
            }, {
                readonly value: "600";
                readonly label: "10 minutes";
            }, {
                readonly value: "1800";
                readonly label: "30 minutes";
            }];
        };
    };
    readonly "providers.streamIdleTimeoutSeconds": {
        readonly type: "number";
        readonly default: -1;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Timeouts";
            readonly label: "Stream Idle Timeout";
            readonly description: "Seconds a model stream may stay silent between events; -1 uses provider/env defaults, 0 disables the watchdog";
            readonly options: readonly [{
                readonly value: "-1";
                readonly label: "Auto";
                readonly description: "Use provider defaults and PI_* timeout env vars";
            }, {
                readonly value: "0";
                readonly label: "Off";
                readonly description: "Disable idle timeout";
            }, {
                readonly value: "300";
                readonly label: "5 minutes";
            }, {
                readonly value: "600";
                readonly label: "10 minutes";
            }, {
                readonly value: "1800";
                readonly label: "30 minutes";
            }];
        };
    };
    readonly "providers.openrouterVariant": {
        readonly type: "enum";
        readonly values: readonly ["default", "nitro", "floor", "online", "exacto"];
        readonly default: "default";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Protocol";
            readonly label: "OpenRouter Routing";
            readonly description: "Default routing-variant suffix appended to OpenRouter model IDs (overridden when the selector already names a variant)";
            readonly options: readonly [{
                readonly value: "default";
                readonly label: "Default";
                readonly description: "No suffix; use OpenRouter's default routing";
            }, {
                readonly value: "nitro";
                readonly label: ":nitro";
                readonly description: "Prioritize throughput / lowest latency";
            }, {
                readonly value: "floor";
                readonly label: ":floor";
                readonly description: "Prioritize cheapest available provider";
            }, {
                readonly value: "online";
                readonly label: ":online";
                readonly description: "Enable OpenRouter's web-search plugin";
            }, {
                readonly value: "exacto";
                readonly label: ":exacto";
                readonly description: "Cherry-picked high-quality providers (only defined for select models)";
            }];
        };
    };
    readonly "providers.fetch": {
        readonly type: "enum";
        readonly values: readonly ["auto", "native", "trafilatura", "lynx", "parallel", "jina"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Fetch Provider";
            readonly description: "Reader backend priority for the fetch/read URL tool";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Priority: native > trafilatura > lynx > parallel > jina";
            }, {
                readonly value: "native";
                readonly label: "Native";
                readonly description: "In-process HTML→Markdown converter (always available)";
            }, {
                readonly value: "trafilatura";
                readonly label: "Trafilatura";
                readonly description: "Auto-installs via uv/pip";
            }, {
                readonly value: "lynx";
                readonly label: "Lynx";
                readonly description: "Requires lynx system package";
            }, {
                readonly value: "parallel";
                readonly label: "Parallel";
                readonly description: "Requires PARALLEL_API_KEY";
            }, {
                readonly value: "jina";
                readonly label: "Jina";
                readonly description: "Uses r.jina.ai reader (JINA_API_KEY optional)";
            }];
        };
    };
    readonly "codexResets.autoRedeem": {
        readonly type: "enum";
        readonly values: readonly ["unset", "yes", "no"];
        readonly default: "unset";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Codex Auto-Redeem Saved Resets";
            readonly description: "Spend saved Codex rate-limit resets automatically: restore an account blocked by an exhausted 5h or weekly window when a turn is stuck and no other account can take over, and salvage credits that are about to expire. unset asks before the first spend, yes spends without prompting, and no disables both checks.";
            readonly options: readonly [{
                readonly value: "unset";
                readonly label: "Unset";
                readonly description: "Check eligibility, then ask before spending the first saved reset.";
            }, {
                readonly value: "yes";
                readonly label: "Yes";
                readonly description: "Spend eligible saved resets without prompting.";
            }, {
                readonly value: "no";
                readonly label: "No";
                readonly description: "Do not run the saved-reset auto-redeem check.";
            }];
        };
    };
    readonly "codexResets.minBlockedMinutes": {
        readonly type: "number";
        readonly default: 60;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Codex Auto-Redeem Min Block";
            readonly description: "Only auto-redeem when the natural unblock — the latest reset among the exhausted 5h/weekly windows — is at least this many minutes away (don't spend a scarce credit to save a short wait). Raise it (e.g. 360) to ignore 5h-only blocks.";
        };
    };
    readonly "codexResets.keepCredits": {
        readonly type: "number";
        readonly default: 0;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Codex Auto-Redeem Reserve";
            readonly description: "Never auto-spend below this many saved resets (0 = the last credit may be spent automatically). Credits about to expire are exempt — a reserved credit that expires preserves nothing.";
        };
    };
    readonly "codexResets.salvageHorizonHours": {
        readonly type: "number";
        readonly default: 12;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Codex Reset Salvage Horizon";
            readonly description: "Spend a saved Codex reset automatically when it would otherwise expire within this many hours and either chat window (5h or weekly) has meaningful usage to restore (0 disables expiry salvage).";
        };
    };
    readonly "provider.appendOnlyContext": {
        readonly type: "enum";
        readonly values: readonly ["auto", "on", "off"];
        readonly default: "auto";
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Protocol";
            readonly label: "Append-Only Context";
            readonly description: "Cache system prompt + tool specs and keep an append-only message log so provider prefix caches (DeepSeek, Xiaomi/SGLang, Anthropic) hit at maximum rate. Auto enables for known prefix-cache providers.";
            readonly options: readonly [{
                readonly value: "auto";
                readonly label: "Auto";
                readonly description: "Enable for known prefix-cache providers (recommended)";
            }, {
                readonly value: "on";
                readonly label: "On";
                readonly description: "Always enable append-only context";
            }, {
                readonly value: "off";
                readonly label: "Off";
                readonly description: "Disable append-only context";
            }];
        };
    };
    readonly "exa.enabled": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Exa";
            readonly description: "Enable the Exa web search provider";
        };
    };
    readonly "exa.searchDelayMs": {
        readonly type: "number";
        readonly default: 1000;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "Exa Search Delay";
            readonly description: "Minimum delay between Exa web search requests in milliseconds; set 0 to disable pacing";
        };
    };
    readonly "searxng.endpoint": {
        readonly type: "string";
        readonly default: undefined;
        readonly ui: {
            readonly tab: "providers";
            readonly group: "Services";
            readonly label: "SearXNG Endpoint";
            readonly description: "Base URL of a self-hosted SearXNG instance used for web search";
        };
    };
    readonly "searxng.token": {
        readonly type: "string";
        readonly default: undefined;
        readonly credential: true;
    };
    readonly "searxng.basicUsername": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "searxng.basicPassword": {
        readonly type: "string";
        readonly default: undefined;
        readonly credential: true;
    };
    readonly "searxng.categories": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "searxng.engines": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "searxng.language": {
        readonly type: "string";
        readonly default: undefined;
    };
    readonly "searxng.safesearch": {
        readonly type: "number";
        readonly default: undefined;
    };
    readonly "commit.mapReduceEnabled": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "commit.mapReduceMinFiles": {
        readonly type: "number";
        readonly default: 4;
    };
    readonly "commit.mapReduceMaxFileTokens": {
        readonly type: "number";
        readonly default: 50000;
    };
    readonly "commit.mapReduceTimeoutMs": {
        readonly type: "number";
        readonly default: 120000;
    };
    readonly "commit.mapReduceMaxConcurrency": {
        readonly type: "number";
        readonly default: 5;
    };
    readonly "commit.changelogMaxDiffChars": {
        readonly type: "number";
        readonly default: 120000;
    };
    readonly "extensionHandlers.toolCallTimeoutMs": {
        readonly type: "number";
        readonly default: 30000;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Extensions";
            readonly label: "Tool Call Handler Timeout (ms)";
            readonly description: "Positive finite active-work timeout for extension tool_call handlers; invalid values use 30000ms, and time awaiting OMP-owned dialogs does not count";
        };
    };
    readonly "dev.autoqa": {
        readonly type: "boolean";
        readonly default: true;
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Developer";
            readonly label: "Auto QA";
            readonly description: "Automated tool issue reporting (xd://report_issue). On by default; the first report asks for consent, and denying it disables reporting until re-enabled explicitly";
        };
    };
    readonly "dev.autoqaPush.endpoint": {
        readonly type: "string";
        readonly default: "https://qa.omp.sh/v1/grievances";
        readonly ui: {
            readonly tab: "tools";
            readonly group: "Developer";
            readonly label: "Auto QA Push Endpoint";
            readonly description: "Full URL receiving Auto QA JSON reports (default https://qa.omp.sh/v1/grievances)";
        };
    };
    readonly "dev.autoqaPush.token": {
        readonly type: "string";
        readonly default: undefined;
        readonly credential: true;
    };
    /**
     * User decision on sharing automatic `report_tool_issue` grievances.
     *
     *   - `"unset"`  — never asked; the first `report_tool_issue` invocation
     *                  pops a consent dialog and persists the answer here.
     *   - `"granted"` — record and (when push is configured) ship grievances.
     *   - `"denied"`  — silently no-op every `report_tool_issue` call.
     *
     * Owned by `packages/coding-agent/src/tools/report-tool-issue.ts` via the
     * process-global consent handler registered by `InteractiveMode`.
     *
     * @default "unset"
     */
    readonly "dev.autoqaConsent": {
        readonly type: "enum";
        readonly values: readonly ["unset", "granted", "denied"];
        readonly default: "unset";
    };
    readonly "gc.blobs": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "gc.archive": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "gc.wal": {
        readonly type: "boolean";
        readonly default: true;
    };
    readonly "gc.coldArchiveAfterDays": {
        readonly type: "number";
        readonly default: 30;
    };
    readonly "gc.retainNewestGlobal": {
        readonly type: "number";
        readonly default: 20;
    };
    readonly "gc.retainNewestPerCwd": {
        readonly type: "number";
        readonly default: 10;
    };
    readonly "thinkingBudgets.minimal": {
        readonly type: "number";
        readonly default: 1024;
    };
    readonly "thinkingBudgets.low": {
        readonly type: "number";
        readonly default: 2048;
    };
    readonly "thinkingBudgets.medium": {
        readonly type: "number";
        readonly default: 8192;
    };
    readonly "thinkingBudgets.high": {
        readonly type: "number";
        readonly default: 16384;
    };
    readonly "thinkingBudgets.xhigh": {
        readonly type: "number";
        readonly default: 32768;
    };
    readonly "thinkingBudgets.max": {
        readonly type: "number";
        readonly default: 32768;
    };
};
type Schema = typeof SETTINGS_SCHEMA;
/** All valid setting paths */
export type SettingPath = keyof Schema;
/** Infer the value type for a setting path */
export type SettingValue<P extends SettingPath> = Schema[P] extends {
    type: "boolean";
    default: undefined;
} ? boolean | undefined : Schema[P] extends {
    type: "boolean";
} ? boolean : Schema[P] extends {
    type: "string";
} ? string | undefined : Schema[P] extends {
    type: "number";
    default: undefined;
} ? number | undefined : Schema[P] extends {
    type: "number";
} ? number : Schema[P] extends {
    type: "enum";
    values: infer V;
} ? V extends readonly string[] ? V[number] : never : Schema[P] extends {
    type: "array";
    default: infer D;
} ? D : Schema[P] extends {
    type: "record";
    default: infer D;
} ? D : never;
/** Get the default value for a setting path */
export declare function getDefault<P extends SettingPath>(path: P): SettingValue<P>;
/** Check if a path has UI metadata (should appear in settings panel) */
export declare function hasUi(path: SettingPath): boolean;
/**
 * Whether a setting holds a credential and must never be printed or exported
 * without an explicit request. Drives both CLI redaction and settings-panel
 * masking, so the two cannot disagree.
 */
export declare function isCredential(path: SettingPath): boolean;
/** Get UI metadata for a path (undefined if no UI) */
export declare function getUi(path: SettingPath): AnyUiMetadata | undefined;
/** Get all paths for a specific tab */
export declare function getPathsForTab(tab: SettingTab): SettingPath[];
/** Get the type of a setting */
export declare function getType(path: SettingPath): SettingDef["type"];
/** Get enum values for an enum setting */
export declare function getEnumValues(path: SettingPath): readonly string[] | undefined;
/** Status line preset - derived from schema */
export type StatusLinePreset = SettingValue<"statusLine.preset">;
/** Status line separator style - derived from schema */
export type StatusLineSeparatorStyle = SettingValue<"statusLine.separator">;
/** Tree selector filter mode - derived from schema */
export type TreeFilterMode = SettingValue<"treeFilterMode">;
/** Personality preset - derived from schema */
export type Personality = SettingValue<"personality">;
export interface CompactionSettings {
    enabled: boolean;
    methodOrder: CompactionMethod[];
    thresholdPercent: number;
    thresholdTokens: number;
    reserveTokens: number | undefined;
    keepRecentTokens: number;
    midTurnEnabled: boolean;
    asyncEnabled: boolean;
    handoffSaveToDisk: boolean;
    autoContinue: boolean;
    remoteEndpoint: string | undefined;
    remoteStreamingV2Enabled: boolean;
    v2RetainedMessageBudget: number;
    idleEnabled: boolean;
    idleThresholdTokens: number;
    idleTimeoutSeconds: number;
    supersedeReads: boolean;
    dropUseless: boolean;
}
export interface RecapSettings {
    enabled: boolean;
    idleSeconds: number;
}
export interface TitleSettings {
    refreshOnReplan: boolean;
}
export interface ContextPromotionSettings {
    enabled: boolean;
}
export interface RetrySettings {
    enabled: boolean;
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    modelFallback: boolean;
    usageAwareFallback: boolean;
    usageReservePct: number;
    usageReservePolicy: "confirm" | "auto" | "fail-closed";
}
export interface MemoriesSettings {
    enabled: boolean;
    maxRolloutsPerStartup: number;
    maxRolloutAgeDays: number;
    minRolloutIdleHours: number;
    threadScanLimit: number;
    maxRawMemoriesForGlobal: number;
    stage1Concurrency: number;
    stage1LeaseSeconds: number;
    stage1RetryDelaySeconds: number;
    phase2LeaseSeconds: number;
    phase2RetryDelaySeconds: number;
    phase2HeartbeatSeconds: number;
    rolloutPayloadPercent: number;
    fallbackTokenLimit: number;
    summaryInjectionTokenLimit: number;
}
export interface TodoCompletionSettings {
    enabled: boolean;
    maxReminders: number;
}
export interface BranchSummarySettings {
    enabled: boolean;
    reserveTokens: number;
}
export interface SkillsSettings {
    enabled?: boolean;
    enableSkillCommands?: boolean;
    enableCodexUser?: boolean;
    enableClaudeUser?: boolean;
    enableClaudeProject?: boolean;
    enablePiUser?: boolean;
    enablePiProject?: boolean;
    enableAgentsUser?: boolean;
    enableAgentsProject?: boolean;
    customDirectories?: string[];
    ignoredSkills?: string[];
    includeSkills?: string[];
    disabledExtensions?: string[];
}
export interface CommitSettings {
    mapReduceEnabled: boolean;
    mapReduceMinFiles: number;
    mapReduceMaxFileTokens: number;
    mapReduceTimeoutMs: number;
    mapReduceMaxConcurrency: number;
    changelogMaxDiffChars: number;
}
export interface TtsrSettings {
    enabled: boolean;
    contextMode: "discard" | "keep";
    interruptMode: "never" | "prose-only" | "tool-only" | "always";
    repeatMode: "once" | "after-gap";
    repeatGap: number;
    /** Bucketing-only (read by bucketRules, not the TtsrManager). */
    builtinRules?: boolean;
    /** Bucketing-only (read by bucketRules, not the TtsrManager). */
    disabledRules?: string[];
}
export interface ExaSettings {
    enabled: boolean;
    searchDelayMs: number;
}
export interface StatusLineSettings {
    preset: StatusLinePreset;
    separator: StatusLineSeparatorStyle;
    showHookStatus: boolean;
    leftSegments: StatusLineSegmentId[];
    rightSegments: StatusLineSegmentId[];
    segmentOptions: Record<string, unknown>;
}
export interface ThinkingBudgetsSettings {
    minimal: number;
    low: number;
    medium: number;
    high: number;
    xhigh: number;
    max: number;
}
export interface SttSettings {
    enabled: boolean;
    language: string | undefined;
    modelName: string;
    streaming: boolean;
}
export interface BashInterceptorRule {
    pattern: string;
    flags?: string;
    tool: string;
    message: string;
    allowSubcommands?: string[];
}
export interface ShellMinimizerSettings {
    enabled: boolean;
    settingsPath: string | undefined;
    only: string[];
    except: string[];
    maxCaptureBytes: number;
    sourceOutlineLevel: "default" | "aggressive";
    legacyFilters: boolean | undefined;
}
export type CodexAutoRedeemMode = "unset" | "yes" | "no";
export interface CodexResetsSettings {
    autoRedeem: CodexAutoRedeemMode;
    minBlockedMinutes: number;
    keepCredits: number;
    salvageHorizonHours: number;
}
export interface GcSettings {
    blobs: boolean;
    archive: boolean;
    wal: boolean;
    coldArchiveAfterDays: number;
    retainNewestGlobal: number;
    retainNewestPerCwd: number;
}
/** Map group prefix -> typed settings interface */
export interface GroupTypeMap {
    compaction: CompactionSettings;
    recap: RecapSettings;
    title: TitleSettings;
    contextPromotion: ContextPromotionSettings;
    retry: RetrySettings;
    memories: MemoriesSettings;
    branchSummary: BranchSummarySettings;
    skills: SkillsSettings;
    commit: CommitSettings;
    ttsr: TtsrSettings;
    exa: ExaSettings;
    statusLine: StatusLineSettings;
    thinkingBudgets: ThinkingBudgetsSettings;
    stt: SttSettings;
    modelRoles: Record<string, string>;
    modelTags: ModelTagsSettings;
    cycleOrder: string[];
    shellMinimizer: ShellMinimizerSettings;
    codexResets: CodexResetsSettings;
    gc: GcSettings;
}
export type GroupPrefix = keyof GroupTypeMap;
export {};
