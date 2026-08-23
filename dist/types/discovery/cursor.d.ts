/**
 * Cursor Provider
 *
 * Loads configuration from Cursor's config directories.
 * Priority: 50 (tool-specific provider)
 *
 * Sources:
 * - User: ~/.cursor
 * - Project: .cursor/ (cwd only)
 *
 * Capabilities:
 * - mcps: From mcp.json with mcpServers key
 * - rules: From rules/*.mdc files with MDC frontmatter (description, globs, alwaysApply)
 * - settings: From settings.json if present
 */
export {};
