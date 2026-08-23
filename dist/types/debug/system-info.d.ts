/**
 * System information collection for debug reports.
 */
export interface SystemInfo {
    os: string;
    arch: string;
    cpu: string;
    memory: {
        total: number;
        free: number;
    };
    versions: {
        app: string;
        bun: string;
        node: string;
    };
    cwd: string;
    shell: string;
    terminal: string | undefined;
}
/** Collect system information */
export declare function collectSystemInfo(): Promise<SystemInfo>;
/** Format system info for display */
export declare function formatSystemInfo(info: SystemInfo): string;
/** Sanitize environment variables by redacting sensitive values */
export declare function sanitizeEnv(env: Record<string, string | undefined>): Record<string, string>;
