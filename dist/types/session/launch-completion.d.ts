import type { DaemonCompletionNotification } from "../launch/protocol.js";
import type { CustomMessage } from "./messages.js";
/** Yield-queue kind for broker-owned supervised process completions. */
export declare const LAUNCH_COMPLETION_MESSAGE_TYPE = "launch-completion";
/** One broker completion awaiting injection into its owning session. */
export type LaunchCompletionEntry = DaemonCompletionNotification;
/** Whether a broker completion belongs to the primary session or its advisor. */
export declare function isLaunchCompletionOwner(owner: string, sessionId: string): boolean;
/** Build one model-visible notification per terminal supervised process exit. */
export declare function buildLaunchCompletionBatchMessage(entries: LaunchCompletionEntry[]): CustomMessage;
