import { type Component, type KeyId } from "@oh-my-pi/pi-tui";
/** Distinct states of a realtime call connection. */
export type LivePhase = "connecting" | "listening" | "working" | "speaking" | "muted" | "error";
/** Configuration callbacks for user interactions in the visualizer. */
export interface LiveVisualizerOptions {
    onStop(): void;
    onToggleMute(): void;
    /** Configured `app.live.toggle` chords that also end the call (Ctrl+L by default). */
    stopKeys?: readonly KeyId[];
}
/** A compact, fixed-height terminal component for displaying a realtime call. */
export declare class LiveVisualizer implements Component {
    #private;
    readonly wantsKeyRelease = false;
    constructor(options: LiveVisualizerOptions);
    /** Updates the current call phase. */
    setPhase(phase: LivePhase): void;
    /** Updates the microphone volume level (0..1). */
    setInputLevel(level: number): void;
    /** Advances the spectrum animation and its peak decay. */
    setFrame(frame: number): void;
    /** Updates the user's streaming voice transcript. */
    setTranscript(text: string): void;
    /** Clears the user's voice transcript row. */
    clearTranscript(): void;
    /** Processes user keypresses. */
    handleInput(data: string): void;
    /** Clears the render cache. */
    invalidate(): void;
    /** Renders the microphone spectrum into a compact fixed-height panel. */
    render(width: number): readonly string[];
}
