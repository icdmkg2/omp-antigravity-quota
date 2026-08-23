import type { ToolChoice } from "@oh-my-pi/pi-ai";
export interface ResolveInfo {
    /** The ToolChoice that was served to the LLM. */
    choice: ToolChoice;
}
export interface RejectInfo {
    /** The ToolChoice that was yielded but never (or unsuccessfully) served. */
    choice: ToolChoice;
    reason: "aborted" | "error" | "cleared" | "removed" | "unavailable" | "not_invoked";
}
/** Controls whether rejection replays a yield, drops it, or drops its remaining sequence. */
export type RejectOutcome = "requeue" | "drop" | "drop_sequence";
export interface DirectiveCallbacks {
    /** Fires when the yield completed; onInvoked directives require the requested tool to run first. */
    onResolved?: (info: ResolveInfo) => void;
    /**
     * Return "requeue" to replay the same value, or "drop_sequence" to discard
     * its directive including later yields. Default: drop the rejected yield.
     */
    onRejected?: (info: RejectInfo) => RejectOutcome | undefined;
    /**
     * Handler invoked when the model actually calls the forced tool. The queue
     * directive carries the real execution logic; the tool's own execute() is
     * bypassed. Returns the tool result directly.
     */
    onInvoked?: (input: unknown) => Promise<unknown> | unknown;
}
export interface ToolChoiceDirective {
    generator: Iterator<ToolChoice>;
    /** Stable label for targeted removal and debugging (e.g. "user-force"). */
    label: string;
    callbacks: DirectiveCallbacks;
    /** Original multi-yield directive retained across one-yield replays. */
    sequenceRoot?: ToolChoiceDirective;
}
export interface PushOptions {
    /** Prepend to head instead of appending to tail. Default: false. */
    now?: boolean;
    label?: string;
    /** Lifecycle callbacks for this directive. */
    onResolved?: DirectiveCallbacks["onResolved"];
    onRejected?: DirectiveCallbacks["onRejected"];
    onInvoked?: DirectiveCallbacks["onInvoked"];
}
export declare function onceGen(choice: ToolChoice): Generator<ToolChoice, void, unknown>;
export declare class ToolChoiceQueue {
    #private;
    pushOnce(choice: ToolChoice, options?: PushOptions): void;
    pushSequence(choices: ToolChoice[], options?: PushOptions): void;
    push(generator: Iterable<ToolChoice>, options?: PushOptions): void;
    /**
     * Advance the head directive and return its next yield. Records the value
     * as in-flight until resolve() or reject() is called.
     */
    nextToolChoice(): ToolChoice | undefined;
    /**
     * The in-flight yield completed normally. Directives with onInvoked are only
     * consumed after their requested tool ran; a normal text turn or a different
     * tool call requeues/rejects the directive instead.
     */
    resolve(): void;
    /**
     * The in-flight yield was not served, or the turn aborted/errored.
     * Fires onRejected to let the caller decide: "requeue" replays the exact
     * lost value at the head of the queue; anything else drops it.
     */
    reject(reason: RejectInfo["reason"]): void;
    /** True if there is an in-flight yield that hasn't been resolved or rejected. */
    get hasInFlight(): boolean;
    /** Return the in-flight directive's onInvoked handler and mark it when called. */
    peekInFlightInvoker(): ((input: unknown) => Promise<unknown> | unknown) | undefined;
    /** Register (or replace by exact id) a non-forcing pending preview invoker. */
    registerPendingInvoker(id: string, sourceToolName: string, onInvoked: (input: unknown) => Promise<unknown> | unknown): void;
    /** Drop the pending invoker with this id (e.g. after it resolves). */
    removePendingInvoker(id: string): void;
    /** Drop every pending preview invoker without touching hard tool-choice directives. */
    clearPendingInvokers(): void;
    /** True when at least one non-forcing pending preview is registered. */
    get hasPendingInvoker(): boolean;
    /** The head (most-recently registered) pending invoker's handler, for resolve dispatch. */
    peekPendingInvoker(): ((input: unknown) => Promise<unknown> | unknown) | undefined;
    /** The head pending preview's stable id + source tool, for building the agent-level
     *  SoftToolRequirement (the id drives reminder re-injection when the head changes). */
    peekPendingHead(): {
        id: string;
        sourceToolName: string;
    } | undefined;
    /** Remove all directives with the given label. Rejects in-flight if it matches. */
    removeByLabel(label: string): void;
    /** Empty the queue and reject any in-flight yield. */
    clear(): void;
    /** Return the label of the most recently resolved directive, then clear it. */
    consumeLastServedLabel(): string | undefined;
    /** For tests/debug: labels of currently queued directives in order. */
    inspect(): readonly string[];
}
