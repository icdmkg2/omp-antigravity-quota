import type { AgentToolContext, ToolCallContext } from "@oh-my-pi/pi-agent-core";
import type { CustomToolContext } from "../extensibility/custom-tools/types.js";
import type { ExtensionUIContext } from "../extensibility/extensions/types.js";
declare module "@oh-my-pi/pi-agent-core" {
    interface AgentToolContext extends CustomToolContext {
        ui?: ExtensionUIContext;
        hasUI?: boolean;
        toolNames?: string[];
        toolCall?: ToolCallContext;
        /** Set on `xd://` device dispatches: the write tool's outer approval gate
         *  already resolved this call at the mounted tool's tier, so the inner
         *  wrapper must not re-prompt for the same action (explicit per-tool
         *  policies and overrides still apply). */
        xdevApproved?: boolean;
        /** Reports the approval tier resolved after an extension rewrites an
         *  xd:// device call, so dispatch metadata describes the input that ran. */
        xdevTierResolved?(tier: "read" | "write" | "exec"): void;
        /** Set only after an interactive prompt approves provider computer safety checks. */
        providerSafetyApproved?: boolean;
    }
}
export declare class ToolContextStore {
    #private;
    private readonly getBaseContext;
    constructor(getBaseContext: () => CustomToolContext);
    getContext(toolCall?: ToolCallContext): AgentToolContext;
    setUIContext(uiContext: ExtensionUIContext, hasUI: boolean): void;
    setToolNames(names: string[]): void;
}
