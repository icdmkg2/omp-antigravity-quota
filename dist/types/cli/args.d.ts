import type { ServiceTierOpenAISettingValue } from "../config/service-tier.js";
import { type ConfiguredThinkingLevel } from "../thinking.js";
import { getExtraHelpText } from "./help-extra.js";
export { getExtraHelpText };
export type Mode = "text" | "json" | "rpc" | "acp" | "rpc-ui";
export interface Args {
    cwd?: string;
    /** Workspace directories beyond cwd for this session (repeatable `--add-dir`). */
    addDir?: string[];
    profile?: string;
    alias?: string;
    allowHome?: boolean;
    provider?: string;
    model?: string;
    config?: string[];
    smol?: string;
    slow?: string;
    plan?: string;
    prewalk?: boolean;
    noPrewalk?: boolean;
    prewalkInto?: string;
    planYolo?: boolean;
    planYoloInto?: string;
    maxTime?: number;
    apiKey?: string;
    systemPrompt?: string;
    appendSystemPrompt?: string;
    thinking?: ConfiguredThinkingLevel;
    serviceTier?: ServiceTierOpenAISettingValue;
    hideThinking?: boolean;
    advisor?: boolean;
    externalThinking?: boolean;
    continue?: boolean;
    resume?: string | true;
    fromClaude?: boolean;
    fromCodex?: boolean;
    help?: boolean;
    version?: boolean;
    mode?: Mode;
    noSession?: boolean;
    sessionDir?: string;
    providerSessionId?: string;
    providerPromptCacheKey?: string;
    fork?: string;
    /** Collab link to join at startup (set by the `join` subcommand; no CLI flag). */
    join?: string;
    models?: string[];
    tools?: string[];
    noTools?: boolean;
    noLsp?: boolean;
    noPty?: boolean;
    hooks?: string[];
    extensions?: string[];
    trustedExtensions?: string[];
    noExtensions?: boolean;
    pluginDirs?: string[];
    print?: boolean;
    printThoughts?: boolean;
    export?: string;
    noSkills?: boolean;
    skills?: string[];
    noRules?: boolean;
    noTitle?: boolean;
    autoApprove?: boolean;
    approvalMode?: "always-ask" | "write" | "yolo";
    messages: string[];
    fileArgs: string[];
    /** Extension-registered flags this parse recognized — name to value. */
    unknownFlags: Map<string, boolean | string>;
    /**
     * `--`/`-` prefixed tokens this parse could not match against any built-in
     * or {@link extensionFlags} entry. The startup parse runs *before*
     * extensions load, so it always lists every extension-registered flag here;
     * the post-extension reparse in {@link applyExtensionFlags} clears those
     * once the real flag set is known. Anything still present after that
     * reparse is a genuine typo or stale flag and {@link reportUnrecognizedFlags}
     * surfaces it as a hard error so the agent does not silently start a
     * session with the misparsed positionals as a prompt (issue #2459).
     */
    unrecognizedFlags: string[];
}
export declare function parseArgs(inputArgs: string[], extensionFlags?: Map<string, {
    type: "boolean" | "string";
}>): Args;
/** Reject requested tool names absent from the fully discovered session registry. */
export declare function validateToolNames(requested: readonly string[] | undefined, known: readonly string[]): void;
/**
 * Emit a stderr error listing the unrecognized flags and return `true` when
 * there were any. Caller is expected to exit with a non-zero status. Splitting
 * the print from the exit keeps the helper unit-testable without forking a
 * process (issue #2459).
 */
export declare function reportUnrecognizedFlags(args: Pick<Args, "unrecognizedFlags">, write?: (text: string) => void): boolean;
/** Emit a clean CLI usage error without an internal stack trace. */
export declare function reportCliUsageError(error: unknown, write?: (text: string) => void): boolean;
export declare function printHelp(): void;
