/**
 * Structured web-search query parsing.
 *
 * Agents habitually embed Google-style directives in search queries —
 * `site:`, `before:`/`after:`, `inurl:`, `filetype:`, quoted phrases, `OR`
 * groups, `-exclusions` — regardless of whether the backing engine parses
 * them. This module turns a raw query into a {@link StructuredQuery} so each
 * provider can:
 *
 * 1. map constraints onto native API parameters where they exist (Perplexity
 *    `search_domain_filter`, Tavily `include_domains`, Exa date bounds, …),
 * 2. rebuild a query string containing only the syntax the target engine
 *    understands ({@link formatQuery}), and
 * 3. post-filter returned sources leniently ({@link applyQueryConstraints}):
 *    a constraint dimension that would eliminate every result is dropped and
 *    reported rather than returning nothing.
 */
import type { SearchSource } from "./types.js";
/** One free-text token of the query (everything that is not a recognized directive). */
export interface QueryTerm {
    /** Term text without quotes or operator prefixes. */
    text: string;
    /** Quoted exact phrase (`"like this"`) or verbatim-required (`+term`). */
    phrase?: boolean;
    /** Excluded via `-term` or `NOT term`. */
    negated?: boolean;
    /**
     * OR-group id. Terms sharing an id are alternatives (`a OR b`); terms
     * without a group are implicitly AND-ed. Groups are always contiguous
     * runs in {@link StructuredQuery.terms}.
     */
    group?: number;
}
/**
 * A raw query decomposed into free text plus every recognized constraint.
 *
 * All list fields are always present (possibly empty) so consumers can map
 * over them without null checks. Values are stored as typed by the user
 * except for normalization noted per field.
 */
export interface StructuredQuery {
    /** Original query string, verbatim. */
    raw: string;
    /**
     * Free-text remainder with all recognized directives removed; phrases
     * stay quoted, exclusions keep `-`, OR groups keep `OR`. Empty when the
     * query was directives only — use {@link formatQuery} for a never-empty
     * engine query.
     */
    text: string;
    /** Ordered free-text terms (phrases, exclusions, OR groups). */
    terms: QueryTerm[];
    /** `site:`/`domain:`/`host:` includes — any-of. Lowercased, scheme stripped, may carry a path (`github.com/anthropics`). */
    sites: string[];
    /** `-site:` exclusions, same normalization as {@link sites}. */
    excludedSites: string[];
    /** `inurl:`/`url:`/`allinurl:` substrings — all must appear in the URL. */
    inUrl: string[];
    /** `-inurl:` substrings — none may appear in the URL. */
    excludedInUrl: string[];
    /** `intitle:`/`title:`/`allintitle:` substrings — all must appear in the title. */
    inTitle: string[];
    /** `-intitle:` substrings — none may appear in the title. */
    excludedInTitle: string[];
    /** `intext:`/`inbody:`/`inanchor:`/`allintext:` body substrings. Not post-filterable (snippets are partial); query-building only. */
    inText: string[];
    /** `-intext:` body exclusions. Query-building only. */
    excludedInText: string[];
    /** `filetype:`/`ext:` extensions — any-of. Lowercased, no leading dot. */
    filetypes: string[];
    /** `-filetype:`/`-ext:` extensions — none may match. */
    excludedFiletypes: string[];
    /** Inclusive lower publish-date bound from `after:`/`since:`, ISO `YYYY-MM-DD`. */
    after?: string;
    /** Exclusive upper publish-date bound from `before:`/`until:`, ISO `YYYY-MM-DD`. */
    before?: string;
    /** Language code from `lang:`/`language:`, lowercased (e.g. `en`, `en-us`). */
    lang?: string;
    /** True when any directive or boolean operator was recognized. */
    hasDirectives: boolean;
    /** True when any post-filterable constraint is set (sites, url/title terms, filetypes, date bounds). */
    hasConstraints: boolean;
}
/**
 * Query-syntax capabilities of a target engine, used by {@link formatQuery}
 * to decide which parsed features are re-emitted as query text. Everything
 * defaults to `false`: the zero-value produces plain keywords suitable for
 * natural-language APIs.
 */
export interface QuerySyntax {
    /** Emit `"quoted phrases"`. */
    phrases?: boolean;
    /** Emit `-term` exclusions (negated terms are dropped otherwise). */
    negation?: boolean;
    /** Emit `OR` between alternatives (groups are flattened to keywords otherwise). */
    or?: boolean;
    /** Emit `site:`/`-site:`. */
    site?: boolean;
    /** Emit `inurl:`/`-inurl:`. */
    inUrl?: boolean;
    /** Emit `intitle:`/`-intitle:`. */
    inTitle?: boolean;
    /** Emit `intext:`/`-intext:`. */
    inText?: boolean;
    /** Emit `filetype:`/`-filetype:`. */
    filetype?: boolean;
    /** Emit `before:`/`after:` ISO date bounds. */
    dateRange?: boolean;
}
/** Full Google-style syntax: engines that parse the classic operator set (Google, Startpage, Ecosia, Brave, Kagi, Mojeek, SearXNG…). */
export declare const GOOGLE_QUERY_SYNTAX: QuerySyntax;
/** Result of {@link applyQueryConstraints}. */
export interface ConstraintFilterResult {
    /** Sources surviving the lenient filter — never empty when the input was non-empty. */
    sources: SearchSource[];
    /**
     * Directive renderings (`site:arxiv.org`, `before:2024-01-01`, …) of the
     * constraint dimensions that matched zero sources and were therefore
     * relaxed instead of enforced.
     */
    dropped: string[];
}
/**
 * Parse a `before:`/`after:` value into ISO `YYYY-MM-DD`.
 * Accepts `YYYY`, `YYYY-MM`, `YYYY-MM-DD` (also `/` and `.` separators) and
 * `MM/DD/YYYY` (day-first assumed when the first field exceeds 12).
 * Bare years/months resolve to the first day of the period, matching
 * Google's `after:2024` ≙ `after:2024-01-01` semantics.
 */
export declare function parseDateValue(value: string): string | undefined;
/**
 * Parse a raw query into a {@link StructuredQuery}.
 *
 * Lenient by construction: unknown `name:value` tokens (URLs, `C:\paths`,
 * `TS2345:`, jargon) stay in the free text verbatim, and a directive with an
 * unparseable value (`before:someday`) degrades to a plain term instead of
 * being dropped.
 */
export declare function parseSearchQuery(raw: string): StructuredQuery;
/**
 * Rebuild a query string for an engine with the given {@link QuerySyntax}.
 *
 * Constraints whose syntax the engine lacks are omitted (the caller maps
 * them onto API parameters or relies on {@link applyQueryConstraints}).
 * Never returns an empty string for a non-empty input: a directives-only
 * query falls back to the constraint values as keywords, then to `raw` — an
 * engine searching *something* beats an empty-query error.
 */
export declare function formatQuery(q: StructuredQuery, syntax?: QuerySyntax): string;
/**
 * Build the engine query for a credential-free HTML engine (Google,
 * Startpage, DuckDuckGo, Ecosia, Mojeek, SearXNG, and the Public Web
 * fan-out over them).
 *
 * Canonicalizes directives via {@link formatQuery} with the engine's
 * {@link QuerySyntax} (default: full Google syntax), after demoting the
 * operators that zero-match across the scraper set: engines only match
 * `site:` against a bare domain (a path yields zero results everywhere),
 * and DuckDuckGo ignores `inurl:` entirely — so either operator silently
 * empties the result set. The raw URL as a plain term matches fine, so
 * bare-domain `site:` filters are kept while path-carrying `site:` and all
 * `inurl:` values become plain keywords; the demotion is structural (before
 * formatting), so OR-grouped and quoted directives are covered. Negated
 * forms (`-site:`, `-inurl:`) pass through untouched — demoting them would
 * invert an exclusion into a search term; the pipeline post-filter
 * ({@link applyQueryConstraints}) enforces every demoted or unsupported
 * constraint on the returned sources. Directive-free queries pass through
 * byte-identical.
 */
export declare function formatScraperQuery(query: string, parsedQuery?: StructuredQuery, syntax?: QuerySyntax): string;
/**
 * `site:` matcher: exact host or subdomain of `site`; when `site` carries a
 * path (`github.com/anthropics`), the URL path must start with it.
 */
export declare function matchesSite(url: string, site: string): boolean;
/**
 * Strict per-source constraint check: every filterable dimension of `q` must
 * pass. Sources without a resolvable date pass date bounds (a missing date
 * is not proof of violation). For custom provider flows; the standard path
 * is {@link applyQueryConstraints}.
 */
export declare function matchesQueryConstraints(source: SearchSource, q: StructuredQuery): boolean;
/**
 * Lenient post-filter: applies each constraint dimension of `q` in turn,
 * skipping (and reporting) any dimension that would eliminate every
 * remaining source. Guarantees a non-empty result for a non-empty input, so
 * a mis-scoped directive degrades to unfiltered results plus a note instead
 * of a dead search.
 */
export declare function applyQueryConstraints(sources: readonly SearchSource[], q: StructuredQuery): ConstraintFilterResult;
