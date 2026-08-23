import type { ToolSession } from "../tools/index.js";
import type { WritethroughDeferredHandle } from "./index.js";
/** Coordinates late LSP diagnostics for one mutation tool instance. */
export declare class DeferredDiagnostics {
    #private;
    private readonly session;
    private readonly deduplicate;
    constructor(session: ToolSession, deduplicate: boolean);
    /** Begin a file mutation and return the handle consumed by LSP writethrough. */
    begin(path: string): WritethroughDeferredHandle;
}
