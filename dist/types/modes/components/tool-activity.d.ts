import { type Component, Container } from "@oh-my-pi/pi-tui";
export interface ToolActivityComponent {
    setToolActivityVisible(visible: boolean): void;
}
export declare function isToolActivityComponent(component: Component): component is Component & ToolActivityComponent;
export declare class ToolActivityContainer extends Container implements ToolActivityComponent {
    #private;
    constructor(component: Component | Component[]);
    setToolActivityVisible(visible: boolean): void;
    /**
     * Forward Ctrl+O expansion to wrapped children. The transcript's expansion
     * traversal only visits top-level children, so the wrapper must proxy or
     * wrapped renderers would freeze at their insertion-time expansion state.
     */
    setExpanded(expanded: boolean): void;
    render(width: number): readonly string[];
}
