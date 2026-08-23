import type { SecretEntry } from "./obfuscator.js";
export declare const MIN_OBFUSCATE_SECRET_LEN = 8;
export declare function defaultPlaceholderKey(): string;
type PlaceholderCaseHint = "U" | "L" | "C" | "M";
/** Normalize a friendly name into the model-visible placeholder prefix. */
export declare function sanitizeSecretFriendlyName(name: string): string | undefined;
/**
 * Normalize a secret value into the same alnum-only, uppercased shape a
 * friendly-name label or placeholder prefix is sanitized into, so comparing a
 * raw (possibly lowercase/punctuated) secret value against already-sanitized,
 * model-visible text does not miss a case- or separator-only variant. Unlike
 * `sanitizeSecretFriendlyName` this never truncates and never signals "empty"
 * via `undefined` — callers already guard on `.length > 0` before comparing.
 */
export declare function sanitizeForCollisionCheck(value: string): string;
export declare function sanitizedLabelCollidesWithSecret(sanitizedLabel: string, sanitizedSecret: string): boolean;
/**
 * Whether an entry needs the persisted placeholder key: either because it can
 * produce a reversible (keyed) obfuscate-mode placeholder, or because a default
 * (no custom `replacement`) replace-mode regex can reach
 * `#generateRegexReplacement`'s key-derived idempotent fallback marker (see
 * `#generateReplacement`) when every same-length candidate re-matches a
 * pathological match-everything config (e.g. `[\s\S]{8}`). That fallback depends
 * on the persisted per-install key — not just length — to stay a fixed point
 * across a process restart; without a persisted key, a fresh install falls back
 * to a process-random key (`defaultPlaceholderKey()`), so the fallback marker
 * would churn across restarts even though the algorithm itself is stable. A
 * regex WITH a custom `replacement` never reaches that fallback (it always emits
 * the literal configured string), and a plain replace secret's replacement is
 * pure content-hash (`#generateSecretReplacement`), so neither needs the key.
 * Short plain obfuscate entries are toned down (never placeheld), so they must
 * NOT force key creation: otherwise a `secret-placeholder.key` file is written
 * and persisted for a config that ends up with no active secrets, leaving the
 * key readable via a tool and reusable for later placeholders.
 */
export declare function secretEntryNeedsPlaceholderKey(entry: SecretEntry): boolean;
/**
 * Whether a SET of entries needs the persisted placeholder key. `obfuscate()`
 * applies plain replace-mode mappings before the plain-obfuscate pass, so a plain
 * obfuscate entry only emits a reversible (keyed) placeholder when its content can
 * still appear AFTER the replace phase. When no obfuscate entry can ever produce a
 * placeholder, the persisted key must NOT be required/created — otherwise an
 * effectively replace-only secret set still writes `secret-placeholder.key` and
 * fails startup when the agent config dir is unwritable.
 *
 * The decision models the replace phase as the obfuscator actually runs it:
 * replace mappings are content-keyed (later duplicate wins) and applied in
 * descending content-length order; for a fresh probe (no prior placeholders) that
 * phase is plain sequential substring replacement. A plain obfuscate entry needs
 * the key when its content survives that simulated phase (direct typing) OR when
 * any effective replacement can form the content via tiling — a substring,
 * wholesale superstring, or prefix/suffix border that joins with surrounding
 * passthrough bytes (see `replacementCanFormContent`). This covers direct
 * shadowing (`SECRET -> safe`), reintroduction, duplicate ordering, transitive
 * chains, and context-joined fragments uniformly. Default (omitted) replacements
 * are deterministic, length-preserving, and distinct, so a same-content shadow
 * with no other interacting replacement stays key-free.
 * Replacement outputs are themselves rewritten by every later (shorter-content)
 * replacement before the plain-obfuscate pass sees them, so a fragment that a
 * subsequent replacement erases (`AA -> SEC` then `S -> X` turns every `SEC` into
 * `XEC`) no longer forces the key. Surrounding bytes stay modeled as arbitrary
 * passthrough, so testing the surviving fragment only drops false positives and
 * never under-approximates a real key need.
 */
export declare function secretEntriesNeedPlaceholderKey(entries: SecretEntry[]): boolean;
export declare function buildHashBase(key: string, value: string): string;
export declare function buildKeyedReplacementRun(key: string, length: number): string;
export declare function inferCaseHint(secret: string): PlaceholderCaseHint | undefined;
export declare function buildPlaceholder(hint: PlaceholderCaseHint | undefined, base: string, friendlyName?: string): string;
/** Regex matching `$$HASH$$`, `$$HASH:U$$`, and `$$FRIENDLY_HASH(:hint)$$` placeholders. */
export declare const PLACEHOLDER_RE: RegExp;
export declare function resumePlaceholderScanAfterRejectedCandidate(match: RegExpExecArray): void;
export declare function placeholderWithoutFriendlyName(placeholder: string): string | undefined;
export declare function lookupFriendlyPlaceholderAlias(deobfuscateMap: ReadonlyMap<string, {
    secret: string;
    recursive: boolean;
}>, placeholder: string): {
    secret: string;
    recursive: boolean;
} | undefined;
export declare function stripPendingSecretPlaceholderSuffix(text: string): string;
export interface RegexScanSegment {
    scanStart: number;
    scanEnd: number;
    textStart: number;
    textEnd: number;
    generatedPlaceholder: boolean;
    recursive: boolean;
}
export interface ReplaceRegexScan {
    text: string;
    segments: RegexScanSegment[];
}
export {};
