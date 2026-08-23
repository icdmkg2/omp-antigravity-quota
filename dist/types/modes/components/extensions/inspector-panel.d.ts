import { type Component } from "@oh-my-pi/pi-tui";
import type { Extension } from "./types.js";
export declare class InspectorPanel implements Component {
    #private;
    setExtension(extension: Extension | null): void;
    invalidate(): void;
    render(width: number): readonly string[];
}
