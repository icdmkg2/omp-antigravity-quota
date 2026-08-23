/**
 * report_issue — automated QA backend for tracking unexpected tool behavior.
 *
 * No model-facing tool schema anymore: the write tool dispatches plain text to
 * `xd://report_issue`, and the system prompt tells the model to write
 * `<tool>: <concise description>` there when auto-QA is enabled.
 *
 * Enabled by default (`dev.autoqa` defaults to true); `PI_AUTO_QA=0` or an
 * explicit `dev.autoqa: false` short-circuits injection entirely. When the
 * user is only enabled by default (never configured `dev.autoqa` themselves),
 * a persisted `dev.autoqaConsent: "denied"` also disables injection so a "No"
 * in the consent dialog fully turns the feature off.
 * Records grievances to a local SQLite database; never throws from the device
 * dispatch path.
 *
 * Nothing is written until consent resolves. If the user has never been asked
 * (`dev.autoqaConsent === "unset"`) the process-global consent handler —
 * wired by `InteractiveMode` to a Yes/No popup — is invoked exactly once and
 * the decision is persisted; a denial (or dismissal) drops the pending report
 * without touching the database. Subsequent calls (including from subagents)
 * read the cached decision without prompting. `PI_AUTO_QA_PUSH=1` bypasses
 * the dialog for headless environments.
 *
 * When the user grants consent, push is automatically active against the
 * bundled endpoint (`dev.autoqaPush.endpoint`, default `qa.omp.sh`). Each
 * insert schedules a background flush that POSTs pending rows and deletes them
 * on HTTP 2xx. `PI_AUTO_QA_PUSH=1` forces push in non-interactive environments
 * where the consent dialog never fires. Device execution is never blocked on
 * the network and never throws.
 */
import { Database } from "bun:sqlite";
import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { FetchImpl } from "@oh-my-pi/pi-ai";
import type { Component } from "@oh-my-pi/pi-tui";
import type { Settings } from "../index.js";
import type { Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "./index.js";
import type { XdevDispatch } from "./xdev.js";
export declare const REPORT_ISSUE_DEVICE_NAME = "report_issue";
export declare const REPORT_ISSUE_DEVICE_PATH = "xd://report_issue";
/** Usage text for `read xd://report_issue`. */
export declare function reportIssueDeviceUsage(): string;
/** Whether a tool call writes to `xd://report_issue`. */
export declare function isReportIssueToolCall(toolCall: {
    name: string;
    arguments?: Record<string, unknown>;
}): boolean;
/** Call preview for an `xd://report_issue` write. */
export declare function renderReportIssueDeviceCall(content: unknown, uiTheme: Theme): Component;
/**
 * Whether Auto-QA is active for this session.
 *
 * Precedence: `PI_AUTO_QA` env flag > explicit `dev.autoqa` setting >
 * default-on unless the user previously denied consent. The denial veto only
 * applies to the default: explicitly configuring `dev.autoqa: true` re-enables
 * injection (recording still no-ops until consent is granted).
 */
export declare function isAutoQaEnabled(settings?: Settings): boolean;
/**
 * Resolver for the user's "share grievances?" consent.
 *
 * Return values:
 *   - `true`  — user agreed; record + ship for this run and persist.
 *   - `false` — user declined; suppress for this run and persist.
 *   - `null`  — user dismissed the dialog (ESC, click-away, …) without
 *               picking an option. The decision is NOT cached or persisted,
 *               so the next `report_issue` invocation re-prompts.
 *
 * Persistence is the tool's job (so subagent invocations can persist into the
 * disk-backed `Settings` instance the host registered alongside the handler),
 * not the handler's. Implementations live in hosts that have UI affordances —
 * today only `InteractiveMode`. When no handler is registered (CLI subcommands,
 * tests, non-interactive runs) consent defaults to `false` — the explicit
 * "don't collect by default" stance.
 */
export type AutoQaConsentHandler = () => Promise<boolean | null>;
/**
 * Register the consent handler and the persistent {@link Settings} instance
 * the decision should be written to. Passing `null` clears the handler
 * (e.g. on `InteractiveMode` teardown). Re-registration is authoritative.
 */
export declare function setAutoQaConsentHandler(handler: AutoQaConsentHandler | null, persistentSettings?: Settings | null): void;
/** Test-only: clear consent cache + handler. Never call from production code. */
export declare function __resetAutoQaConsentForTests(): void;
/**
 * Resolve the user's consent for Auto-QA grievances.
 *
 * Priority:
 * 1. module cache (`cachedConsent`) — process-global, survives subagent boundaries
 * 2. persisted setting on the caller's `Settings`
 * 3. persisted setting on the registered persistent settings instance
 * 4. registered UI handler (single-flight)
 * 5. default `false` (no handler / non-interactive)
 */
export declare function resolveAutoQaConsent(settings: Settings | undefined): Promise<boolean>;
/**
 * Open (or return the cached handle for) the auto-QA SQLite database at
 * `~/.omp/autoqa.db` (XDG: `$XDG_DATA_HOME/omp/autoqa.db`), creating the
 * schema lazily. Returns `null` when the path cannot be resolved or opened.
 */
export declare function openAutoQaDb(): Database | null;
export interface FlushResult {
    pushed: number;
    ok: boolean;
    skipped?: boolean;
}
/**
 * Optional per-flush controls. Used by `omp grievances push` to surface
 * progress to a TTY and to skip the user-facing consent gate (manual
 * pushes are the user's explicit intent, not a side effect of a device write).
 */
export interface FlushOptions {
    /**
     * Skip the `dev.autoqaConsent === "granted"` gate in
     * {@link resolvePushConfig}. Endpoint configuration is still required.
     * Reserved for explicit user-driven pushes (CLI `grievances push`,
     * future debug recipes); never set from the device's auto-flush path.
     */
    bypassConsent?: boolean;
    /**
     * Fetch implementation for the push POST. Defaults to global fetch.
     */
    fetch?: FetchImpl;
    /**
     * Fires once at the start of the loop with the snapshot count of
     * unpushed rows. Subsequent inserts won't be reflected (the count is
     * a planning hint for progress reporters, not a live total).
     */
    onStart?: (totalUnpushed: number) => void;
    /**
     * Fires after every successfully shipped batch with the running pushed
     * count. Reporters compare against the `totalUnpushed` they saw in
     * `onStart` to advance their bar.
     */
    onProgress?: (pushedSoFar: number) => void;
}
/** Test-only: clear single-flight + cooldown state. Never call from production code. */
export declare function __resetAutoQaFlushStateForTests(): void;
/**
 * Flush queued grievances to the configured backend.
 */
export declare function flushGrievances(db?: Database, settings?: Settings, options?: FlushOptions): Promise<FlushResult>;
/** Test-only: await the last consent → insert → flush pipeline. */
export declare function __awaitAutoQaRecordPipelineForTests(): Promise<void>;
/**
 * Execute `write xd://report_issue`. `text` must be either:
 * - `<tool>: <concise description>` on one line, or
 * - tool name on the first line with the report body below.
 */
export declare function dispatchReportIssueDevice(session: ToolSession, text: string): Promise<{
    result: AgentToolResult<unknown>;
    xdev: XdevDispatch;
}>;
