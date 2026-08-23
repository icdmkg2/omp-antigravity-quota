import type { LoadExtensionsResult } from "./types.js";
/** Formats extension load failures for user-visible startup diagnostics. */
export declare function formatExtensionLoadNotifications(errors: LoadExtensionsResult["errors"]): string[];
