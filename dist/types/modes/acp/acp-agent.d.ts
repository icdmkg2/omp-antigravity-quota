import { type postmortem } from "@oh-my-pi/pi-utils";
import { type Agent, type AgentSideConnection, type AuthenticateRequest, type AuthenticateResponse, type ClientCapabilities, type CloseSessionRequest, type CloseSessionResponse, type ForkSessionRequest, type ForkSessionResponse, type InitializeRequest, type InitializeResponse, type ListSessionsRequest, type ListSessionsResponse, type LoadSessionRequest, type LoadSessionResponse, type NewSessionRequest, type NewSessionResponse, type PromptRequest, type PromptResponse, type ResumeSessionRequest, type ResumeSessionResponse, type SetSessionConfigOptionRequest, type SetSessionConfigOptionResponse, type SetSessionModeRequest, type SetSessionModeResponse } from "@oh-my-pi/pi-utils/acp";
import { type ExtensionUIContext } from "../../extensibility/extensions/index.js";
import type { AgentSession } from "../../session/agent-session.js";
/**
 * Delay between `session/new` (or `session/load` / `session/resume` /
 * `unstable_session/fork`) returning and the agent firing the first
 * notifications against the new session id. Mitigates Zed's
 * `Received session notification for unknown session` race — see
 * `#scheduleBootstrapUpdates`. Exported so the ACP test harness can
 * wait past this guard without hard-coding the literal.
 */
export declare const ACP_BOOTSTRAP_RACE_GUARD_MS = 50;
type AcpSessionHandle = {
    session: AgentSession;
    setToolUIContext: (uiContext: ExtensionUIContext, hasUI: boolean) => void;
};
type CreateAcpSession = (cwd: string, options?: {
    interactivePrompts?: boolean;
}) => Promise<AgentSession | AcpSessionHandle>;
/**
 * Build an {@link ExtensionUIContext} that translates skill/extension UI
 * requests into ACP elicitations against `connection` for the session
 * returned by `getSessionId()`. The id is read lazily at each elicitation
 * because `AgentSession.sessionId` is a getter over `sessionManager` state
 * that mutates when an extension command calls `ctx.newSession` /
 * `ctx.switchSession` — snapshotting it once at factory time would route
 * later elicitations to the pre-switch id. Live reads keep the bridge
 * symmetric with every other `sessionUpdate` call in this file
 * (`record.session.sessionId` is always evaluated at emit time).
 *
 * The non-elicitation surface (custom components, theming, terminal
 * input) remains stubbed — ACP clients render those themselves or not
 * at all. Capability gating respects the client's `initialize`
 * advertisement.
 */
export declare function createAcpExtensionUiContext(connection: AgentSideConnection, getSessionId: () => string, clientCapabilities: ClientCapabilities | undefined): ExtensionUIContext;
export declare class AcpAgent implements Agent {
    #private;
    constructor(connection: AgentSideConnection, createSession: CreateAcpSession, initialSession?: AgentSession);
    setCancelCleanupTimeoutForTesting(timeoutMs: number): void;
    initialize(params: InitializeRequest): Promise<InitializeResponse>;
    authenticate(params: AuthenticateRequest): Promise<AuthenticateResponse>;
    newSession(params: NewSessionRequest): Promise<NewSessionResponse>;
    loadSession(params: LoadSessionRequest): Promise<LoadSessionResponse>;
    listSessions(params: ListSessionsRequest): Promise<ListSessionsResponse>;
    resumeSession(params: ResumeSessionRequest): Promise<ResumeSessionResponse>;
    unstable_forkSession(params: ForkSessionRequest): Promise<ForkSessionResponse>;
    closeSession(params: CloseSessionRequest): Promise<CloseSessionResponse>;
    setSessionMode(params: SetSessionModeRequest): Promise<SetSessionModeResponse>;
    setSessionConfigOption(params: SetSessionConfigOptionRequest): Promise<SetSessionConfigOptionResponse>;
    prompt(params: PromptRequest): Promise<PromptResponse>;
    cancel(params: {
        sessionId: string;
    }): Promise<void>;
    extMethod(method: string, params: {
        [key: string]: unknown;
    }): Promise<{
        [key: string]: unknown;
    }>;
    extNotification(_method: string, _params: {
        [key: string]: unknown;
    }): Promise<void>;
    get signal(): AbortSignal;
    get closed(): Promise<void>;
    /** Dispose every session owned by this ACP connection and await persisted teardown. */
    dispose(reason?: postmortem.Reason): Promise<void>;
}
export {};
