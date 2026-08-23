import { type Component, type ImageBudget } from "@oh-my-pi/pi-tui";
import type { CustomEditor } from "./custom-editor.js";
/**
 * The composer attachment band: one rounded card per staged attachment, rendered directly above
 * the prompt box. Image cards show a live thumbnail (Kitty Unicode placeholders — the only
 * protocol whose output is plain text cells and therefore composable inside a border row) with
 * the pixel dimensions as the bottom caption; text-paste cards show the leading snippet with a
 * `+N lines` / `N chars` caption. The top caption is the same `<icon> #N` token that sits in
 * the editor buffer, in the same identity color. Cards that no longer fit the terminal width
 * are omitted rather than wrapped. Renders to nothing while no attachment is staged.
 */
export declare class AttachmentChipsBand implements Component {
    #private;
    private readonly editor;
    private readonly budget;
    private readonly requestRender;
    constructor(editor: CustomEditor, budget: ImageBudget, requestRender: () => void);
    render(width: number): readonly string[];
}
