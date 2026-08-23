/** Portable command that rejects credential prompts without assuming an FHS layout. */
export declare const REJECT_PROMPT_COMMAND: string;
export declare const NON_INTERACTIVE_ENV: Readonly<Record<string, string>>;
/** Builds the per-command environment for non-interactive child processes. */
export declare function buildNonInteractiveEnv(overrides?: Record<string, string>, baseEnv?: Record<string, string | undefined>, platform?: NodeJS.Platform): Record<string, string>;
