import TurndownService from "@oh-my-pi/pi-utils/turndown";
/**
 * Build a Turndown instance configured for GFM with the fixes omp relies on:
 * `~~strikethrough~~`, unescaped heading periods, and single-space list markers.
 *
 * Shared by the web scrapers (HTML → markdown) and the markit document engine
 * (`src/markit`). The rule set must stay identical across both call sites.
 */
export declare function createTurndown(): TurndownService;
/**
 * Normalize HTML tables so turndown-plugin-gfm can render them:
 * - strip `<p>` tags inside `<td>`/`<th>` cells (joining paragraphs with a space)
 * - wrap the first row in `<thead>` when missing
 */
export declare function normalizeTablesHtml(html: string): string;
