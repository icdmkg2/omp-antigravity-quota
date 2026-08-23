import type { InstalledPlugin } from "./types.js";
export declare function installPlugin(packageName: string): Promise<InstalledPlugin>;
export declare function uninstallPlugin(name: string): Promise<void>;
export declare function listPlugins(): Promise<InstalledPlugin[]>;
export declare function linkPlugin(localPath: string): Promise<void>;
