import type { SpecialHandler } from "./types.js";
/**
 * Handle cheat.sh / cht.sh URLs for command cheatsheets
 *
 * API: Plain text at https://cheat.sh/{topic}?T (T flag removes ANSI colors)
 * Supports: commands, language/topic queries (e.g., python/list, go/slice)
 */
export declare const handleCheatSh: SpecialHandler;
