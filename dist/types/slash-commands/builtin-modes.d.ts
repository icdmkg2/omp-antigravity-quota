import type { InteractiveModeContext } from "../modes/types.js";
import type { SlashCommandSpec } from "./types.js";
export declare function refreshStatusLine(ctx: InteractiveModeContext): void;
export declare function formatTokenCount(value: number): string;
export declare const BUILTIN_MODE_SLASH_COMMANDS: ReadonlyArray<SlashCommandSpec>;
