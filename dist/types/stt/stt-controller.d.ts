export type SttState = "idle" | "recording" | "transcribing";
interface ToggleOptions {
    showWarning(msg: string): void;
    showStatus(msg: string): void;
    onStateChange(state: SttState): void;
    /** Force a redraw after async edits to the composer (live segment/preview inserts). */
    requestRender?(): void;
}
/** The slice of the composer editor the controller drives. */
interface Editor {
    insertText(text: string): void;
    setVolatileText(text: string): void;
    clearVolatileText(): void;
    commitVolatileText(text: string): void;
    submit(): void;
    deleteBeforeCursor(count: number): void;
}
interface CaptureHandle {
    stop(): void;
}
type CaptureFactory = (onAudio: (error: Error | null, samples: Float32Array) => void) => CaptureHandle;
/** Coordinates native microphone capture with incremental local transcription. */
export declare class STTController {
    #private;
    /** Creates a controller; tests may replace the hardware capture boundary. */
    constructor(createCapture?: CaptureFactory);
    get state(): SttState;
    toggle(editor: Editor, options: ToggleOptions): Promise<void>;
    dispose(): void;
}
export {};
