import { LiveSessionController, type LiveSessionControllerOptions } from "../../live/controller.js";
import type { InteractiveModeContext } from "../types.js";
type LiveSessionFactory = (options: LiveSessionControllerOptions) => LiveSessionController;
/** Owns the editor-replacing visualizer and realtime session lifecycle for `/live`. */
export declare class LiveCommandController {
    #private;
    constructor(ctx: InteractiveModeContext, createSession?: LiveSessionFactory);
    /** Whether a live session is connected, connecting, or closing. */
    get active(): boolean;
    /** Start live mode, or stop the currently active session. */
    handleCommand(): Promise<void>;
    /** Stop the active live session and restore the editor. */
    stop(): Promise<void>;
    /** Release UI resources during synchronous InteractiveMode teardown. */
    dispose(): void;
}
export {};
