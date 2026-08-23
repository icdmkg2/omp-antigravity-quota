/**
 * Standalone TUI model picker used by `omp setup speech`.
 *
 * Mirrors {@link ./session-picker.ts} for the standalone-TUI lifecycle: spin up
 * a one-shot {@link TUI} over a {@link SelectList}, resolve on select/cancel, and
 * tear the UI down. The standalone TUI auto-renders on input, so no manual
 * render wiring is needed beyond `addChild`/`setFocus`/`start`.
 */
import { type SelectItem } from "@oh-my-pi/pi-tui";
/**
 * Show a single-column model picker and resolve with the chosen item's value,
 * or `null` if the user cancelled. `currentValue` pre-selects the matching row.
 */
export declare function selectSetupModel(title: string, items: SelectItem[], currentValue: string): Promise<string | null>;
