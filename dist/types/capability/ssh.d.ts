import type { SourceMeta } from "./types.js";
/**
 * Canonical SSH host entry.
 */
export interface SSHHost {
    /** Host name (config key) */
    name: string;
    /** Host address or DNS name */
    host: string;
    /** Optional username override */
    username?: string;
    /** Optional port override */
    port?: number;
    /** Optional identity key path */
    keyPath?: string;
    /** Optional host description */
    description?: string;
    /** Optional compatibility mode flag */
    compat?: boolean;
    /** Source metadata (added by loader) */
    _source: SourceMeta;
}
export declare const sshCapability: import("./types.js").Capability<SSHHost>;
