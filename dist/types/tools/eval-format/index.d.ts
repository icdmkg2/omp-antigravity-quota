import type { EvalLanguage } from "../../eval/types.js";
export * from "./javascript.js";
export * from "./julia.js";
export * from "./python.js";
export * from "./ruby.js";
/** Formats an arbitrary eval-code prefix for display without changing the executed source. */
export declare function formatEvalCodeForDisplay(source: string, language: EvalLanguage): string;
