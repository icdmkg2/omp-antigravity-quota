import type { AgentEvent, AgentTool, AgentToolContext } from "@oh-my-pi/pi-agent-core";
import type { CursorMcpCall, CursorMcpResource, CursorMcpResourceContent, CursorShellStreamCallbacks, CursorTodoSnapshot, CursorExecHandlers as ICursorExecHandlers, ToolResultMessage } from "@oh-my-pi/pi-ai";
import type { MCPResourceReadResult } from "./mcp/types.js";
import type { TodoPhase } from "./tools/todo.js";
/**
 * A tool instance the bridge can run, matching the erased shape the session's
 * tool registry stores. The concrete tools have narrower `execute` parameter
 * types than the default `AgentTool`, which only unify through this alias.
 */
type CursorBridgeTool = AgentTool<any, any, any>;
/**
 * The live MCP connections Cursor's resource frames are answered from.
 *
 * Named so every construction site can hand over the same adapter; a session
 * and its advisors share one set of connections.
 */
export interface CursorMcpResourceAdapter {
    serverNames(): string[];
    getServerResources(name: string): Promise<{
        resources: {
            uri: string;
            name?: string;
            description?: string;
            mimeType?: string;
        }[];
    } | undefined>;
    readServerResource(name: string, uri: string): Promise<MCPResourceReadResult | undefined>;
}
interface CursorExecBridgeOptions {
    cwd: string;
    getCwd?: () => string;
    tools: Map<string, AgentTool>;
    /** Resolves execution overrides (mounted-device permission wrappers) before the canonical map. */
    getExecutableTool?: (name: string) => AgentTool | undefined;
    /**
     * The `replace`-mode `edit` instance `pi_edit` must run, when the session
     * granted `edit` at all.
     *
     * `PiEditExecArgs` is that mode's schema verbatim, and the session's own
     * `edit` may be in any mode — `hashline` by default — whose schema rejects
     * `old_string`/`new_string` outright. {@link tools} therefore cannot be trusted
     * for this one frame: a session that starts on another provider keeps its
     * configured instance in the map (only Cursor sessions move `edit` out), and
     * switching to Cursor later does not rebuild the roster.
     */
    getEditReplaceTool?: () => CursorBridgeTool | undefined;
    getToolContext?: () => AgentToolContext | undefined;
    emitEvent?: (event: AgentEvent) => void;
    /**
     * Whether frames that mutate the filesystem WITHOUT running a registry tool
     * may do so: the native `delete` frame, and a `read_mcp_resource` carrying
     * `download_path`. Both write or remove workspace files directly instead of
     * consulting {@link tools}, so a background read-only advisor could touch
     * files it was never granted a mutating tool for (issue #5680 review).
     *
     * This is a grant, not a policy: it answers "did the session hand this
     * channel a file-writing tool", which callers derive from their own roster
     * before any bridge-specific rewriting. The primary Cursor session moves
     * `edit` out of {@link tools} and serves it through
     * {@link getEditReplaceTool}, so reading the map here would deny an
     * edit-only session. Defaults to allowed
     * to preserve the primary agent's behavior; callers with a restricted tool
     * set (advisors) opt out. The user's approval policy is resolved separately,
     * per call.
     */
    allowDirectFileMutation?: boolean;
    /**
     * Mirror Cursor's server-owned todo list into local session state. Cursor
     * resolves `update_todos` / `read_todos` remotely, so without this bridge
     * the provider's list and the local `todo` state diverge silently.
     */
    setTodoPhases?: (phases: TodoPhase[]) => void;
    getTodoPhases?: () => TodoPhase[];
    /**
     * Persist the mirrored list to the session branch so it survives reloads.
     * Cursor emits no local `todo` toolResult, so nothing else records it.
     */
    persistTodoPhases?: (phases: TodoPhase[]) => void;
    /**
     * Build a `grep` tool honoring a frame's own context width and match cap.
     *
     * The modern `pi_grep` frame carries both, and the shared `grep` instance
     * is fixed to the session settings at construction — so without this the
     * two fields are silently dropped. Callers that cannot supply it keep the
     * shared instance and the session's defaults.
     *
     * The returned tool is executed as-is. Callers whose registry tools carry an
     * approval wrapper MUST apply the same wrapper here, or a frame supplying
     * either field silently escapes the approval gate that every other call
     * goes through.
     */
    createGrepTool?(options: {
        context?: number;
        totalMatchLimit?: number;
    }): CursorBridgeTool | undefined;
    /**
     * The session's live MCP connections, for Cursor's resource frames.
     *
     * `list_mcp_resources` / `read_mcp_resource` ask what this client's servers
     * advertise. Without this the bridge answers an empty catalog and
     * `not_found`, hiding resources the session is in fact connected to.
     *
     * `getServerResources` is async because a server's catalog loads in the
     * background after its tools register: a frame arriving in that window would
     * otherwise read the not-yet-populated cache and report an empty catalog,
     * which is indistinguishable from a server that advertises nothing.
     */
    mcpResources?: CursorMcpResourceAdapter;
}
export declare class CursorExecHandlers implements ICursorExecHandlers {
    private options;
    constructor(options: CursorExecBridgeOptions);
    /**
     * Modern Cursor builds paginate the legacy `read` frame with
     * `offset`/`limit`, exactly as `pi_read` does. Dropping them returns the
     * whole file (or its own truncation) for every page, so a model walking a
     * large file never advances. Composed with the same helper, so both frames
     * translate a range identically.
     */
    read(args: Parameters<NonNullable<ICursorExecHandlers["read"]>>[0]): Promise<ToolResultMessage<unknown>>;
    ls(args: Parameters<NonNullable<ICursorExecHandlers["ls"]>>[0]): Promise<ToolResultMessage<unknown>>;
    /**
     * Modern Cursor builds paginate this frame with `offset`. The local `grep`
     * paginates by file through `skip`, which is the same unit its own
     * "use skip=N for the next page" advice counts in — so an unforwarded
     * offset re-runs the identical search and returns page one forever.
     */
    grep(args: Parameters<NonNullable<ICursorExecHandlers["grep"]>>[0]): Promise<ToolResultMessage<unknown>>;
    write(args: Parameters<NonNullable<ICursorExecHandlers["write"]>>[0]): Promise<ToolResultMessage<unknown>>;
    delete(args: Parameters<NonNullable<ICursorExecHandlers["delete"]>>[0]): Promise<ToolResultMessage<unknown>>;
    shell(args: Parameters<NonNullable<ICursorExecHandlers["shell"]>>[0]): Promise<ToolResultMessage<unknown>>;
    shellStream(args: Parameters<NonNullable<ICursorExecHandlers["shellStream"]>>[0], callbacks: CursorShellStreamCallbacks): Promise<ToolResultMessage<unknown>>;
    diagnostics(args: Parameters<NonNullable<ICursorExecHandlers["diagnostics"]>>[0]): Promise<ToolResultMessage<unknown>>;
    /**
     * Modern Cursor CLI Pi tool frames (`ExecServerMessage` 45-51).
     *
     * These are a separate frame family from the legacy `read`/`shell`/... set,
     * not aliases: different args, different result oneofs, and no `tool_call_id`
     * (the provider mints one and passes it in `call.toolCallId`). Each maps onto
     * the local tool with matching semantics, so the same approval, sandboxing
     * and event plumbing applies as for a model-issued call.
     */
    /**
     * `offset`/`limit` are a 1-indexed start line plus a line count (verified
     * against the reference `LocalPiReadExecutor`), which is exactly the local
     * `read` tool's `:N+K` inline selector — the tool takes no range kwargs, so
     * the range has to be composed onto the path or ranged reads silently
     * return the whole file.
     */
    piRead(call: Parameters<NonNullable<ICursorExecHandlers["piRead"]>>[0]): Promise<ToolResultMessage<unknown>>;
    piBash(call: Parameters<NonNullable<ICursorExecHandlers["piBash"]>>[0]): Promise<ToolResultMessage<unknown>>;
    /**
     * `PiEditExecArgs` carries a path plus `oldText`/`newText` replacement
     * pairs. A single replacement maps onto the model-facing single-edit
     * `replace` schema verbatim; a multi-replacement frame still runs as ONE
     * tool lifecycle (one start/end event pair, one aggregate diff), so it is
     * sent in the tool's internal `edits` batch form (`ReplaceBatchParams`),
     * which only this bridge produces.
     *
     * The replace-mode instance is requested explicitly rather than resolved
     * from {@link CursorExecBridgeOptions.tools}: the registry's `edit` is in
     * the session's configured mode, whose schema rejects these arguments.
     */
    piEdit(call: Parameters<NonNullable<ICursorExecHandlers["piEdit"]>>[0]): Promise<ToolResultMessage<unknown>>;
    piWrite(call: Parameters<NonNullable<ICursorExecHandlers["piWrite"]>>[0]): Promise<ToolResultMessage<unknown>>;
    /**
     * `literal` makes the pattern a fixed string; the local tool is regex-only,
     * so the pattern is escaped on the way in (same translation the legacy pi
     * shim does).
     *
     * `context` and `limit` are not expressible in the model-facing schema —
     * context width comes from settings fixed at tool construction — so the
     * frame's values are honored by building a per-call `grep` through
     * {@link CursorExecBridgeOptions.createGrepTool}. Both are `optional int32`,
     * so a present `0` context means "no context lines", not "use the default".
     * Without the factory the shared instance runs with session defaults.
     */
    piGrep(call: Parameters<NonNullable<ICursorExecHandlers["piGrep"]>>[0]): Promise<ToolResultMessage<unknown>>;
    /**
     * `pi_find` is a filename search, which is the local `glob` tool — not
     * `grep`. Its `pattern` is a glob, joined onto `path` because `glob` takes a
     * single combined path spec.
     *
     * `limit` is `optional int32`, so `0` is present rather than unset; the
     * reference clamps it with `Math.max(1, limit ?? 1000)`, and an unset limit
     * leaves the local tool's own default in place.
     */
    piFind(call: Parameters<NonNullable<ICursorExecHandlers["piFind"]>>[0]): Promise<ToolResultMessage<unknown>>;
    /**
     * Redirected to `read`, which lists directories — same as the legacy `ls`.
     * The frame's entry `limit` is not mapped; see {@link piLsPath}.
     */
    piLs(call: Parameters<NonNullable<ICursorExecHandlers["piLs"]>>[0]): Promise<ToolResultMessage<unknown>>;
    /**
     * The resources this client's MCP servers advertise.
     *
     * Cursor addresses a later read by `server`, so every entry carries the name
     * it came from. An absent `server` filter means "all of them".
     */
    listMcpResources({ server }: {
        server?: string;
    }): Promise<CursorMcpResource[]>;
    /**
     * Read one resource, or `null` when the server or uri is unknown.
     *
     * MCP returns a list of content items; the wire carries exactly one text or
     * blob. Text items are joined, since a multi-part text resource is one
     * document; otherwise the first blob stands in. `blob` arrives base64 and
     * the wire wants bytes.
     *
     * A `downloadPath` frame is a different contract: write the bytes to that
     * workspace-relative path and answer with the path alone, so a large binary
     * lands on disk instead of in the model's context. That makes it a workspace
     * mutation reached without a registry tool, so it is gated exactly like the
     * native `delete` frame — on the session actually granting a file-writing
     * tool, and on the user's `write`-tier policy. The gate runs before the read
     * so a refused download never fetches the resource either.
     */
    readMcpResource({ server, uri, downloadPath, }: {
        server: string;
        uri: string;
        downloadPath?: string;
    }): Promise<CursorMcpResourceContent | null>;
    /**
     * Settle a completed native Cursor todo call, mirroring its list when the
     * server supplied an authoritative one.
     *
     * Cursor's snapshot is a flat list, so tasks already known locally keep
     * their phase and only their status is updated; unknown tasks land in a
     * single fallback phase. Statuses come straight from the server snapshot —
     * no local normalization, or an all-pending remote list would gain a
     * phantom in-progress task the remote list does not have.
     *
     * The snapshot is also persisted to the session branch. Every other
     * provider's todo state survives a reload because `todo` runs locally and
     * its `toolResult` (carrying `details.phases`) lands in the branch, which
     * `#syncTodoPhasesFromBranch` replays. Cursor resolves the tool remotely and
     * emits no such result, so without an explicit entry the list is in-memory
     * only and every reload, rewind, compaction, or session switch drops it.
     *
     * This ALWAYS settles the call and returns the result to persist, even when
     * nothing is mirrored. Two reasons it cannot bail out early:
     *
     * - the interactive card leaves `pendingTools` only on a matching
     *   `tool_execution_end`, so staying silent leaves it animating forever;
     * - an unpaired `toolCall` is stripped as dangling by `buildSessionContext`,
     *   erasing the interaction from every rebuilt transcript.
     *
     * A `null` snapshot means nothing may be mirrored — a server `error`, or a
     * benign refusal: a filtered, truncated, or empty read, or a snapshot the
     * local model cannot represent. Local state is left untouched, and the result
     * carries no `details` (text `"Todo snapshot not mirrored"`): `event-controller`
     * feeds `details.phases` straight into `setTodos`, so echoing the current list
     * back would let a call that changed nothing overwrite live UI state.
     */
    todoSync(snapshot: CursorTodoSnapshot | null, toolCallId: string, error?: string | null): ToolResultMessage;
    mcp(call: CursorMcpCall): Promise<ToolResultMessage<unknown>>;
    /**
     * Resolve an MCP call's approval without running it.
     *
     * Same resolution the wrapper applies at execution time, minus the
     * execution: an unknown tool is not approvable, and a `prompt` is not an
     * approval — the frame has no way to carry an interactive question, and the
     * user is asked for real when the call itself arrives.
     */
    mcpApprovalPreflight(call: CursorMcpCall): Promise<boolean>;
}
export {};
