import { type MermaidAsciiRenderOptions } from "@oh-my-pi/pi-utils";
/**
 * Options controlling how fenced Mermaid source is resolved to terminal ASCII.
 * Extends the raw render options (theme, color mode, spacing, `useAscii`) with a
 * viewport-fitting hint.
 */
export interface MermaidResolveOptions extends MermaidAsciiRenderOptions {
    /**
     * Maximum display width (terminal columns) the diagram should occupy. A
     * layout that overflows this width is re-rendered in the perpendicular
     * orientation — a wide horizontal chain collapses to a tall vertical column
     * (which the terminal can scroll), and a wide vertical fan-out collapses to a
     * tall horizontal column. Omit to keep the source's own layout regardless of
     * width.
     */
    maxWidth?: number;
}
/**
 * Resolve mermaid ASCII from fenced block source text.
 * Returns null when rendering fails, while memoizing failures to avoid repeated work.
 */
export declare function resolveMermaidAscii(source: string, options?: MermaidResolveOptions): string | null;
/**
 * Clear the mermaid cache.
 */
export declare function clearMermaidCache(): void;
