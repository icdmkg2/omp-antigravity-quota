export declare const REPLACEMENT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/** Generate a deterministic same-length replacement string from a secret value. */
export declare function generateDeterministicReplacement(secret: string): string;
/**
 * Force a length-preserving deterministic replacement to differ from the secret
 * it stands in for. `generateDeterministicReplacement` seeds its first 1–2 chars
 * with the `Z`/`ZZ` sentinel, so a whole configured value that is exactly `Z` or
 * `ZZ` (or an astronomically unlikely longer hash collision) would otherwise be
 * emitted unchanged and ship the raw secret to the provider. Flip the first char
 * to a fixed different glyph: same length, still deterministic, guaranteed != the
 * secret. Only safe for a whole CONFIGURED value (a plain secret matches its own
 * literal, so the perturbed output is no longer matched and stays a fixed point);
 * per-chunk remainders must keep the sentinel to remain idempotent across restart.
 */
export declare function ensureDistinctReplacement(replacement: string, secret: string): string;
export interface RegexMatchContext {
    /** Full text the match was found in (positions are offsets into it). */
    text: string;
    /** Start/end of the matched span being replaced. */
    start: number;
    end: number;
}
/**
 * Whether `candidate`, substituted for the matched span in its surrounding text,
 * is re-matched by `regex` at its own position. A replace-mode regex that depends
 * on context (lookbehind/lookahead/`\b`) can match a candidate that does NOT match
 * in isolation: e.g. `(?<=api=)[AZ]` never matches a bare `A`, but `api=A` does, so
 * a candidate `A` chosen by an isolation test is re-redacted on the next obfuscate()
 * pass and can oscillate back to the raw matched value. The probe substitutes the
 * candidate into the FULL text — not a truncated window — so a wide lookbehind or
 * lookahead (e.g. `(?<=A{600})`) still evaluates against the context that makes it
 * match. Truncating that context dropped the assertion's reach and falsely
 * accepted an oscillating, leaky candidate. The scan starts a bounded distance
 * left of the span and stops once a match begins at/after the span's end (matches
 * arrive in order), keeping per-candidate cost independent of total text length.
 */
export declare function regexRematchesInContext(candidate: string, regex: RegExp, ctx: RegexMatchContext): boolean;
/**
 * Search same-length replacements for one the regex does NOT match, so a default
 * regex secret whose deterministic replacement collides with its own value (the
 * `Z`/`ZZ` sentinel, or an astronomical hash collision) is still redacted to a
 * STABLE nonmatching value instead of shipping the raw secret. A nonmatching
 * candidate is a fixed point under re-obfuscation — the regex never re-matches it,
 * so it cannot re-leak on a later pass. The search stays bounded to O(length *
 * alphabet) regardless of value length: first exhaust every single-position
 * substitution against a deterministic baseline (`AAAA…`, then `!AAA…`, `A!AA…`,
 * …) so any regex that only needs one out-of-class byte — regardless of position —
 * is found in a handful of probes rather than enumerating every combination (which
 * for a 3-byte match-everything config, e.g. `[\s\S]{3}`, would otherwise run
 * 90**3 = 729000 candidates through the regex on every single match, stalling
 * provider requests). Candidates are enumerated deterministically over a stable
 * ASCII alphabet: alphanumerics first (usually enough), then punctuation fallback
 * bytes when the regex covers every alphanumeric candidate. When the regex still
 * matches around a lone perturbed byte (for example `[A-Za-z0-9].*` matching the
 * unperturbed tail), full-width same-byte candidates (`!!!!!`, `_____`, …) are
 * tried next. When the regex covers every non-whitespace candidate (e.g. `\S{n}`),
 * whitespace markers (a full space/tab run, then a single whitespace byte among
 * non-whitespace filler) are tried as a last resort. A genuine match-everything
 * regex (`.`/`[\s\S]`, which also matches space and tab) still exhausts this bounded
 * sweep and returns undefined, letting the caller keep its own fixed-point fallback
 * — bounded search can in principle miss an escape that depends jointly on
 * multiple positions in a way no single-position swap reaches, but no realistic
 * secret-redaction regex (character classes, literal matches, anchored/bounded
 * repeats) has that shape.
 */
export declare function findNonMatchingReplacement(value: string, regex: RegExp, context: RegexMatchContext): string | undefined;
/**
 * Whether a default (no custom `replacement`) replace-mode regex can never
 * safely redact a 1-2 char match: `findNonMatchingReplacement`'s bounded
 * search — the same search `#generateRegexReplacement` runs at match time —
 * finds no candidate the regex fails to re-match. This holds independent of
 * any actual per-install key: the search already exhausts every character in
 * `REPLACEMENT_CHARS` (the alphabet `buildKeyedReplacementRun` draws its
 * fallback marker from) plus punctuation and whitespace, so if none of those
 * escape the regex, no key-derived marker drawn from the same alphabet can
 * either — the marker is guaranteed to re-match too, making every such match
 * unresolvable: the fallback could only ever emit the raw matched text
 * unchanged. Probed with a value (`"\0".repeat(length)`) the bounded search
 * never treats as a real candidate, so the result depends only on the
 * regex's own matching behavior, not on this specific probe.
 */
export declare function regexHasUnresolvableShortMatchFallback(regex: RegExp): boolean;
