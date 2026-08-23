/**
 * Patch application logic for the edit tool.
 *
 * Applies parsed diff hunks to file content using fuzzy matching
 * for robust handling of whitespace and formatting differences.
 */
import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import { type WritethroughCallback, type WritethroughDeferredHandle } from "../../lsp/index.js";
import type { ToolSession } from "../../tools/index.js";
import type { AppliedEditObserver } from "../blackbox.js";
import type { EditToolDetails, LspBatchRequest } from "../renderer.js";
export type Operation = "create" | "delete" | "update";
export interface PatchInput {
    path: string;
    op: Operation;
    rename?: string;
    diff?: string;
}
export interface FileSystem {
    exists(path: string): Promise<boolean>;
    read(path: string): Promise<string>;
    readBinary?: (path: string) => Promise<Uint8Array>;
    write(path: string, content: string): Promise<void>;
    delete(path: string): Promise<void>;
    mkdir(path: string): Promise<void>;
}
interface FileChange {
    type: Operation;
    path: string;
    newPath?: string;
    oldContent?: string;
    newContent?: string;
}
export interface ApplyPatchResult {
    change: FileChange;
    warnings?: string[];
}
export interface ApplyPatchOptions {
    cwd: string;
    dryRun?: boolean;
    fuzzyThreshold?: number;
    allowFuzzy?: boolean;
    fs?: FileSystem;
    /**
     * Permit `op: "create"` to replace an existing file (full-file overwrite).
     * The JSON `patch` edit mode sanctions create-as-overwrite for major
     * restructures (see prompts/tools/patch.md); the Codex `apply_patch`
     * envelope documents `*** Add File` as strictly non-overwriting and must
     * leave this unset.
     */
    allowCreateOverwrite?: boolean;
}
/** Default filesystem implementation using Bun APIs */
export declare const defaultFileSystem: FileSystem;
/**
 * Apply a patch operation to the filesystem.
 */
export declare function applyPatch(input: PatchInput, options: ApplyPatchOptions): Promise<ApplyPatchResult>;
/**
 * Preview what changes a patch would make without applying it.
 */
export declare function previewPatch(input: PatchInput, options: ApplyPatchOptions): Promise<ApplyPatchResult>;
export declare function computePatchDiff(input: PatchInput, cwd: string, options?: {
    fuzzyThreshold?: number;
    allowFuzzy?: boolean;
    allowCreateOverwrite?: boolean;
}): Promise<{
    diff: string;
    firstChangedLine: number | undefined;
} | {
    error: string;
}>;
export declare const patchEditEntrySchema: import("@oh-my-pi/omptype").FluentType<{
    diff?: string | undefined;
    op?: "create" | "delete" | "update" | undefined;
    rename?: string | undefined;
}, {
    diff?: string | undefined;
    op?: "create" | "delete" | "update" | undefined;
    rename?: string | undefined;
}>;
export type PatchEditEntry = typeof patchEditEntrySchema.infer;
export declare const patchEditSchema: import("@oh-my-pi/omptype").FluentType<{
    edits: {
        diff?: string | undefined;
        op?: "create" | "delete" | "update" | undefined;
        rename?: string | undefined;
    }[];
    path: string;
}, {
    edits: {
        diff?: string | undefined;
        op?: "create" | "delete" | "update" | undefined;
        rename?: string | undefined;
    }[];
    path: string;
}>;
export type PatchParams = typeof patchEditSchema.infer;
export interface ExecutePatchSingleOptions {
    session: ToolSession;
    path: string;
    params: PatchEditEntry;
    signal?: AbortSignal;
    batchRequest?: LspBatchRequest;
    allowFuzzy: boolean;
    fuzzyThreshold: number;
    /** See {@link ApplyPatchOptions.allowCreateOverwrite}; set by the JSON `patch` mode only. */
    allowCreateOverwrite?: boolean;
    writethrough: WritethroughCallback;
    beginDeferredDiagnosticsForPath: (path: string) => WritethroughDeferredHandle;
    /** Observes a committed content transition before result snapshots are pruned. */
    onApplied?: AppliedEditObserver;
}
export declare function executePatchSingle(options: ExecutePatchSingleOptions): Promise<AgentToolResult<EditToolDetails, typeof patchEditEntrySchema>>;
export {};
