export interface SSHHostConfig {
    host: string;
    username?: string;
    port?: number;
    keyPath?: string;
    description?: string;
    compat?: boolean;
}
export interface SSHConfigFile {
    hosts?: Record<string, SSHHostConfig>;
}
/**
 * Read an SSH config file.
 * Returns empty config if file doesn't exist.
 */
export declare function readSSHConfigFile(filePath: string): Promise<SSHConfigFile>;
/**
 * Write an SSH config file atomically.
 * Creates parent directories if they don't exist.
 */
export declare function writeSSHConfigFile(filePath: string, config: SSHConfigFile): Promise<void>;
/**
 * Validate host name.
 * @returns Error message if invalid, undefined if valid
 */
export declare function validateHostName(name: string): string | undefined;
/**
 * Add an SSH host to a config file.
 *
 * @throws Error if host name already exists or validation fails
 */
export declare function addSSHHost(filePath: string, name: string, hostConfig: SSHHostConfig): Promise<void>;
/**
 * Update an existing SSH host in a config file.
 * If the host doesn't exist, this will add it.
 *
 * @throws Error if validation fails
 */
export declare function updateSSHHost(filePath: string, name: string, hostConfig: SSHHostConfig): Promise<void>;
/**
 * Remove an SSH host from a config file.
 *
 * @throws Error if host doesn't exist
 */
export declare function removeSSHHost(filePath: string, name: string): Promise<void>;
/**
 * List all host names in a config file.
 */
export declare function listSSHHosts(filePath: string): Promise<string[]>;
