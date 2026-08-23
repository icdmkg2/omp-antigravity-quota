/** Shape forwarded from the plan-proposal handler to InteractiveMode's
 *  approval popup. Populated by the `xd://propose` dispatch when the agent
 *  submits a plan for approval. `planFilePath` is the agent-chosen
 *  `local://<slug>-plan.md` artifact — it is never renamed on approval, so
 *  links to it stay valid for the session. */
export interface PlanApprovalDetails {
    planFilePath: string;
    title: string;
    planExists: boolean;
}
/** Validate and normalize the agent-supplied plan title into a safe filename stem.
 *  Spaces and other URL-safe punctuation are replaced with hyphens so models that
 *  produce natural-language titles (e.g. "My feature plan") still succeed.
 *  Characters that cannot be safely represented after replacement are dropped.
 *  The result is restricted to letters, numbers, underscores, and hyphens so it
 *  is safe to splice into a `local://` URL without escaping. */
export declare function normalizePlanTitle(title: string): {
    title: string;
    fileName: string;
};
/** Best-effort derivation of a plan title from inputs the agent already produced.
 *  Returns the first non-empty candidate that survives `normalizePlanTitle`:
 *    1. an explicit `suppliedTitle` (e.g. `extra.title` from the resolve call),
 *    2. the first level-1 markdown heading inside `planContent`,
 *    3. the filename stem of `planFilePath` (e.g. `PLAN` from `local://PLAN.md`),
 *    4. the literal `"plan"` so callers never have to handle `null`.
 *  The fallback exists because some grammar-constrained models cannot emit a
 *  string into the open `extra` schema and instead drop in `{}` (issue #1179);
 *  plan-mode would otherwise loop forever on an unreachable validation. */
export declare function resolvePlanTitle(input: {
    suppliedTitle?: unknown;
    planContent: string;
    planFilePath: string;
}): {
    title: string;
    fileName: string;
    source: "supplied" | "heading" | "filename" | "default";
};
/** Humanize a normalized plan title for use as a session display name.
 *  Replaces `-`/`_` separators with spaces and capitalizes the first letter.
 *  Returns an empty string when the input collapses to whitespace. */
export declare function humanizePlanTitle(title: string): string;
/** The `local://` URL a plan slug maps to. The agent writes the plan here and
 *  passes the slug to `resolve`; the file is never renamed, so this URL — and
 *  any hyperlink to it — stays valid for the life of the session. */
export declare function planFileUrlForSlug(slug: string): string;
export interface ResolveApprovedPlanInput {
    /** The agent's `extra.title` from the `resolve` call, if any. */
    suppliedTitle?: unknown;
    /** The plan path recorded in plan-mode state (the entry default or a prior plan). */
    statePlanFilePath: string;
    /** Read a plan `local://` URL, returning null when the file does not exist. */
    readPlan: (planUrl: string) => Promise<string | null>;
    /** Optional fallback: list candidate plan `local://` URLs (newest first) so a
     *  plan whose name can't be reconstructed (e.g. a dropped `extra.title`) is
     *  still found. */
    listPlanFiles?: () => Promise<string[]>;
}
export interface ResolvedApprovedPlan {
    planFilePath: string;
    planContent: string;
    title: string;
}
/** Locate the plan file the agent wrote and finalize its title — without
 *  renaming anything. Tries, in order: the slug derived from `extra.title`
 *  (`local://<slug>-plan.md`), a state plan that the artifact scan can't see,
 *  scanned plan files newest-to-oldest, then the state plan path as a final
 *  fallback. Throws a `ToolError` guiding the agent when none exist. */
export declare function resolveApprovedPlan(input: ResolveApprovedPlanInput): Promise<ResolvedApprovedPlan>;
