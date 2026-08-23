export declare const EMBEDDED_COMMAND_TEMPLATES: ReadonlyArray<{
    name: string;
    content: string;
}>;
/** Workflow command definition */
export interface WorkflowCommand {
    name: string;
    description: string;
    instructions: string;
    source: "bundled" | "user" | "project";
    filePath: string;
}
/**
 * Load all bundled commands from embedded content.
 */
export declare function loadBundledCommands(): WorkflowCommand[];
/**
 * Discover all available commands.
 *
 * Precedence (highest wins): .omp > .pi > .claude (project before user), then bundled
 */
export declare function discoverCommands(cwd: string): Promise<WorkflowCommand[]>;
/**
 * Get a command by name.
 */
export declare function getCommand(commands: WorkflowCommand[], name: string): WorkflowCommand | undefined;
/**
 * Expand command instructions with task input.
 * Replaces $@ with the provided input.
 */
export declare function expandCommand(command: WorkflowCommand, input: string): string;
/**
 * Clear the bundled commands cache (for testing).
 */
export declare function clearBundledCommandsCache(): void;
