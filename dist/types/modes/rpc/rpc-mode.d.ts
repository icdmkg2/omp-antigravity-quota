import { type ExtensionUIContext, type ExtensionUIDialogOptions, type ExtensionUISelectItem } from "../../extensibility/extensions/index.js";
import type { AgentSession } from "../../session/agent-session.js";
import type { EventBus } from "../../utils/event-bus.js";
import { RpcSubagentRegistry } from "./rpc-subagents.js";
import type { RpcCommand, RpcExtensionUIRequest, RpcExtensionUIResponse, RpcHostToolCallRequest, RpcHostToolCancelRequest, RpcHostToolResult, RpcHostToolUpdate, RpcHostUriCancelRequest, RpcHostUriRequest, RpcHostUriResult, RpcResponse } from "./rpc-types.js";
export type * from "./rpc-types.js";
export type PendingExtensionRequest = {
    resolve: (response: RpcExtensionUIResponse) => void;
    reject: (error: Error) => void;
};
/** Pending extension UI request map that can fail closed when the RPC client disconnects. */
export declare class RpcPendingExtensionRequests extends Map<string, PendingExtensionRequest> {
    #private;
    set(id: string, request: PendingExtensionRequest): this;
    /** Reject every active and future extension UI request. */
    rejectAll(message: string): void;
}
type RpcOutput = (obj: RpcResponse | RpcExtensionUIRequest | RpcHostToolCallRequest | RpcHostToolCancelRequest | RpcHostUriRequest | RpcHostUriCancelRequest | object) => void;
export type RpcSessionChangeCommand = Extract<RpcCommand, {
    type: "new_session";
} | {
    type: "switch_session";
} | {
    type: "branch";
}>;
export type RpcSessionChangeResult = {
    type: "new_session";
    data: {
        cancelled: boolean;
    };
} | {
    type: "switch_session";
    data: {
        cancelled: boolean;
    };
} | {
    type: "branch";
    data: {
        text: string;
        cancelled: boolean;
    };
};
export type RpcSessionChangeSession = Pick<AgentSession, "newSession" | "switchSession" | "branch">;
export type RpcSkillCommandSession = Pick<AgentSession, "promptCustomMessage" | "skills" | "skillsSettings">;
export type RpcSkillCommandResult = {
    agentInvoked: true;
};
export declare function tryRunRpcSkillCommand(session: RpcSkillCommandSession, text: string, streamingBehavior?: "steer" | "followUp"): Promise<RpcSkillCommandResult | false>;
export declare function reportLocalOnlyPromptResult(input: {
    id: string | undefined;
    prompt: Promise<boolean>;
    output: (obj: object) => void;
    onError: (error: Error) => void;
    hasExtensionAgentMessageTask?: () => boolean;
    waitForExtensionAgentMessageTasks?: () => Promise<void>;
}): void;
/**
 * Tracks extension-originated messages while an RPC prompt is executing.
 * A slash command can resolve the outer prompt as local-only while also
 * scheduling agent work through pi.sendUserMessage() or pi.sendMessage()
 * with triggerTurn; that prompt must not report agentInvoked:false to the host.
 */
export declare class RpcExtensionUserMessageTracker {
    #private;
    markAgentMessageTask(): void;
    trackAgentMessageTask(task: Promise<unknown>): void;
    watchPrompt<T>(startPrompt: () => Promise<T>): {
        prompt: Promise<T>;
        hasAgentMessageTask: () => boolean;
        waitForAgentMessageTasks: () => Promise<void>;
    };
}
export declare function watchAndReportLocalOnlyPromptResult(input: {
    id: string | undefined;
    startPrompt: () => Promise<boolean>;
    output: (obj: object) => void;
    onError: (error: Error) => void;
    extensionUserMessageTracker: RpcExtensionUserMessageTracker;
}): void;
/**
 * Dependencies for {@link dispatchRpcInputFrame}. Provided by the RPC mode
 * entrypoint; broken out so tests can drive the input loop with stubs.
 */
export interface RpcInputFrameDeps {
    handleCommand: (command: RpcCommand) => Promise<RpcResponse>;
    output: RpcOutput;
    errorResponse: (id: string | undefined, command: string, message: string) => RpcResponse;
    trackBackgroundTask?: (task: Promise<void>) => void;
    pendingExtensionRequests: Map<string, PendingExtensionRequest>;
    onHostToolResult: (frame: RpcHostToolResult) => void;
    onHostToolUpdate: (frame: RpcHostToolUpdate) => void;
    onHostUriResult: (frame: RpcHostUriResult) => void;
}
/** Dispatch side-channel frames that must overtake the serialized command queue. */
export declare function dispatchRpcControlFrame(parsed: unknown, deps: RpcInputFrameDeps): boolean;
/**
 * Dispatch a single parsed frame from the RPC input stream.
 *
 * Bash commands are dispatched in the background so the caller can keep reading
 * subsequent frames while a shell command is still running. This lets a client
 * send `abort_bash` while a long-running `bash` is in flight. Response
 * correlation is preserved via each command's `id`; ordering across concurrent
 * commands is not guaranteed and clients MUST match on `id`.
 *
 * @returns `undefined` when the frame was routed to a side-channel handler
 *   (extension UI response, host tool/URI frames) or dispatched in the
 *   background (`bash`). Otherwise a promise that resolves once the response
 *   for the command has been emitted via `output`. Errors from `handleCommand`
 *   on non-`bash` commands propagate; the caller is expected to wrap them.
 */
export declare function dispatchRpcInputFrame(parsed: unknown, deps: RpcInputFrameDeps): Promise<void> | undefined;
/** Serializes ordinary RPC commands while allowing control frames to dispatch immediately. */
export declare class RpcInputDispatcher {
    #private;
    constructor(options: {
        deps: RpcInputFrameDeps;
        afterSerialCommand?: () => Promise<void>;
    });
    /** Accept a parsed input frame without blocking the stdin reader. */
    dispatch(parsed: unknown): void;
    /** Await every accepted serial command, including commands queued before EOF. */
    drain(): Promise<void>;
}
/**
 * Coordinates deferred shutdown with in-flight background input tasks.
 *
 * `pi.shutdown()` from an extension only *requests* shutdown; the process must
 * not exit while a background-dispatched command (`bash`, see
 * {@link dispatchRpcInputFrame}) still owes the client a response frame. The
 * coordinator tracks those tasks, re-checks the shutdown request whenever one
 * settles (covering a shutdown requested mid-bash with no follow-up client
 * frame), and drains every tracked task before invoking `performShutdown`.
 * The shutdown sequence is latched so concurrent triggers (input loop and
 * settling tasks) run it exactly once.
 */
export declare class RpcShutdownCoordinator {
    #private;
    constructor(options: {
        isShutdownRequested: () => boolean;
        performShutdown: () => Promise<void>;
    });
    /**
     * Track a background input task. When it settles it is untracked and the
     * shutdown request is re-checked, so a deferred shutdown fires even when
     * no further client frames arrive.
     */
    track(task: Promise<void>): void;
    /** Await every tracked task, including tasks tracked while draining. */
    drain(): Promise<void>;
    /**
     * If shutdown was requested, drain background tasks (so every owed
     * response frame is written) before running the shutdown sequence.
     */
    checkShutdownRequested(): Promise<void>;
}
export type RpcSubagentResetRegistry = Pick<RpcSubagentRegistry, "clear">;
export declare function handleRpcSessionChange(session: RpcSessionChangeSession, command: RpcSessionChangeCommand, subagentRegistry?: RpcSubagentResetRegistry): Promise<RpcSessionChangeResult>;
/** Sends an RPC select request while retaining aligned option descriptions. */
export declare function requestRpcSelect(pendingRequests: Map<string, PendingExtensionRequest>, output: RpcOutput, title: string, options: ExtensionUISelectItem[], dialogOptions?: ExtensionUIDialogOptions): Promise<string | undefined>;
export declare function requestRpcEditor(pendingRequests: Map<string, PendingExtensionRequest>, output: RpcOutput, title: string, prefill?: string, dialogOptions?: ExtensionUIDialogOptions, editorOptions?: {
    promptStyle?: boolean;
}): Promise<string | undefined>;
/** Sends an RPC extension dialog and cancels the remote presentation when its signal aborts. */
export declare function requestRpcDialog<T>(pendingRequests: Map<string, PendingExtensionRequest>, output: RpcOutput, opts: ExtensionUIDialogOptions | undefined, defaultValue: T, request: Record<string, unknown>, parseResponse: (response: RpcExtensionUIResponse) => T): Promise<T>;
/**
 * Run in RPC mode.
 * Listens for JSON commands on stdin, outputs events and responses on stdout.
 */
export declare function runRpcMode(session: AgentSession, setToolUIContext?: (uiContext: ExtensionUIContext, hasUI: boolean) => void, eventBus?: EventBus, input?: ReadableStream<Uint8Array>): Promise<never>;
