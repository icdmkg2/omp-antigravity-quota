import { type SSHConnectionTarget } from "./connection-manager.js";
type MountPointStatReader = (filePath: string) => Promise<{
    dev: number;
}>;
interface MountCheckOptions {
    platform?: NodeJS.Platform;
    stat?: MountPointStatReader;
    which?: (command: string) => string | null;
}
export declare function hasSshfs(): boolean;
export declare function isMounted(mountPath: string, options?: MountCheckOptions): Promise<boolean>;
export declare function mountRemote(host: SSHConnectionTarget, remotePath?: string): Promise<string | undefined>;
export declare function unmountRemote(host: SSHConnectionTarget): Promise<boolean>;
export declare function unmountAll(): Promise<void>;
export {};
