/**
 * Shared box-drawing chrome for overlays — string helpers for fullscreen
 * surfaces (the `/copy` picker, the plan-review overlay, …) and the
 * {@link OverlayPanel} container for inline overlays hosted in the editor slot
 * or an anchored container. Everything paints with `theme.boxRound` glyphs
 * (rounded corners, sharp tee/cross junctions) and the `border`/`accent` theme
 * colors so all outlined overlays read identically.
 */
import { type Component } from "@oh-my-pi/pi-tui";
/** Pad or truncate a (possibly ANSI-styled) string to exactly `width` columns. */
export declare function fit(text: string, width: number): string;
/** Top border with an optional accent-colored title inset into the rule. */
export declare function topBorder(width: number, title: string): string;
/** A horizontal rule with left/right tees, splitting overlay sections. */
export declare function divider(width: number): string;
export declare function bottomBorder(width: number): string;
/** Wrap pre-styled content in vertical borders with single-column insets. */
export declare function row(content: string, width: number): string;
/** Body content width for a two-column overlay of total `width`. */
export declare function splitBodyWidth(width: number, sidebarWidth: number): number;
/** Top border carrying the title, split by a `┬` over the column divider. */
export declare function topBorderSplit(width: number, title: string, sidebarWidth: number): string;
/** Section rule that closes the sidebar column with a `┴` over the divider. */
export declare function dividerSplit(width: number, sidebarWidth: number): string;
/** A two-column content row: `│ sidebar │ body │`, each inset by one column. */
export declare function splitRow(sidebar: string, body: string, width: number, sidebarWidth: number): string;
/** Sentinel child rendered by {@link OverlayPanel} as a `├───┤` section rule. */
export declare class PanelDivider implements Component {
    render(): readonly string[];
}
/**
 * Rounded-box container for inline overlays (selectors, run panels). Children
 * render inside `│ … │` rows between a titled top border and a bottom border,
 * so inline overlays share the chrome of fullscreen overlays. The top border
 * is exactly one row — `routeMouse` offsets written for a one-line top rule
 * stay valid — and content is inset two columns on each side.
 */
export declare class OverlayPanel implements Component {
    #private;
    children: Component[];
    constructor(title?: string);
    get title(): string;
    set title(value: string);
    addChild(component: Component): void;
    removeChild(component: Component): void;
    clear(): void;
    invalidate(): void;
    dispose(): void;
    setIgnoreTight(ignore: boolean): this;
    /**
     * Body rows at the given content width, without border chrome —
     * {@link render} draws exactly these (4 columns narrower) inside `│ … │`
     * rows. Lets callers and tests assert on component-content coordinates
     * instead of reverse-parsing box glyphs. `PanelDivider` children contribute
     * no rows here (their rule is border chrome).
     */
    renderContent(width: number): string[];
    render(width: number): readonly string[];
}
