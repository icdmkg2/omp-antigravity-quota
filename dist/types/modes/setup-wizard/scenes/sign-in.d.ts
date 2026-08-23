import { type SgrMouseEvent } from "@oh-my-pi/pi-tui";
import type { SetupSceneHost, SetupTab } from "./types.js";
/**
 * "Sign in" panel: lets the user authenticate one or more model providers via
 * OAuth. Unlike a standalone scene it never auto-advances the wizard — the user
 * may sign in to several providers and then continue with Esc.
 */
export declare class SignInTab implements SetupTab {
    #private;
    private readonly host;
    readonly id = "sign-in";
    readonly label = "Sign in";
    constructor(host: SetupSceneHost);
    /** Modal while an OAuth flow is running so the scene won't switch tabs or finish. */
    get modal(): boolean;
    dispose(): void;
    invalidate(): void;
    handleInput(data: string): void;
    /** Forward mouse to the provider selector; pointer is inert during an active login or code prompt. */
    routeMouse(event: SgrMouseEvent, line: number, col: number): void;
    render(width: number, maxLines?: number): readonly string[];
}
