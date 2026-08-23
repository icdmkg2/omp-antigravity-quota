import type { WritethroughCallback } from "../lsp/index.js";
import type { ToolSession } from "../tools/index.js";
import { type AppliedEditSnapshot } from "./blackbox.js";
/** The localized broken region plus its parseable pre-image reference. */
export interface RepairRegion {
    /** Replaced line span in the broken file, `[bStart, bEnd)`. */
    bStart: number;
    bEnd: number;
    /** The broken region as it exists on disk. */
    brokenText: string;
    /** Post-image context with culprit hunks reverted; splicing it restores the parse. */
    referenceText: string;
    /** Canonical tree-sitter language name of the pre-image. */
    language: string;
}
/**
 * Localize the parse breakage introduced by `prev → next` to a bounded line
 * region. Returns `undefined` when the breakage cannot be isolated under
 * {@link MAX_REGION_LINES} — callers fall back to the plain parse warning.
 */
export declare function computeRepairRegion(snapshot: AppliedEditSnapshot): RepairRegion | undefined;
/** A successful region repair: the full repaired file content. */
export interface RegionRepair {
    content: string;
    region: RepairRegion;
    /** Completion attempts consumed (1 = first shot, 2 = feedback retry). */
    attempts: number;
}
/**
 * Repair one parse regression with an injected completer. Accepts the first
 * candidate (verbatim, or realigned against the broken region or the
 * reference) that is not a revert of the intended change and whose splice
 * makes the whole file parse again. One feedback retry on failure.
 */
export declare function repairParseRegression(snapshot: AppliedEditSnapshot, complete: (builtPrompt: string) => Promise<string>): Promise<RegionRepair | undefined>;
/** A committed auto-repair, for the edit tool's result message. */
export interface EditAutoRepairOutcome {
    /** Unified diff of the repair (broken on-disk content → repaired content). */
    diff: string;
    /** `provider/id` of the model that produced the repair. */
    model: string;
    attempts: number;
}
/**
 * Attempt to auto-repair a committed edit that introduced a parse failure,
 * writing the repaired content through the edit tool's LSP writethrough.
 * Gated on `edit.autoRepair.enabled` and the `smol` role resolving to an
 * authenticated model. Returns `undefined` whenever repair is unavailable,
 * unsafe (file changed or recovered on its own), or rejected by validation.
 */
export declare function attemptEditAutoRepair(options: {
    session: ToolSession;
    snapshot: AppliedEditSnapshot;
    writethrough: WritethroughCallback;
    signal?: AbortSignal;
}): Promise<EditAutoRepairOutcome | undefined>;
