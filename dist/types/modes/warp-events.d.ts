import type { ExtensionFactory } from "../extensibility/extensions/types.js";
/** True when Warp has negotiated the structured CLI-agent OSC protocol. */
export declare function isWarpCliAgentProtocolActive(): boolean;
export type WarpEventValue = string | number | boolean | null | readonly WarpEventValue[] | {
    readonly [key: string]: WarpEventValue | undefined;
};
/** Fields added to the Warp CLI-agent event envelope by the event bridge. */
export type WarpEvent = Readonly<Record<string, WarpEventValue | undefined>>;
export interface WarpEventEmitterOptions {
    sessionId: string;
    getCwd?: () => string;
}
export interface WarpEventEmitter {
    emit(event: WarpEvent): void;
}
/**
 * Creates the Warp event transport for a top-level interactive TUI session.
 * The caller MUST enforce that install-site invariant; the sole production
 * caller is gated by `isInteractive`, so ACP, RPC, print, headless, and
 * subagent sessions never construct an emitter.
 */
export declare function createWarpEventEmitter(options: WarpEventEmitterOptions): WarpEventEmitter | undefined;
/** Internal event bridge installed only by the top-level interactive TUI runner. */
export declare function createWarpEventBridgeExtension(): ExtensionFactory;
