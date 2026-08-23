/**
 * Single source of truth for argv flag classification, shared by:
 *   - `parseArgs` in `./args.ts` (the launch-time CLI parser)
 *   - `extractProfileFlags` in `./profile-bootstrap.ts` (the early
 *     `--profile` / `--alias` pre-parser)
 *
 * `parseArgs` dispatches string-valued flags by looking up their setter in
 * {@link STRING_SETTERS}. Optional-value flags use {@link OPTIONAL_FLAGS} so
 * per-flag quirks (currently empty-string rejection for `--resume`) live here
 * instead of being hard-coded in the dispatch loop.
 *
 * The bootstrap doesn't dispatch — it only needs to know which flags consume
 * a value — so it consults {@link STRING_VALUE_FLAGS} and
 * {@link OPTIONAL_VALUE_FLAGS}, both derived from `Object.keys(...)` on the
 * setter/config records below.
 *
 * The deliberate consequence: a string-valued flag exists in this CLI surface
 * iff it has an entry here. Adding a new string-valued flag means adding a
 * setter/config entry in this file; both `args.ts` and the bootstrap pick it
 * up automatically, so the two cannot drift out of sync.
 *
 * IMPORT RULE: this module MUST NOT import any runtime value from
 * `@oh-my-pi/pi-utils` (or anything that transitively does). That package's
 * `env.ts` eagerly loads `.env` files from `getAgentDir()` during module
 * initialization, which would race the profile bootstrap. Type-only imports
 * are erased at runtime and are therefore safe.
 *
 * If a setter needs runtime dependencies (logging, validators, lookup
 * tables), they're passed in through {@link ParseDeps} and `args.ts` wires the
 * real implementations at the dispatch site.
 */
import type { ConfiguredThinkingLevel } from "../thinking.js";
import type { Args } from "./args.js";
/**
 * Runtime dependencies injected into setters that need to validate input or
 * warn about bad values. `args.ts` constructs one object at module load and
 * passes it to each {@link STRING_SETTERS} call.
 *
 * Keeping these out of the setter closures means this module stays free of
 * runtime imports from `@oh-my-pi/pi-utils`, which is the whole reason it can
 * be safely imported by `profile-bootstrap.ts` before `setProfile` runs.
 */
export interface ParseDeps {
    logger: {
        warn: (message: string, meta?: Record<string, unknown>) => void;
    };
    parseThinking: (value: string | null | undefined) => ConfiguredThinkingLevel | undefined;
    normalizeToolNames: (values: Iterable<string>) => string[];
    thinkingEfforts: readonly string[];
}
export type StringSetter = (result: Args, value: string, deps: ParseDeps) => void;
/**
 * Setter for a flag that may or may not consume the next argv token.
 * Receives `undefined` for the bare form (`--resume` with no value, etc.).
 */
export type OptionalSetter = (result: Args, value: string | undefined) => void;
/**
 * Per-flag optional-value consumption policy.
 *
 * Every optional flag always rejects tokens that start with `-` — that shared
 * rule lives in the dispatch site. These booleans capture the *additional*
 * per-flag quirks:
 *
 * - `rejectEmpty`: treat `""` like “no value provided”. Needed for
 *   `--resume` / `-r` / `--session`. Without it, an empty string
 *   gets consumed as the session prefix and downstream resolution can match
 *   every session.
 */
export interface OptionalFlagConfig {
    set: OptionalSetter;
    rejectEmpty?: boolean;
}
/**
 * Setters for flags with string values. Most built-ins consume the next argv
 * token even when it starts with `-`; flags listed in
 * {@link EXTENSION_SHADOWABLE_STRING_FLAGS} use extension-style consumption so
 * a registered boolean extension can shadow them before profile bootstrap.
 */
export declare const STRING_SETTERS: Record<string, StringSetter>;
/**
 * Optional-value flags. Setters receive `undefined` for the bare form.
 *
 * The dispatch in `args.ts` applies the shared "doesn't start with `-`"
 * check for every flag, then consults the per-flag booleans below for the
 * remaining quirks.
 */
export declare const OPTIONAL_FLAGS: Record<string, OptionalFlagConfig>;
/**
 * Derived from {@link STRING_SETTERS}. A flag is in this set if and only if
 * it has a setter — by construction, drift between "the bootstrap thinks
 * this flag accepts a value" and "the launch parser can set one" is
 * structurally impossible.
 */
export declare const STRING_VALUE_FLAGS: ReadonlySet<string>;
/**
 * Built-in string flags known to be shadowed by bundled/common boolean
 * extensions before extension metadata is available. They still accept a
 * value-like successor for the built-in form (`--plan opus`), but a
 * flag-looking successor remains a fresh flag (`--plan --profile work`).
 */
export declare const EXTENSION_SHADOWABLE_STRING_FLAGS: ReadonlySet<string>;
/**
 * Derived from {@link OPTIONAL_FLAGS}. Same single-source contract as
 * {@link STRING_VALUE_FLAGS}.
 */
export declare const OPTIONAL_VALUE_FLAGS: ReadonlySet<string>;
/**
 * Internal marker inserted by the profile bootstrap when removing `--profile`
 * or `--alias` would otherwise make the following value-like token become the
 * value of a preceding optional/extension flag. `parseArgs` ignores it, but its
 * flag-looking shape preserves argv boundaries during the second parse.
 */
export declare const PROFILE_BOOTSTRAP_BOUNDARY_ARG = "--omp-profile-boundary";
/**
 * Long-form launch flags that take NO value (booleans). The bootstrap pre-parser
 * needs this to tell a known value-less flag (whose successor is a fresh
 * argument — `omp --print --profile work` still selects a profile) apart from an
 * UNKNOWN long option that might be an extension string flag consuming the next
 * token as its value (so the bootstrap must not steal that token as a global
 * `--profile`/`--alias`). MUST mirror the value-less flag arms of `parseArgs`
 * in `./args.ts`: adding a new boolean launch flag there means adding it here,
 * or `--<newflag> --profile X` stops selecting a profile. Short aliases
 * (`-h`/`-v`/`-c`/`-p`) are intentionally omitted — the protection rule only
 * fires for `--`-prefixed tokens.
 */
export declare const VALUELESS_FLAGS: ReadonlySet<string>;
/**
 * Whether a bare long option (`--xxx`, no `=`) is unclassified — not a known
 * string-, optional-, or value-less flag. The bootstrap and subcommand
 * resolver treat these as possible extension string flags that may consume a
 * value-like successor (the extension flag table is not yet loaded). Shared so
 * both call sites classify identically.
 */
export declare function isUnknownLongValueCandidate(arg: string): boolean;
/**
 * Whether a leading option `flag` consumes the following argv token `next` as
 * its value, applying the same contract as `extractProfileFlags` / `parseArgs`.
 * Single source of truth so subcommand detection ({@link resolveCliArgv}) skips
 * a flag's value instead of mistaking it for the subcommand — `omp --model acp`
 * means model `acp`, not the `acp` subcommand, exactly as the launch parser
 * reads it.
 */
export declare function flagConsumesValue(flag: string, next: string | undefined): boolean;
