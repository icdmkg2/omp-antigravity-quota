/** Minimal UI-capability fields needed to decide whether bash can use the local PTY overlay. */
export interface BashPtyContext {
    hasUI?: boolean;
    ui?: unknown;
}
/** Return whether a bash tool call should use the local interactive PTY overlay. */
export declare function canUseInteractiveBashPty(pty: boolean, ctx: BashPtyContext | undefined): boolean;
