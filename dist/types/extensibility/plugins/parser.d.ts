/**
 * Feature bracket parser for plugin specifiers.
 *
 * Supports syntax like:
 * - "my-plugin" -> base features (null)
 * - "my-plugin[search,web]" -> specific features
 * - "my-plugin[*]" -> all features
 * - "my-plugin[]" -> no optional features
 * - "@scope/plugin@1.2.3[feat]" -> scoped with version and features
 */
export interface ParsedPluginSpec {
    /** Package name (may include version specifier like @1.0.0) */
    packageName: string;
    /**
     * Feature selection:
     * - null: use defaults (base features on first install, preserve on reinstall)
     * - "*": all features
     * - string[]: specific features (empty array = no optional features)
     */
    features: string[] | null | "*";
}
/**
 * Parse plugin specifier with feature bracket syntax.
 *
 * @example
 * parsePluginSpec("my-plugin") // { packageName: "my-plugin", features: null }
 * parsePluginSpec("my-plugin[search,web]") // { packageName: "my-plugin", features: ["search", "web"] }
 * parsePluginSpec("my-plugin[*]") // { packageName: "my-plugin", features: "*" }
 * parsePluginSpec("my-plugin[]") // { packageName: "my-plugin", features: [] }
 * parsePluginSpec("@scope/pkg@1.2.3[feat]") // { packageName: "@scope/pkg@1.2.3", features: ["feat"] }
 */
export declare function parsePluginSpec(spec: string): ParsedPluginSpec;
/**
 * Format a parsed plugin spec back to string form.
 *
 * @example
 * formatPluginSpec({ packageName: "pkg", features: null }) // "pkg"
 * formatPluginSpec({ packageName: "pkg", features: "*" }) // "pkg[*]"
 * formatPluginSpec({ packageName: "pkg", features: [] }) // "pkg[]"
 * formatPluginSpec({ packageName: "pkg", features: ["a", "b"] }) // "pkg[a,b]"
 */
export declare function formatPluginSpec(spec: ParsedPluginSpec): string;
/**
 * Extract the dependency key from an npm package specifier.
 * Used for path lookups after npm install.
 *
 * @example
 * extractPackageName("lodash@4.17.21") // "lodash"
 * extractPackageName("@scope/pkg@1.0.0") // "@scope/pkg"
 * extractPackageName("@scope/pkg") // "@scope/pkg"
 * extractPackageName("npm:lodash") // "lodash"
 */
export declare function extractPackageName(specifier: string): string;
