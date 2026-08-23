import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolExample } from "@oh-my-pi/pi-ai";
import type { ToolSession } from "../tools/index.js";
import { type EditMode } from "../utils/edit-mode.js";
import { hashlineEditParamsSchema } from "./hashline/index.js";
import { type ApplyPatchParams, applyPatchSchema } from "./modes/apply-patch.js";
import { type PatchParams, patchEditSchema } from "./modes/patch.js";
import { type ReplaceBatchParams, type ReplaceParams, replaceEditSchema } from "./modes/replace.js";
import { type EditToolDetails } from "./renderer.js";
import { type SloppyParams, sloppyEditSchema } from "./sloppy.js";
export * from "@oh-my-pi/hashline";
export { DEFAULT_EDIT_MODE, type EditMode, normalizeEditMode } from "../utils/edit-mode.js";
export * from "./apply-patch/index.js";
export * from "./diff.js";
export * from "./file-snapshot-store.js";
export * from "./hashline/index.js";
export * from "./modes/apply-patch.js";
export * from "./modes/patch.js";
export * from "./modes/replace.js";
export * from "./normalize.js";
export * from "./renderer.js";
export * from "./sloppy.js";
export * from "./snapshot-details.js";
export * from "./streaming.js";
type TInput = typeof replaceEditSchema | typeof patchEditSchema | typeof hashlineEditParamsSchema | typeof applyPatchSchema | typeof sloppyEditSchema;
type HashlineParams = typeof hashlineEditParamsSchema.infer;
type EditParams = ReplaceParams | ReplaceBatchParams | PatchParams | HashlineParams | ApplyPatchParams | SloppyParams;
export declare class EditTool implements AgentTool<TInput> {
    #private;
    private readonly session;
    readonly approval: (args: unknown) => "read" | "write";
    readonly formatApprovalDetails: (args: unknown) => string[];
    readonly name = "edit";
    readonly label = "Edit";
    readonly loadMode = "essential";
    readonly concurrency = "exclusive";
    readonly strict = true;
    /**
     * `mode` pins the edit variant for this instance, for callers whose protocol
     * fixes the shape of an edit. The Cursor `pi_edit` frame carries
     * `old_string`/`new_string` args, which only `replace` accepts — under the
     * default `hashline` mode those args do not match the schema at all. Left
     * unset, the env/settings resolution applies as before.
     */
    constructor(session: ToolSession, mode?: EditMode);
    get mode(): EditMode;
    get description(): string;
    get parameters(): TInput;
    get examples(): readonly ToolExample[] | undefined;
    /**
     * When in `apply_patch` mode, expose the Codex Lark grammar so providers
     * that support OpenAI-style custom tools can emit a grammar-constrained
     * variant. Providers that don't support custom tools ignore this field
     * and fall back to emitting a JSON function tool from `parameters`.
     */
    get customFormat(): {
        syntax: "lark";
        definition: string;
    } | undefined;
    /**
     * Wire-level tool name used when the custom-tool variant is active. GPT-5+
     * is trained on the literal name `apply_patch`; internally this is just a
     * mode of the `edit` tool. The agent-loop dispatcher matches both the
     * internal `name` and `customWireName`, so returned calls route correctly.
     */
    get customWireName(): string | undefined;
    /**
     * Normalize streamed args into the source text this edit introduces, so
     * stream matchers (TTSR rules) run against real file content instead of the
     * mode-specific patch grammar.
     */
    matcherDigest(args: unknown): string | undefined;
    /**
     * Project the streamed args onto their target file paths so path-scoped
     * stream matchers (e.g. TTSR `tool:edit(*.ts)` globs) match hashline and
     * apply_patch edits even though the path lives in the wire payload (a
     * section header / envelope marker) rather than a top-level argument.
     */
    matcherPaths(args: unknown): readonly string[] | undefined;
    /**
     * Per-file projection of the streamed args, splitting multi-section
     * hashline / multi-hunk apply_patch payloads into one (path, digest) entry
     * per touched file. Path-scoped stream matchers (TTSR) then evaluate each
     * file in isolation, so a `tool:edit(*.ts)` rule never fires on text that
     * actually belongs to a sibling Markdown hunk.
     */
    matcherEntries(args: unknown): readonly {
        path: string;
        digest: string;
    }[] | undefined;
    execute(_toolCallId: string, params: EditParams, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<EditToolDetails, TInput>, context?: AgentToolContext): Promise<AgentToolResult<EditToolDetails, TInput>>;
}
