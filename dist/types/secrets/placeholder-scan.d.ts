import type { JsonValue, SecretObfuscator } from "./obfuscator.js";
import { type RegexScanSegment, type ReplaceRegexScan } from "./placeholder.js";
export declare function transformOutsidePlaceholdersTracked(text: string, origin: string, shouldSkipPlaceholder: (placeholder: string) => boolean, transform: (chunk: string) => string, preservePlaceholder?: (placeholder: string) => string): {
    text: string;
    origin: string;
};
export declare function trailingOutsidePreservedPlaceholderChunk(text: string, shouldPreservePlaceholder: (placeholder: string) => boolean): string;
export declare function buildReplaceRegexScan(text: string, ranges: ReadonlyArray<{
    start: number;
    end: number;
}>, deobfuscateMap: ReadonlyMap<string, {
    secret: string;
    recursive: boolean;
}>): ReplaceRegexScan;
export declare function mapReplaceRegexMatch(segments: ReadonlyArray<RegexScanSegment>, scanStart: number, scanEnd: number): {
    start: number;
    end: number;
    recursive: boolean;
    preserveGeneratedPlaceholders: boolean;
    partialPlaceholderCut: boolean;
    cutResumeIndex: number;
    firstPlaceholderScanStart: number;
};
/**
 * Extend a scan-space resume position past a consecutive run of generated
 * placeholder segments starting exactly at it, with no raw gap in between. A
 * cut-resolution resume point that happens to land precisely on the START of
 * ANOTHER placeholder must not stop there and hand it to a fresh `regex.exec`
 * attempt — the same content, scanned as an opaque adjacent placeholder run,
 * must resolve identically whether the run's LEADING member is still raw text
 * (this call is about to placeholder it) or is ALREADY a placeholder from a
 * prior call or an earlier pass of this same call. Without this, a bounded
 * regex whose reach spans two adjacent secrets plus trailing spillover bytes
 * (e.g. `[A-Z]{9}` over `ABCDEFGH` + `SECRETUV` + `A`) resolves the leading
 * secret as its own independent redaction on the FIRST obfuscate() call (a
 * genuinely raw prefix gets its own match, then the discard for the rest
 * resumes right after it), but on a LATER call — once that prefix is itself a
 * placeholder — the very first match attempt starts already inside the
 * placeholder run, cannot be prefix-narrowed at all, and its discard resume
 * point lands mid-run instead of past it, exposing a shorter tail (`SECRETUV`
 * + `A`) to a clean, un-cut match the first call never attempted. Chaining the
 * resume point through every immediately-adjacent placeholder makes both
 * calls land on the exact same next scan position.
 */
export declare function extendPastAdjacentPlaceholders(segments: ReadonlyArray<RegexScanSegment>, index: number): number;
export declare function redactWithFixedReplacementOutsidePlaceholders(text: string, origin: string, replacement: string, shouldPreservePlaceholder: (placeholder: string) => boolean): {
    text: string;
    origin: string;
};
export declare function deobfuscateGeneratedPlaceholderRanges(text: string, start: number, end: number, ranges: ReadonlyArray<{
    start: number;
    end: number;
}>, deobfuscateMap: ReadonlyMap<string, {
    secret: string;
    recursive: boolean;
}>): {
    text: string;
    recursive: boolean;
};
export declare function placeholderInnerText(text: string, start: number, end: number, ranges: ReadonlyArray<{
    start: number;
    end: number;
}>, deobfuscateMap: ReadonlyMap<string, {
    secret: string;
    recursive: boolean;
}>): string;
export declare function textOutsidePlaceholderRanges(text: string, start: number, end: number, ranges: ReadonlyArray<{
    start: number;
    end: number;
}>): string;
export declare function outsidePlaceholderRangesAnyIndependentlyMatch(text: string, scanText: string, segments: ReadonlyArray<RegexScanSegment>, start: number, end: number, ranges: ReadonlyArray<{
    start: number;
    end: number;
}>, regex: RegExp): boolean;
export declare function firstOutsidePlaceholderRange(start: number, end: number, ranges: ReadonlyArray<{
    start: number;
    end: number;
}>): {
    start: number;
    end: number;
} | undefined;
export declare function countOutsidePlaceholderRanges(start: number, end: number, ranges: ReadonlyArray<{
    start: number;
    end: number;
}>): number;
export declare function replaceRange(text: string, start: number, end: number, replacement: string): string;
/** Deep-walk an object, transforming all string values. */
export declare function deepWalkStrings<T>(obj: T, transform: (s: string) => string): T;
export declare function collectJsonRegexSecretValues(obfuscator: SecretObfuscator, value: JsonValue): Set<string>;
/**
 * Map every string in arbitrary JSON. Used ONLY for tool-call arguments, whose
 * shape is model-authored and not known ahead of time. No other caller may walk
 * untyped data: every message/content path is handled by a typed transformer.
 */
export declare function mapJsonStrings(value: JsonValue, fn: (s: string) => string): JsonValue;
