/**
 * Builds transcript components from persisted session message entries — the
 * file/remote-backed counterpart to {@link UiHelpers.addMessageToChat} (which is
 * bound to the live InteractiveModeContext). Used by the fullscreen transcript
 * viewer ({@link AgentTranscriptViewer}) to render a parked subagent / advisor /
 * collab-guest transcript that has no live session.
 *
 * Unlike the old incremental hub sync, {@link ChatTranscriptBuilder.rebuild}
 * always discards prior components and rebuilds the whole transcript from the
 * supplied entries. Re-rendering a growing transcript is therefore O(n) in the
 * entry count, but it cannot duplicate or misorder rows the way incremental
 * component reuse could.
 */
import type { AgentTool } from "@oh-my-pi/pi-agent-core";
import type { TUI } from "@oh-my-pi/pi-tui";
import type { MessageRenderer } from "../../extensibility/extensions/types.js";
import type { SessionMessageEntry } from "../../session/session-entries.js";
import { TranscriptContainer } from "./transcript-container.js";
export interface ChatTranscriptBuilderDeps {
    ui: TUI;
    getTool?: (name: string) => AgentTool | undefined;
    /** Whether the active registry entry came from a built-in factory. */
    isBuiltInTool?: (name: string) => boolean;
    getMessageRenderer?: (customType: string) => MessageRenderer | undefined;
    cwd: string;
    hideThinkingBlock?: () => boolean;
    proseOnlyThinking?: () => boolean;
    requestRender: () => void;
}
export declare class ChatTranscriptBuilder {
    #private;
    private readonly deps;
    readonly container: TranscriptContainer;
    constructor(deps: ChatTranscriptBuilderDeps);
    /** Whether the transcript currently holds any rendered rows. */
    get isEmpty(): boolean;
    /** Discard all components and rebuild the whole transcript from `entries`. */
    rebuild(entries: SessionMessageEntry[]): void;
    /** Append newly persisted entries without rebuilding already rendered rows. */
    append(entries: SessionMessageEntry[]): void;
    /** Toggle tool-output expansion across every expandable component. */
    setExpanded(expanded: boolean): void;
    get expanded(): boolean;
    /** Tear down components (sealing pending spinners) and clear build state. */
    reset(): void;
    dispose(): void;
}
