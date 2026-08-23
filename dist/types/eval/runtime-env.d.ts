export declare const CASE_INSENSITIVE_ENV: boolean;
export declare const SECRET_KEY_PATTERN: RegExp;
export interface EnvFilterOptions {
    allowList: string[];
    windowsAllowList: string[];
    denyList: string[];
    allowPrefixes: string[];
}
/**
 * Creates an environment filter function based on the provided allowlists, denylists, and prefixes.
 */
export declare function createEnvFilter(options: EnvFilterOptions): (env: Record<string, string | undefined>) => Record<string, string | undefined>;
/**
 * Resolve an explicitly configured interpreter path, expanding `~` to the home directory.
 */
export declare function resolveExplicitPath(interpreter: string, cwd: string): string;
/**
 * Enumerates candidate runtimes in priority order.
 */
export declare function enumerateRuntimes<T>(cwd: string, baseEnv: Record<string, string | undefined>, binaryName: string, createRuntime: (executablePath: string, env: Record<string, string | undefined>) => T, interpreter?: string): T[];
/**
 * Resolves the highest-priority runtime. Throws when none exists.
 */
export declare function resolveRuntime<T>(cwd: string, baseEnv: Record<string, string | undefined>, binaryName: string, createRuntime: (executablePath: string, env: Record<string, string | undefined>) => T, interpreter?: string): T;
