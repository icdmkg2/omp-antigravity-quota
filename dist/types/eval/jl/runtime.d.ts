export interface JuliaRuntime {
    /** Path to the julia executable. */
    juliaPath: string;
    /** Filtered environment variables. */
    env: Record<string, string | undefined>;
}
export declare const filterEnv: (env: Record<string, string | undefined>) => Record<string, string | undefined>;
/**
 * Resolve an explicitly configured interpreter (`julia.interpreter`) into a
 * runtime, bypassing discovery. Does not probe the executable.
 * `~` expands to the home directory and relative paths resolve against `cwd`.
 */
export declare function resolveExplicitJuliaRuntime(interpreter: string, cwd: string, baseEnv: Record<string, string | undefined>): JuliaRuntime;
/**
 * Enumerate candidate Julia runtimes in priority order. With an explicit
 * interpreter that is the only candidate; otherwise the first `julia` on PATH.
 */
export declare function enumerateJuliaRuntimes(cwd: string, baseEnv: Record<string, string | undefined>, interpreter?: string): JuliaRuntime[];
/**
 * Resolve the highest-priority Julia runtime. Throws when none exists.
 */
export declare function resolveJuliaRuntime(cwd: string, baseEnv: Record<string, string | undefined>, interpreter?: string): JuliaRuntime;
