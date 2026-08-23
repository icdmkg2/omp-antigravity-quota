export interface RubyRuntime {
    /** Path to the ruby executable. */
    rubyPath: string;
    /** Filtered environment variables. */
    env: Record<string, string | undefined>;
}
export declare const filterEnv: (env: Record<string, string | undefined>) => Record<string, string | undefined>;
/**
 * Resolve an explicitly configured interpreter (`ruby.interpreter`) into a
 * runtime, bypassing discovery. Does not probe the executable — callers must
 * check it actually runs. `~` expands to the home directory and relative paths
 * resolve against `cwd`.
 */
export declare function resolveExplicitRubyRuntime(interpreter: string, cwd: string, baseEnv: Record<string, string | undefined>): RubyRuntime;
/**
 * Enumerate candidate Ruby runtimes in priority order. With an explicit
 * interpreter that is the only candidate; otherwise the first `ruby` on PATH.
 */
export declare function enumerateRubyRuntimes(cwd: string, baseEnv: Record<string, string | undefined>, interpreter?: string): RubyRuntime[];
/**
 * Resolve the highest-priority Ruby runtime. Throws when none exists.
 */
export declare function resolveRubyRuntime(cwd: string, baseEnv: Record<string, string | undefined>, interpreter?: string): RubyRuntime;
