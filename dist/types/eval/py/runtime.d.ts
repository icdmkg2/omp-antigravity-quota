export interface PythonRuntime {
    /** Path to python executable */
    pythonPath: string;
    /** Filtered environment variables */
    env: Record<string, string | undefined>;
    /** Path to virtual environment, if detected */
    venvPath?: string;
}
/**
 * Filter environment variables to a safe allowlist for Python subprocesses.
 * Removes sensitive API keys and limits to known-safe variables.
 */
export declare function filterEnv(env: Record<string, string | undefined>): Record<string, string | undefined>;
/**
 * Detect virtual environment path from VIRTUAL_ENV or common locations.
 */
export declare function resolveVenvPath(cwd: string): string | undefined;
/**
 * Resolve an explicitly configured interpreter (`python.interpreter`) into a
 * runtime, bypassing discovery. Does not probe or validate the executable —
 * callers must check it actually runs. `~` expands to the home directory and
 * relative paths resolve against `cwd`. When the interpreter sits inside a
 * virtualenv (a `pyvenv.cfg` above its bin dir), the venv activation env is
 * applied so subprocesses and `pip` resolve consistently.
 */
export declare function resolveExplicitPythonRuntime(interpreter: string, cwd: string, baseEnv: Record<string, string | undefined>): PythonRuntime;
/**
 * Enumerate candidate Python runtimes in priority order: an active/project venv,
 * the managed `~/.omp/python-env`, then the system interpreter on PATH. Every
 * candidate that physically exists is returned so callers can probe each in turn
 * rather than committing to the first — a managed env left behind by a removed
 * `uv` install no longer shadows a working system Python.
 */
export declare function enumeratePythonRuntimes(cwd: string, baseEnv: Record<string, string | undefined>): PythonRuntime[];
/**
 * Resolve the highest-priority Python runtime. Prefer {@link enumeratePythonRuntimes}
 * when you can probe candidates; this returns only the first one and throws when
 * no interpreter exists.
 */
export declare function resolvePythonRuntime(cwd: string, baseEnv: Record<string, string | undefined>): PythonRuntime;
