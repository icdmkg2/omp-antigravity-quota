import type { ImageContent } from "@oh-my-pi/pi-ai";
export interface Osc5522Packet {
    metadata: Map<string, string>;
    payload: string;
}
export interface EnhancedPasteHandlers {
    write(data: string): void;
    pasteText(text: string): void;
    pasteImage(image: ImageContent): void | Promise<void>;
    showStatus(message: string): void;
}
export declare function isOsc5522Packet(data: string): boolean;
export declare function parseOsc5522Packet(data: string): Osc5522Packet | undefined;
export declare class EnhancedPasteController {
    #private;
    constructor(handlers: EnhancedPasteHandlers);
    enable(): void;
    disable(): void;
    handleInput(data: string): boolean;
}
