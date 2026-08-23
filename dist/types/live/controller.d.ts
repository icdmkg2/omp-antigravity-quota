import type { AssistantMessage } from "@oh-my-pi/pi-ai";
import type { AgentSession } from "../session/agent-session.js";
import type { LivePhase } from "./visualizer.js";
/** Incremental or final transcript for one realtime conversational turn. */
export interface LiveTranscript {
    role: "user" | "assistant";
    text: string;
    /** Monotonic role-local turn number used to coalesce streaming updates. */
    turn: number;
    final: boolean;
}
/** UI notifications emitted during a live session. */
export interface LiveSessionCallbacks {
    /** Reports connection and activity phase changes. */
    onPhase(phase: LivePhase): void;
    /** Reports clamped microphone and speaker RMS levels. */
    onLevels(input: number, output: number): void;
    /** Reports the latest available conversational transcript. */
    onTranscript(transcript: LiveTranscript | undefined): void;
    /** Reports one terminal stop, optionally carrying its cause. */
    onTerminal(error?: Error): void;
}
/** Dependencies and presentation callbacks for a live session. */
export interface LiveSessionControllerOptions {
    /** Agent session that performs all delegated coding work. */
    session: AgentSession;
    /** UI callbacks for live session state. */
    callbacks: LiveSessionCallbacks;
    /** Extracts visible assistant text using the caller's normal UI rules. */
    extractAssistantText(message: AssistantMessage): string;
    /** Realtime output voice, defaulting to sol. */
    voice?: string;
}
/** Coordinates the realtime conversational surface with normal AgentSession turns. */
export declare class LiveSessionController {
    #private;
    constructor(options: LiveSessionControllerOptions);
    /** Current realtime call phase. */
    get phase(): LivePhase;
    /** Whether microphone input is currently muted. */
    get muted(): boolean;
    /** Connects the realtime surface and starts microphone streaming. */
    start(): Promise<void>;
    /** Toggles microphone capture while leaving output and the session connected. */
    toggleMute(): void;
    /** Stops recording, closes the live session, and emits one terminal callback. */
    stop(): Promise<void>;
}
