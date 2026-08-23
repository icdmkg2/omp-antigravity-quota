import { getDaemonRuntimeDir } from "@oh-my-pi/pi-utils";
/** Resolve the private runtime directory shared by omp processes in one project directory. */
export { getDaemonRuntimeDir as daemonRuntimeDir };
/**
 * Canonicalize a project directory the same way every broker client does, so
 * hash-keyed runtime dirs and Windows pipe names agree across processes.
 * Missing paths resolve without realpath instead of failing.
 */
export declare function canonicalProjectDir(projectDir: string): Promise<string>;
/**
 * Record the scope's canonical project directory inside its runtime dir.
 * Written by the broker at startup so out-of-process inspectors (`omp ps`)
 * can map a hash-keyed runtime dir back to its project.
 */
export declare function writeDaemonScopeMeta(runtimeDir: string, projectDir: string): Promise<void>;
/** Read the project directory recorded for a runtime dir; undefined when absent or malformed. */
export declare function readDaemonScopeMeta(runtimeDir: string): Promise<string | undefined>;
/** Resolve the Unix socket or Windows named pipe used by one daemon broker scope. */
export declare function daemonBrokerEndpoint(projectDir: string, runtimeDir: string): string;
