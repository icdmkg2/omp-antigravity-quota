import type { AxNode, AxQuery, AxSnapshotOptions, DesktopCapabilities, DesktopDisplay, DesktopPoint, DesktopSessionOptions, DesktopWindow, PointerOptions } from "@oh-my-pi/pi-natives";
import type { ComputerWorkerInbound, ComputerWorkerTransport } from "./protocol.js";
/** Native desktop operations consumed by the script runtime. */
export interface NativeDesktopSession {
    readonly capabilities: DesktopCapabilities;
    listDisplays(): Promise<DesktopDisplay[]>;
    listWindows(): Promise<DesktopWindow[]>;
    capture(target: string, caps?: {
        maxWidth?: number;
        maxHeight?: number;
    } | null): Promise<{
        data: Uint8Array;
        width: number;
        height: number;
        sourceWidth: number;
        sourceHeight: number;
        target: string;
    }>;
    click(target: string, x: number, y: number, opts?: PointerOptions | null): Promise<void>;
    moveMouse(target: string, x: number, y: number, opts?: PointerOptions | null): Promise<void>;
    drag(target: string, points: DesktopPoint[], opts?: PointerOptions | null): Promise<void>;
    scroll(target: string, x: number, y: number, dx: number, dy: number, opts?: PointerOptions | null): Promise<void>;
    typeText(target: string, text: string, opts?: PointerOptions | null): Promise<void>;
    keyChord(target: string, keys: string[], opts?: PointerOptions | null): Promise<void>;
    raiseWindow(windowId: string): Promise<void>;
    axSnapshot(target: string, opts?: AxSnapshotOptions | null): Promise<{
        text: string;
    }>;
    axQuery(target: string, query: AxQuery): Promise<AxNode[]>;
    axElementAt(target: string, x: number, y: number): Promise<AxNode | null | undefined>;
    axFocused(): Promise<AxNode | null | undefined>;
    axNode(ref: string): Promise<AxNode>;
    axAttributes(ref: string): Promise<Array<[string, string]>>;
    axChildren(ref: string): Promise<AxNode[]>;
    axParent(ref: string): Promise<AxNode | null | undefined>;
    axPerform(ref: string, action: string): Promise<void>;
    axSetValue(ref: string, value: string): Promise<void>;
    axFocus(ref: string): Promise<void>;
    axClick(ref: string, opts?: PointerOptions | null): Promise<void>;
    close(): Promise<void>;
}
/** Creates the native session co-located with the computer worker runtime. */
export type NativeDesktopSessionFactory = (options: DesktopSessionOptions) => NativeDesktopSession;
/** Hosts the persistent JavaScript runtime and native desktop session. */
export declare class ComputerWorkerCore {
    #private;
    constructor(transport: ComputerWorkerTransport, createSession?: NativeDesktopSessionFactory);
    /** Routes one supervisor command into the persistent worker state. */
    handle(message: ComputerWorkerInbound): void;
}
