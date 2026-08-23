export type SetupComponent = "python" | "speech";
export interface SetupCommandArgs {
    component: SetupComponent;
    flags: {
        json?: boolean;
        check?: boolean;
    };
}
/**
 * Parse setup subcommand arguments.
 * Returns undefined if not a setup command.
 */
export declare function parseSetupArgs(args: string[]): SetupCommandArgs | undefined;
export interface PythonCheckResult {
    available: boolean;
    pythonPath?: string;
    usingManagedEnv?: boolean;
    managedEnvPath?: string;
}
/**
 * Check Python environment and kernel dependencies.
 */
export declare function checkPythonSetup(cwd: string, interpreter?: string): Promise<PythonCheckResult>;
/**
 * Install Python packages using uv (preferred) or pip.
 */
/**
 * Run the setup command.
 */
export declare function runSetupCommand(cmd: SetupCommandArgs): Promise<void>;
/**
 * Print setup command help.
 */
export declare function printSetupHelp(): void;
