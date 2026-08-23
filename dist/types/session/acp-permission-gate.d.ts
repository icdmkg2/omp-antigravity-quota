import type { ClientBridgePermissionOption } from "./client-bridge.js";
/** Tools that require user permission before execution when an ACP client is connected. */
export declare const PERMISSION_REQUIRED_TOOLS: Record<string, true>;
/** Permission options presented to the client on each gated tool call. */
export declare const PERMISSION_OPTIONS: ClientBridgePermissionOption[];
/** Permission options indexed by their wire identifiers; unknown IDs miss and fail closed. */
export declare const PERMISSION_OPTIONS_BY_ID: Map<string, ClientBridgePermissionOption>;
/** Describes the permission prompt required for a destructive tool call. */
export declare function getPermissionIntent(toolName: string, args: unknown): {
    toolName: string;
    title: string;
    paths?: string[];
    cacheKey: string;
} | undefined;
/** Converts tool path arguments into absolute ACP editor locations. */
export declare function extractPermissionLocations(args: unknown, cwd: string, explicitPaths?: string[]): {
    path: string;
    line?: number;
}[];
