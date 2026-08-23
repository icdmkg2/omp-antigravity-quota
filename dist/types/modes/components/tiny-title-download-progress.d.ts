import { type Component } from "@oh-my-pi/pi-tui";
import { type TinyTitleLocalModelKey } from "../../tiny/models.js";
import type { TinyTitleProgressEvent } from "../../tiny/title-protocol.js";
export declare class TinyTitleDownloadProgressComponent implements Component {
    #private;
    constructor(modelKey: TinyTitleLocalModelKey);
    update(event: TinyTitleProgressEvent): void;
    isComplete(): boolean;
    invalidate(): void;
    render(width: number): readonly string[];
}
