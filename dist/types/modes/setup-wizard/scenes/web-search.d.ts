import { type SgrMouseEvent } from "@oh-my-pi/pi-tui";
import type { SetupSceneHost, SetupTab } from "./types.js";
/**
 * "Web search" panel: picks the provider the web_search tool should prefer and
 * reports whether the highlighted provider is ready to use given current
 * credentials (env keys or OAuth sign-ins from the Sign in tab) or an
 * unauthenticated fallback.
 */
export declare class WebSearchTab implements SetupTab {
    #private;
    private readonly host;
    readonly id = "web-search";
    readonly label = "Web search";
    readonly modal = false;
    constructor(host: SetupSceneHost);
    onActivate(): void;
    handleInput(data: string): void;
    /** Wheel moves the highlight; hover lights the row under the pointer; click confirms it. */
    routeMouse(event: SgrMouseEvent, line: number, _col: number): void;
    invalidate(): void;
    dispose(): void;
    render(width: number, maxLines?: number): readonly string[];
}
