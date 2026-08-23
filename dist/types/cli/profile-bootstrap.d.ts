/**
 * Bootstrap-time argv preparser for the global `--profile` / `--alias` flags.
 *
 * Profile selection MUST happen before any module reads `getAgentDir()` (notably
 * `@oh-my-pi/pi-utils/env`, which eagerly loads `.env` from the agent directory
 * during its own import). The full `parseArgs` from `./args.ts` lives downstream
 * of those imports, so we can't rely on it for profile bootstrap — we have to
 * crack open argv before the lazy command modules load.
 *
 * Because of that, this preparser must respect the same value-consumption
 * contract as `args.ts`: known string-valued flags usually consume the next
 * token even when it starts with `-`, except for string flags that can be
 * shadowed by preloaded boolean extensions (currently `--plan`). Optional-value
 * flags (`--resume`, `--session`, `-r`) consume the next token only when it
 * doesn't look like another flag. Without this, `omp --system-prompt --profile
 * foo` silently activates profile `foo`
 * instead of passing the literal `--profile` to the system prompt and `foo`
 * as a positional message.
 *
 * The shared classification lives in {@link ./flag-tables}, imported below,
 * so the bootstrap and `args.ts` reference one source of truth instead of
 * maintaining parallel constants.
 *
 * An unclassified bare long option (one not in any flag table) is treated as a
 * possible extension string flag, but the bootstrap mirrors `parseArgs`'
 * extension-flag rules ({@link ./args}): a string extension flag consumes its
 * successor ONLY when that successor is value-like (does not start with `-`), and
 * a boolean extension flag consumes nothing. So the successor is forwarded
 * untouched (and never read as a global `--profile`/`--alias`) only when it is
 * value-like; a flag-looking successor is left for normal processing, so
 * `omp --some-ext-flag --profile work` still selects a profile. Known value-less
 * launch flags ({@link VALUELESS_FLAGS}) are exempt so a trailing profile after
 * them also activates (`omp --print --profile work`).
 */
export interface ProfileBootstrapResult {
    argv: string[];
    profile?: string;
    aliasName?: string;
}
/**
 * Strip `--profile` / `--alias` from argv while preserving the surrounding
 * argument structure, returning the residual argv to hand to the launch parser
 * and the captured flag values.
 *
 * Global flag extraction stops only when the first residual argv token names a
 * registered command that owns its own flags (e.g. `grep`): everything from
 * that token onward is forwarded verbatim so a subcommand's own flags and
 * positionals are never stolen (`omp grep --profile <path>` greps for
 * `--profile`; it does not select a profile). `launch` and `acp` are explicit
 * spellings of launch-shaped commands, so `omp launch --profile work` and
 * `omp acp --profile work` still select profile `work`.
 *
 * Throws when either flag is supplied without a value.
 */
export declare function extractProfileFlags(argv: readonly string[]): ProfileBootstrapResult;
