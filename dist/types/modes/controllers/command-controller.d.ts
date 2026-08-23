import { type CompactionOutcome } from "@oh-my-pi/pi-agent-core/compaction";
import { type ProviderDetails, type UsageReport } from "@oh-my-pi/pi-ai";
import type { CompactOptions } from "../../extensibility/extensions/types.js";
import { theme } from "../../modes/theme/theme.js";
import type { InteractiveModeContext } from "../../modes/types.js";
import type { OAuthAccountIdentity } from "../../session/auth-storage.js";
import type { CompactMode } from "../../session/compact-modes.js";
import { type ShakeMode } from "../../session/shake-types.js";
export declare class CommandController {
    #private;
    private readonly ctx;
    constructor(ctx: InteractiveModeContext);
    openInBrowser(urlOrPath: string): void;
    handleExportCommand(text: string): Promise<void>;
    handleDumpCommand(): Promise<void>;
    handleAdvisorDumpCommand(isRaw?: boolean): void;
    handleDebugTranscriptCommand(): Promise<void>;
    handleShareCommand(): Promise<void>;
    handleSessionCommand(): Promise<void>;
    handleAdvisorStatusCommand(): Promise<void>;
    handleJobsCommand(): Promise<void>;
    handleUsageCommand(reports?: UsageReport[] | null): Promise<void>;
    handleChangelogCommand(showFull?: boolean): Promise<void>;
    handleHotkeysCommand(): void;
    handleToolsCommand(): void;
    handleContextCommand(): void;
    handleMemoryCommand(text: string): Promise<void>;
    handleClearCommand(): Promise<void>;
    handleFreshCommand(): Promise<void>;
    handleResetContextCommand(): Promise<void>;
    handleDropCommand(): Promise<void>;
    handleForkCommand(): Promise<void>;
    /**
     * `/move` — relocate the current session to a different directory.
     *
     * With no `targetPath` (TUI only), opens an autocomplete overlay so the user
     * can pick or type a directory. With a `targetPath`, resolves it directly.
     * If the target directory does not exist, the user is asked whether to create
     * it. The active session file and artifacts are moved into the target
     * directory's session bucket so `/resume` from that directory can find it.
     */
    handleMoveCommand(targetPath?: string): Promise<void>;
    handleRenameCommand(title: string): Promise<void>;
    handleBashCommand(command: string, excludeFromContext?: boolean): Promise<void>;
    handlePythonCommand(code: string, excludeFromContext?: boolean): Promise<void>;
    handleCompactCommand(customInstructions?: string, mode?: CompactMode, beforeFlush?: (outcome: CompactionOutcome) => void | Promise<void>, internalGuidance?: string): Promise<CompactionOutcome>;
    /**
     * TUI handler for `/shake`. `elide` drops heavy structural content,
     * `images` strips image blocks, and `thinking` drops all thinking blocks.
     * Rebuilds the chat and reports counts.
     */
    handleShakeCommand(mode: ShakeMode): Promise<void>;
    executeCompaction(customInstructionsOrOptions?: string | CompactOptions, isAuto?: boolean, beforeFlush?: (outcome: CompactionOutcome) => void | Promise<void>, mode?: CompactMode): Promise<CompactionOutcome>;
    handleHandoffCommand(customInstructions?: string): Promise<void>;
}
export declare function renderProviderSection(details: ProviderDetails, uiTheme: Pick<typeof theme, "fg">): string;
/**
 * Compact one-line quota summary for a single advisor's provider.
 * Returns `null` when the provider has no usage data.
 * When `activeAccount` is provided, only limits matching that credential
 * are shown (mirrors `renderUsageReports`'s account-stickiness filtering).
 * Example output: `Quota: 7d window · 67% used · resets in 3.2d`
 */
export declare function formatCompactQuota(provider: string, reports: UsageReport[], nowMs: number, activeAccount?: OAuthAccountIdentity): string | null;
export declare function renderUsageReports(reports: UsageReport[], uiTheme: typeof theme, nowMs: number, availableWidth: number, resolveActiveAccount?: (provider: string) => OAuthAccountIdentity | undefined, usageModelSelectors?: readonly string[]): string;
