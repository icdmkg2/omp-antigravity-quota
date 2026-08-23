import type { CollabSessionState } from "../../../collab/protocol.js";
import type { ContextLineMode, StatusLinePreset, StatusLineSegmentId, StatusLineSeparatorStyle } from "../../../config/settings-schema.js";
import type { AgentSession } from "../../../session/agent-session.js";
import type { ActiveRepoContext } from "../../../utils/active-repo-context.js";
import type { LoopLimitRuntime } from "../../loop-limit.js";
export type { ContextLineMode, StatusLinePreset, StatusLineSegmentId, StatusLineSeparatorStyle };
/** Collab session indicator + (guest-only) host-state override for segments. */
export interface CollabStatus {
    role: "host" | "guest";
    participantCount: number;
    /** Guest only: host footer snapshot that overrides locally computed values. */
    stateOverride?: CollabSessionState | null;
}
export interface StatusLineSegmentOptions {
    model?: {
        showThinkingLevel?: boolean;
    };
    path?: {
        abbreviate?: boolean;
        maxLength?: number;
        stripWorkPrefix?: boolean;
    };
    git?: {
        showBranch?: boolean;
        showStaged?: boolean;
        showUnstaged?: boolean;
        showUntracked?: boolean;
    };
    time?: {
        format?: "12h" | "24h";
        showSeconds?: boolean;
    };
}
export interface StatusLineSettings {
    preset?: StatusLinePreset;
    leftSegments?: StatusLineSegmentId[];
    rightSegments?: StatusLineSegmentId[];
    separator?: StatusLineSeparatorStyle;
    segmentOptions?: StatusLineSegmentOptions;
    showHookStatus?: boolean;
    sessionAccent?: boolean;
    /** Drop the theme's `statusLineBg` fill and powerline caps so the bar
     *  inherits the terminal's default background. */
    transparent?: boolean;
    /** Replace the model-segment icon with the thinking-level glyph and drop the
     *  " · <level>" suffix, so the thinking level reads as a single compact icon. */
    compactThinkingLevel?: boolean;
    /** How the gap line between the left and right groups reacts to context
     *  usage. `embedded` moves configured context segments into the annotated
     *  gauge as percentage and window labels. Box composer only. */
    contextLine?: ContextLineMode;
}
export type EffectiveStatusLineSettings = Required<Pick<StatusLineSettings, "leftSegments" | "rightSegments" | "separator" | "segmentOptions">> & StatusLineSettings;
export type RGB = readonly [number, number, number];
export interface SegmentContext {
    session: AgentSession;
    /** Focused subagent id while the view is proxied at its session, undefined otherwise. */
    focusedAgentId?: string | undefined;
    /** Effective `statusLine.sessionAccent`; `false` disables hash-derived accent colors, while `true` or omission enables them. */
    sessionAccent?: boolean;
    /** Stand-in session title for previews; `session_name` renders it when the session is unnamed. */
    previewTitle?: string;
    activeRepo: ActiveRepoContext | null;
    width: number;
    options: StatusLineSegmentOptions;
    /** Render the model segment's thinking level as a compact leading glyph. */
    compactThinkingLevel: boolean;
    planMode: {
        enabled: boolean;
        paused: boolean;
    } | null;
    prewalk: {
        enabled: boolean;
    } | null;
    loopMode: {
        state: "waiting" | "running" | "paused";
        limit?: LoopLimitRuntime;
    } | null;
    goalMode: {
        enabled: boolean;
        paused: boolean;
    } | null;
    vibeMode: {
        enabled: boolean;
    } | null;
    collab: CollabStatus | null;
    usageStats: {
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
        totalTokens: number;
        orchestrationInput: number;
        orchestrationOutput: number;
        orchestrationCacheRead: number;
        premiumRequests: number;
        cost: number;
        tokensPerSecond: number | null;
    };
    /** Context usage percent, or null when unknown (e.g. right after compaction). */
    contextPercent: number | null;
    contextTokens: number;
    contextWindow: number;
    autoCompactEnabled: boolean;
    /** Background speculative-compaction state (async compaction). */
    compactionSpeculation: "idle" | "running" | "armed";
    /** Blink phase for the running-speculation pulse; toggled by the component's timer. */
    speculationBlinkOn: boolean;
    subagentCount: number;
    /**
     * Active processing time accumulated this session, in ms — the union of
     * every `agent_start`→`agent_end` window plus the currently-streaming
     * window if the agent is running. Idle wall-clock never contributes, so
     * this is what {@link StatusLineSegmentId.time_spent} renders instead of
     * `Date.now() - sessionStart`.
     */
    activeMs: number;
    git: {
        branch: string | null;
        status: {
            staged: number;
            unstaged: number;
            untracked: number;
        } | null;
        pr: {
            number: number;
            url: string;
        } | null;
    };
    /**
     * Set when the path cwd is a *linked* git worktree, naming the shared
     * primary checkout (the project). Lets the path segment collapse the
     * base-prefixed `<base>/<project>/<worktree>` path to the project name —
     * the worktree/branch is already shown by the git segment.
     */
    worktree: {
        projectName: string;
        worktreeName: string;
    } | null;
    usage: {
        tier?: string;
        fiveHour?: {
            percent: number;
            resetMinutes?: number;
        };
        sevenDay?: {
            percent: number;
            resetHours?: number;
        };
        monthly?: {
            percent: number;
            resetHours?: number;
        };
    } | null;
}
export interface RenderedSegment {
    content: string;
    visible: boolean;
}
export interface StatusLineSegment {
    id: StatusLineSegmentId;
    render(ctx: SegmentContext): RenderedSegment;
}
export interface SeparatorDef {
    left: string;
    right: string;
    endCaps?: {
        left: string;
        right: string;
        useBgAsFg: boolean;
    };
}
export interface PresetDef {
    leftSegments: StatusLineSegmentId[];
    rightSegments: StatusLineSegmentId[];
    separator: StatusLineSeparatorStyle;
    segmentOptions?: StatusLineSegmentOptions;
}
